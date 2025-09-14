const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    servings: { type: Number, required: true, min: 1 },
    prepTime: { type: Number, required: true, min: 0 }, // in minutes
    cookTime: { type: Number, required: true, min: 0 }, // in minutes
    instructions: { type: String, required: true },
    cost: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
