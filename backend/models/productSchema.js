import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Medicine name (e.g., Flogocide)
  strength: { type: String },              // mg or g (e.g., 15g, 500mg)
  category: { type: String, required: true },  
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  desc: { type: String },

  // Identification
  gtin: { type: String, required: true },      // e.g., 08964001712718
  batchNo: { type: String, required: true },   // e.g., B.4235
  serialNo: { type: String },       

  // Stock & pricing
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0},
  reorderLevel: { type: Number, default: 10 },

  // Shelf tracking
  C: { type: String },   // Column
  R: { type: String },   // Row

  // Expiry
  expiryDate: { type: Date },

  // System
  createdAt: { type: Date, default: Date.now },
});

// Ensure GTIN + BatchNo is unique
productSchema.index({ gtin: 1, batchNo: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
