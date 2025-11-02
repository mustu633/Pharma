import mongoose from "mongoose";

const invoiceProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    category: { type: String },
    gtin: { type: String },
    batchNo: { type: String },
    expiryDate: { type: Date },
    price: { type: Number, required: true },       // price at sale time
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },        // price * quantity (BEFORE invoice-level discount)
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },

    // Totals
    subtotal: { type: Number, required: true },            // sum of product totals (before discount)
    discountPercent: { type: Number, default: 0 },         // invoice-level discount %
    discountAmount: { type: Number, default: 0 },          // subtotal * discount%
    totalAfterDiscount: { type: Number, required: true },  // subtotal - discountAmount

    products: [invoiceProductSchema],
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
