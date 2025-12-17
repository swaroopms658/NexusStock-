import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", InventoryItemSchema);
