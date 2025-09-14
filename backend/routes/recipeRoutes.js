const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const auth = require("../middleware/auth");

// GET all recipes with search, filter, pagination
router.get("/", recipeController.getRecipes);
// GET single recipe with ingredients
router.get("/:id", recipeController.getRecipe);
// POST create new recipe (manager only)
router.post("/", auth, recipeController.createRecipe);
// PUT update recipe (manager only)
router.put("/:id", auth, recipeController.updateRecipe);
// DELETE recipe (manager only)
router.delete("/:id", auth, recipeController.deleteRecipe);

module.exports = router;
