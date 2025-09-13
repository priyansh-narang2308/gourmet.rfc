/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { recipesData } from "@/data/mockData";
import StatusBadge from "@/components/shared/StatusBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  cost: string;
}

interface RecipeFormData {
  name: string;
  category: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  price: string;
  status: string;
  ingredients: Ingredient[];
  instructions: string;
  prepItems: string[];
}

const RecipeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<
    (typeof recipesData)[0] | null
  >(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [recipes, setRecipes] = useState(recipesData);
  const [newRecipe, setNewRecipe] = useState<RecipeFormData>({
    name: "",
    category: "",
    servings: "",
    prepTime: "",
    cookTime: "",
    price: "",
    status: "active",
    ingredients: [{ name: "", quantity: "", unit: "", cost: "" }],
    instructions: "",
    prepItems: [""],
  });

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        { name: "", quantity: "", unit: "", cost: "" },
      ],
    });
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients.splice(index, 1);
    setNewRecipe({
      ...newRecipe,
      ingredients: updatedIngredients,
    });
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setNewRecipe({
      ...newRecipe,
      ingredients: updatedIngredients,
    });
  };

  const handleAddPrepItem = () => {
    setNewRecipe({
      ...newRecipe,
      prepItems: [...newRecipe.prepItems, ""],
    });
  };

  const handleRemovePrepItem = (index: number) => {
    const updatedPrepItems = [...newRecipe.prepItems];
    updatedPrepItems.splice(index, 1);
    setNewRecipe({
      ...newRecipe,
      prepItems: updatedPrepItems,
    });
  };

  const handlePrepItemChange = (index: number, value: string) => {
    const updatedPrepItems = [...newRecipe.prepItems];
    updatedPrepItems[index] = value;
    setNewRecipe({
      ...newRecipe,
      prepItems: updatedPrepItems,
    });
  };

  const calculateTotalCost = () => {
    return newRecipe.ingredients.reduce((total, ingredient) => {
      const cost = parseFloat(ingredient.cost) || 0;
      return total + cost;
    }, 0);
  };

  const calculateProfit = () => {
    const cost = calculateTotalCost();
    const price = parseFloat(newRecipe.price) || 0;
    return price - cost;
  };

  const calculateMargin = () => {
    const cost = calculateTotalCost();
    const price = parseFloat(newRecipe.price) || 0;
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  const handleSubmit = () => {
    const totalCost = calculateTotalCost();
    const profit = calculateProfit();
    const margin = calculateMargin();

    const newRecipeItem = {
      id: recipes.length + 1,
      name: newRecipe.name,
      category: newRecipe.category,
      servings: parseInt(newRecipe.servings) || 0,
      prepTime: newRecipe.prepTime,
      cookTime: newRecipe.cookTime,
      cost: totalCost,
      price: parseFloat(newRecipe.price) || 0,
      profit: profit,
      margin: margin,
      status: newRecipe.status as any,
      ingredients: newRecipe.ingredients.map((ing) => ({
        name: ing.name,
        quantity: parseFloat(ing.quantity) || 0,
        unit: ing.unit,
        cost: parseFloat(ing.cost) || 0,
      })),
      instructions: newRecipe.instructions,
      prepItems: newRecipe.prepItems.filter((item) => item.trim() !== ""),
    };

    setRecipes([...recipes, newRecipeItem]);
    setIsAddDialogOpen(false);

    // Reset form
    setNewRecipe({
      name: "",
      category: "",
      servings: "",
      prepTime: "",
      cookTime: "",
      price: "",
      status: "active",
      ingredients: [{ name: "", quantity: "", unit: "", cost: "" }],
      instructions: "",
      prepItems: [""],
    });
  };

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
                <Select
                  value={newRecipe.category}
                  onValueChange={(value) =>
                    setNewRecipe({ ...newRecipe, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pizza">Pizza</SelectItem>
                    <SelectItem value="pasta">Pasta</SelectItem>
                    <SelectItem value="salad">Salad</SelectItem>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={newRecipe.servings}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, servings: e.target.value })
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
                    setNewRecipe({ ...newRecipe, prepTime: e.target.value })
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
                    setNewRecipe({ ...newRecipe, cookTime: e.target.value })
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
                    setNewRecipe({ ...newRecipe, price: e.target.value })
                  }
                  placeholder="e.g., 12.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newRecipe.status}
                  onValueChange={(value) =>
                    setNewRecipe({ ...newRecipe, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
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
                {newRecipe.ingredients.map((ingredient, index) => (
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
                            e.target.value
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
                    <div className="col-span-3">
                      <Label htmlFor={`ingredient-cost-${index}`}>
                        Cost ($)
                      </Label>
                      <Input
                        id={`ingredient-cost-${index}`}
                        type="number"
                        step="0.01"
                        value={ingredient.cost}
                        onChange={(e) =>
                          handleIngredientChange(index, "cost", e.target.value)
                        }
                        placeholder="e.g., 2.00"
                      />
                    </div>
                    <div className="col-span-1">
                      {newRecipe.ingredients.length > 1 && (
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

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="font-medium">
                      Total Cost: ${calculateTotalCost().toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Profit: ${calculateProfit().toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      Margin: {calculateMargin().toFixed(1)}%
                    </span>
                  </div>
                </div>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  Required Prep Items
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddPrepItem}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>

              <div className="space-y-2">
                {newRecipe.prepItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={item}
                      onChange={(e) =>
                        handlePrepItemChange(index, e.target.value)
                      }
                      placeholder="e.g., Pizza Dough"
                    />
                    {newRecipe.prepItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePrepItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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
                <TableHead>Cost</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
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
                    ${recipe.cost.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${recipe.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-medium text-success">
                    ${recipe.profit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {((recipe.profit / recipe.price) * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={recipe.status as any} />
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
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
                  <DollarSign className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">
                    ${selectedRecipe.cost.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Cost</p>
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
                        <TableHead>Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {ingredient.name}
                          </TableCell>
                          <TableCell>{ingredient.quantity}</TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                          <TableCell>${ingredient.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
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

              <div>
                <h3 className="font-semibold mb-3">Required Prep Items</h3>
                <div className="flex gap-2">
                  {selectedRecipe.prepItems.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
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
