import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  // Snapshot at sale time
  productName: { type: String, required: true },
  category: { type: String },
  gtin: { type: String, required: true },
  batchNo: { type: String, required: true },
  mg: { type: String },              // optional
  expiryDate: { type: Date },        // ✅ added

  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },

  // BEFORE invoice discount (line total)
  totalPrice: { type: Number, required: true },

  // Invoice-level discount snapshot (optional but useful)
  invoiceNo: { type: String },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },  // this line’s share of invoice discount
  finalPrice: { type: Number },                  // totalPrice - discountAmount

  saleDate: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);
export default Sale;
