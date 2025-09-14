/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Clock,
  Users,
  X,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeFormData {
  name: string;
  category: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  price: number;
  status: "active" | "inactive";
  ingredients: Ingredient[];
  instructions: string;
}

const initialRecipe: RecipeFormData = {
  name: "",
  category: "",
  servings: 1,
  prepTime: 0,
  cookTime: 0,
  price: 0,
  status: "active",
  ingredients: [{ name: "", quantity: 0, unit: "" }],
  instructions: "",
};

const API_URL = "http://localhost:5001/api/recipes";

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [newRecipe, setNewRecipe] = useState<RecipeFormData>(initialRecipe);
  const [ingredientFields, setIngredientFields] = useState<Ingredient[]>([
    { name: "", quantity: 0, unit: "" },
  ]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch recipes from backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        const res = await axios.get(API_URL, { params });
        setRecipes(res.data.recipes);
      } catch (err) {
        // handle error
      }
    };
    fetchRecipes();
  }, [searchTerm]);

  // Add new recipe
  const handleSubmit = async () => {
    try {
      const recipeData = {
        name: newRecipe.name,
        category: newRecipe.category,
        servings: newRecipe.servings,
        prepTime: newRecipe.prepTime,
        cookTime: newRecipe.cookTime,
        instructions: newRecipe.instructions,
        price: newRecipe.price,
        status: newRecipe.status,
        ingredients: ingredientFields,
      };
      await axios.post(API_URL, recipeData, { headers: getAuthHeaders() });
      setIsAddDialogOpen(false);
      setNewRecipe(initialRecipe);
      setIngredientFields([{ name: "", quantity: 0, unit: "" }]);
      // Refresh list
      const res = await axios.get(API_URL);
      setRecipes(res.data.recipes);
    } catch (err) {
      // handle error
    }
  };

  // Delete recipe
  const handleDeleteRecipe = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
      setRecipes(recipes.filter((r) => r._id !== id));
    } catch (err) {
      // handle error
    }
  };

  // Update recipe
  const handleUpdateRecipe = async () => {
    if (!selectedRecipe) return;
    try {
      const recipeData = {
        ...selectedRecipe,
        ingredients: selectedRecipe.ingredients,
      };
      await axios.put(`${API_URL}/${selectedRecipe._id}`, recipeData, {
        headers: getAuthHeaders(),
      });
      setSelectedRecipe(null);
      // Refresh list
      const res = await axios.get(API_URL);
      setRecipes(res.data.recipes);
    } catch (err) {
      // handle error
    }
  };

  // Ingredient field handlers
  const handleAddIngredient = () => {
    setIngredientFields([
      ...ingredientFields,
      { name: "", quantity: 0, unit: "" },
    ]);
  };
  const handleRemoveIngredient = (index: number) => {
    setIngredientFields(ingredientFields.filter((_, i) => i !== index));
  };
  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = [...ingredientFields];
    if (field === "quantity") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setIngredientFields(updated);
  };

  const filteredRecipes = Array.isArray(recipes)
    ? recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipe Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant's recipes and costs
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
              <DialogDescription>
                Fill in the details for your new recipe
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Recipe Name</Label>
                <Input
                  id="name"
                  value={newRecipe.name}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, name: e.target.value })
                  }
                  placeholder="e.g., Margherita Pizza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newRecipe.category}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, category: e.target.value })
                  }
                  placeholder="e.g., Pizza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={newRecipe.servings}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      servings: Number(e.target.value),
                    })
                  }
                  placeholder="e.g., 4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  value={newRecipe.prepTime}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      prepTime: Number(e.target.value),
                    })
                  }
                  placeholder="e.g., 15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  value={newRecipe.cookTime}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      cookTime: Number(e.target.value),
                    })
                  }
                  placeholder="e.g., 20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newRecipe.price}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="e.g., 12.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newRecipe.status}
                  onChange={(e) =>
                    setNewRecipe({
                      ...newRecipe,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Ingredients</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Ingredient
                </Button>
              </div>
              <div className="border rounded-lg p-4 space-y-4">
                {ingredientFields.map((ingredient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    <div className="col-span-4">
                      <Label htmlFor={`ingredient-name-${index}`}>Name</Label>
                      <Input
                        id={`ingredient-name-${index}`}
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                        placeholder="e.g., Pizza Dough"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`ingredient-quantity-${index}`}>
                        Quantity
                      </Label>
                      <Input
                        id={`ingredient-quantity-${index}`}
                        type="number"
                        step="0.01"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`ingredient-unit-${index}`}>Unit</Label>
                      <Input
                        id={`ingredient-unit-${index}`}
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, "unit", e.target.value)
                        }
                        placeholder="e.g., piece"
                      />
                    </div>
                    <div className="col-span-1">
                      {ingredientFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={newRecipe.instructions}
                onChange={(e) =>
                  setNewRecipe({ ...newRecipe, instructions: e.target.value })
                }
                placeholder="Step-by-step instructions..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSubmit}>
                Add Recipe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter by Category</Button>
            <Button variant="outline">Sort by Cost</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recipes ({filteredRecipes.length})</CardTitle>
          <CardDescription>
            Complete list of all recipes with cost analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipe</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{recipe.name}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {recipe.prepTime} prep, {recipe.cookTime} cook
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${recipe.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={recipe.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRecipe(recipe._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={!!selectedRecipe}
        onOpenChange={() => setSelectedRecipe(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRecipe?.name}</DialogTitle>
            <DialogDescription>
              Recipe details and ingredients
            </DialogDescription>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    {selectedRecipe.servings}
                  </p>
                  <p className="text-sm text-muted-foreground">Servings</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    {selectedRecipe.prepTime}
                  </p>
                  <p className="text-sm text-muted-foreground">Prep Time</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    {selectedRecipe.cookTime}
                  </p>
                  <p className="text-sm text-muted-foreground">Cook Time</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Ingredients</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRecipe.ingredients.map(
                        (ingredient: Ingredient, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {ingredient.name}
                            </TableCell>
                            <TableCell>{ingredient.quantity}</TableCell>
                            <TableCell>{ingredient.unit}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Instructions</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p>{selectedRecipe.instructions}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeManagement;
