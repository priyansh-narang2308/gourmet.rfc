const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    unit: { type: String, required: true },
    category: { type: String, required: true, index: true },
    supplier: { type: String, required: true, index: true },
    currentStock: { type: Number, required: true, min: 0 },
    minLevel: { type: Number, required: true, min: 0 },
    maxLevel: { type: Number, required: true, min: 0 },
    costPerUnit: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
