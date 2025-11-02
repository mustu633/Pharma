import express from "express";
import Product from "../models/productSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { protect } from "../middlewares/auth.js";

const productRouter = express.Router();

//  CREATE A NEW PRODUCT
productRouter.post("/", protect, async (req, res, next) => {
  try {
    const {
      name,
      strength,
      category,
      price,
      quantity,
      reorderLevel,
      desc,
      gtin,
      batchNo,
      serialNo,
      expiryDate,
      C,
      R,
      supplier,
    } = req.body;

    if (!name || !category || !price || !quantity || !expiryDate || !supplier || !gtin || !batchNo) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Check if product with same GTIN + Batch already exists
    let product = await Product.findOne({ gtin, batchNo });

    if (product) {
      product.quantity += quantity; // If same batch exists, update stock
      await product.save();
      return res.status(201).json({
        success: true,
        message: "Product quantity updated!",
        product,
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      strength,
      category,
      price,
      quantity,
      reorderLevel,
      desc,
      gtin,
      batchNo,
      serialNo,
      expiryDate,
      C,
      R,
      supplier,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added!",
      newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error,
    });
  }
});

//  GET ALL PRODUCTS
productRouter.get("/", async (req, res, next) => {
  try {
    const products = await Product.find().populate("supplier");
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found. Please add some.",
      });
    }
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler("Failed to get products"), 404);
  }
});

//search product by name / gtin or batch no
productRouter.get("/search", async (req, res) => {
  try {
    const { query = "" } = req.query;
    const rx = new RegExp(query, "i");

    const products = await Product.find({
      $or: [{ name: rx }, { gtin: rx }, { batchNo: rx }],
    })
      .populate("supplier", "name")
      .limit(100);

    res.json({ success: true, products });
  } catch (e) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

//  GET A PRODUCT BY ID
productRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler("Some error from your request!"), 404);
  }
});

//  UPDATE A PRODUCT
productRouter.put("/:id", protect, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated",
      updatedProduct,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to update product"), error);
  }
});

//  DELETE A PRODUCT
productRouter.delete("/:id", protect, async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to delete product"), error);
  }
});

//  GET PRODUCT REPORTS
productRouter.get("/inventory/report", async (req, res) => {
  try {
    const products = await Product.find();

    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const totalStock = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    const productsToReorder = products.filter(
      (product) => product.quantity <= product.reorderLevel
    );

    res.json({
      success: true,
      report: {
        totalInventoryValue,
        totalStock,
        productsToReorder,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate inventory report" 
    });
  }
});

//  FIND PRODUCT BY GTIN + BATCH NO
productRouter.get("/lookup/:gtin?/:batchNo?", async (req, res) => {
  try {
    const { gtin, batchNo } = req.params;

    const conditions = [];
    if (gtin && gtin !== "null" && gtin !== "undefined") {
      conditions.push({ gtin });
    }
    if (batchNo && batchNo !== "null" && batchNo !== "undefined") {
      conditions.push({ batchNo });
    }

    if (conditions.length === 0) {
      return res.status(400).json({ success: false, message: "Provide GTIN or BatchNo" });
    }

    const product = await Product.findOne({ $or: conditions });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error finding product" });
  }
});




export default productRouter;
