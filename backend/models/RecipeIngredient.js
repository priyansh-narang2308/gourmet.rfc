const mongoose = require("mongoose");

const recipeIngredientSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      index: true,
    },
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

recipeIngredientSchema.index({ recipe: 1, ingredient: 1 }); // Compound index for search

module.exports = mongoose.model("RecipeIngredient", recipeIngredientSchema);
