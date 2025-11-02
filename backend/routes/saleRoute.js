import express from "express";
import Sale from "../models/saleSchema.js";
import Invoice from "../models/invoiceSchema.js";
import Product from "../models/productSchema.js";
import checkStockLevels from "../utils/stockAlert.js";

const saleRouter = express.Router();

/**
 * POST /api/sales
 * Body: {
 *   cart: [{ productId, quantity }],
 *   discountPercent: Number
 * }
 * - Creates Sale line-items
 * - Creates ONE Invoice with discount applied at invoice level
 * - Updates stock
 */
saleRouter.post("/", async (req, res) => {
  try {
    const { cart, discountPercent = 0 } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const invoiceProducts = [];
    let subtotal = 0;

    const lowStockProductsAll = [];
    const saleDocs = [];

    // generate invoiceNo (simple; you can switch to a sequence if you like)
    const invoiceNo = "INV-" + Date.now();

    for (const item of cart) {
      const { productId, quantity } = item;
      const foundProduct = await Product.findById(productId);
      if (!foundProduct) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`,
        });
      }
      if (quantity <= 0 || quantity > foundProduct.quantity) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${foundProduct.name}`,
        });
      }

      const lineTotal = foundProduct.price * quantity;
      subtotal += lineTotal;

      // prepare invoice.products[]
      invoiceProducts.push({
        productId: foundProduct._id,
        name: foundProduct.name,
        category: foundProduct.category,
        gtin: foundProduct.gtin,
        batchNo: foundProduct.batchNo,
        expiryDate: foundProduct.expiryDate,
        price: foundProduct.price,
        quantity,
        total: lineTotal,
      });

      // create Sale line item snapshot
      const sale = await Sale.create({
        product: foundProduct._id,
        productName: foundProduct.name,
        category: foundProduct.category,
        gtin: foundProduct.gtin,
        batchNo: foundProduct.batchNo,
        expiryDate: foundProduct.expiryDate,
        quantity,
        pricePerUnit: foundProduct.price,
        totalPrice: lineTotal,
        invoiceNo,
        discountPercent, // invoice-level snapshot
        // discountAmount & finalPrice will be back-filled after we compute invoice discount
      });
      saleDocs.push(sale);

      // update stock
      foundProduct.quantity -= quantity;
      await foundProduct.save();

      // capture low stock
      const lowStock = await checkStockLevels();
      if (lowStock?.length) lowStockProductsAll.push(...lowStock);
    }

    // compute discount
    const pct = Number(discountPercent) || 0;
    const discountAmount = +(subtotal * pct / 100).toFixed(2);
    const totalAfterDiscount = +(subtotal - discountAmount).toFixed(2);

    // create invoice
    const invoice = await Invoice.create({
      invoiceNo,
      subtotal,
      discountPercent: pct,
      discountAmount,
      totalAfterDiscount,
      products: invoiceProducts,
    });

    // spread invoice discount proportionally across Sale lines (optional but useful)
    for (const sale of saleDocs) {
      const proportion = sale.totalPrice / subtotal || 0;
      const lineDiscount = +(discountAmount * proportion).toFixed(2);
      const finalPrice = +(sale.totalPrice - lineDiscount).toFixed(2);

      sale.discountAmount = lineDiscount;
      sale.finalPrice = finalPrice;
      await sale.save();
    }

    res.status(201).json({
      success: true,
      message: lowStockProductsAll.length
        ? "Sale completed. Some products are low in stock."
        : "Sale completed.",
      invoice,
      lowStockProducts: lowStockProductsAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create sale",
      error: error.message,
    });
  }
});

/**
 * GET /api/sales
 * (unchanged; if you want raw sale items)
 */
saleRouter.get("/", async (_req, res) => {
  try {
    const sales = await Sale.find().populate("product");
    res.status(200).json(sales);
  } catch {
    res.status(500).json({ success: false, message: "Failed to get sales" });
  }
});

/**
 * Helper: aggregate product lines from sales within a date window
 */
async function summarizeSalesRange(start, end) {
  // use the correct schema field
  const q = { saleDate: { $gte: start, $lte: end } };
  const sales = await Sale.find(q);

  const subtotalBefore = sales.reduce((s, x) => s + x.totalPrice, 0);
  const totalAfterDiscount = sales.reduce(
    (s, x) => s + (x.finalPrice || x.totalPrice),
    0
  );
  const totalItemsSold = sales.reduce((s, x) => s + x.quantity, 0);

  // aggregate product lines
  const map = new Map();
  for (const s of sales) {
    const key = `${s.productName}|${s.category || ""}|${s.gtin || ""}|${s.batchNo || ""}`;
    const prev = map.get(key) || {
      name: s.productName,
      category: s.category,
      gtin: s.gtin,
      batchNo: s.batchNo,
      quantity: 0,
      amount: 0,
    };
    prev.quantity += s.quantity;
    prev.amount += s.totalPrice; // before discount
    map.set(key, prev);
  }

  const aggregatedProducts = Array.from(map.values());

  return { subtotalBefore, totalAfterDiscount, totalItemsSold, aggregatedProducts };
}




/**
 * GET /api/sales/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * - Use invoice data
 * - If dates missing, default to "today"
 */
// routes/saleRoute.js
// GET /api/sales/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// GET /api/sales/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
saleRouter.get("/report", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate);     end.setHours(23,59,59,999);

    const summary = await summarizeSalesRange(start, end);

    res.json({ success: true, report: { startDate, endDate, ...summary } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sales/report/by-date?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
saleRouter.get("/report/by-date", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start and End dates are required" });
    }

    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate);     end.setHours(23,59,59,999);

    const summary = await summarizeSalesRange(start, end);

    res.json({ success: true, report: { startDate, endDate, ...summary } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to generate sales report" });
  }
});


export default saleRouter;
