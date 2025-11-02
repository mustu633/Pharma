import express from "express";
import Invoice from "../models/invoiceSchema.js";

const invoiceRouter = express.Router();

// GET all invoices
invoiceRouter.get("/", async (req, res) => {
    try {
      const invoices = await Invoice.find().sort({ date: -1 }).limit(100);
      res.json({ success: true, invoices });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  

// GET /api/invoices/:id
invoiceRouter.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.json({ success: true, invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default invoiceRouter;
