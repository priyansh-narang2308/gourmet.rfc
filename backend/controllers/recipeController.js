const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const RecipeIngredient = require("../models/RecipeIngredient");
const mongoose = require("mongoose");

// Helper: Calculate total cost from ingredients
async function calculateCost(recipeId) {
  const links = await RecipeIngredient.find({ recipe: recipeId }).populate(
    "ingredient"
  );
  let totalCost = 0;
  links.forEach((link) => {
    if (link.ingredient && link.ingredient.costPerUnit) {
      totalCost += link.quantity * link.ingredient.costPerUnit;
    }
  });
  return totalCost;
}

// GET /api/recipes?search=&category=&status=&page=&limit=
exports.getRecipes = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (status) query.status = status;
    const recipes = await Recipe.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Recipe.countDocuments(query);
    res.json({ recipes, total });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/recipes/:id
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    const ingredients = await RecipeIngredient.find({
      recipe: recipe._id,
    }).populate("ingredient");
    res.json({ recipe, ingredients });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    // Only manager can create
    if (req.user.role !== "manager")
      return res.status(403).json({ message: "Forbidden" });
    const {
      name,
      category,
      servings,
      prepTime,
      cookTime,
      instructions,
      price,
      status,
      ingredients,
    } = req.body;
    const recipe = new Recipe({
      name,
      category,
      servings,
      prepTime,
      cookTime,
      instructions,
      price,
      status,
      createdBy: req.user._id,
    });
    await recipe.save();
    // Add ingredients
    if (Array.isArray(ingredients)) {
      for (const item of ingredients) {
        await RecipeIngredient.create({
          recipe: recipe._id,
          ingredient: item.ingredient,
          quantity: item.quantity,
        });
      }
    }
    recipe.cost = await calculateCost(recipe._id);
    await recipe.save();
    res.status(201).json({ recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    // Only manager can update
    if (req.user.role !== "manager")
      return res.status(403).json({ message: "Forbidden" });
    const {
      name,
      category,
      servings,
      prepTime,
      cookTime,
      instructions,
      price,
      status,
      ingredients,
    } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    Object.assign(recipe, {
      name,
      category,
      servings,
      prepTime,
      cookTime,
      instructions,
      price,
      status,
    });
    await recipe.save();
    // Update ingredients
    if (Array.isArray(ingredients)) {
      await RecipeIngredient.deleteMany({ recipe: recipe._id });
      for (const item of ingredients) {
        await RecipeIngredient.create({
          recipe: recipe._id,
          ingredient: item.ingredient,
          quantity: item.quantity,
        });
      }
    }
    // Recalculate cost and profit
    recipe.cost = await calculateCost(recipe._id);
    await recipe.save();
    res.json({ recipe });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    if (req.user.role !== "manager")
      return res.status(403).json({ message: "Forbidden" });
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    await RecipeIngredient.deleteMany({ recipe: recipe._id });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
