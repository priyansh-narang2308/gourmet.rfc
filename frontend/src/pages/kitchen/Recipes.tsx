import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Clock, Users, ChefHat } from 'lucide-react';
import { recipesData, inventoryData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';

const KitchenRecipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<typeof recipesData[0] | null>(null);

  const categories = ['all', ...Array.from(new Set(recipesData.map(r => r.category)))];
  
  const filteredRecipes = recipesData.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIngredientAvailability = (ingredientName: string) => {
    const inventory = inventoryData.find(item => 
      item.name.toLowerCase().includes(ingredientName.toLowerCase())
    );
    return inventory?.status || 'unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipe Collection</h1>
          <p className="text-muted-foreground">Browse all recipes with ingredient availability</p>
        </div>
      </div>

      {/* Search and Filters */}
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
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{recipe.category}</Badge>
                <StatusBadge status={recipe.status as any} />
              </div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {recipe.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Ingredients:</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => {
                      const availability = getIngredientAvailability(ingredient.name);
                      return (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className={`text-xs ${
                            availability === 'critical' ? 'bg-danger/20 text-danger' :
                            availability === 'low' ? 'bg-warning/20 text-warning' :
                            'bg-success/20 text-success'
                          }`}
                        >
                          {ingredient.name}
                        </Badge>
                      );
                    })}
                    {recipe.ingredients.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.ingredients.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {recipe.prepItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Prep Required:</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.prepItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-6 w-6" />
              {selectedRecipe?.name}
            </DialogTitle>
            <DialogDescription>Complete recipe details and preparation instructions</DialogDescription>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-6">
              {/* Recipe Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">{selectedRecipe.servings}</p>
                  <p className="text-sm text-muted-foreground">Servings</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">{selectedRecipe.prepTime}</p>
                  <p className="text-sm text-muted-foreground">Prep Time</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-lg font-semibold">{selectedRecipe.cookTime}</p>
                  <p className="text-sm text-muted-foreground">Cook Time</p>
                </div>
              </div>

              {/* Ingredients with Availability */}
              <div>
                <h3 className="font-semibold mb-3">Ingredients & Availability</h3>
                <div className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => {
                    const availability = getIngredientAvailability(ingredient.name);
                    const inventoryItem = inventoryData.find(item => 
                      item.name.toLowerCase().includes(ingredient.name.toLowerCase())
                    );
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            availability === 'critical' ? 'bg-danger' :
                            availability === 'low' ? 'bg-warning' :
                            'bg-success'
                          }`} />
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ingredient.quantity} {ingredient.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {inventoryItem && (
                            <>
                              <p className="text-sm font-medium">
                                Stock: {inventoryItem.current} {inventoryItem.unit}
                              </p>
                              <StatusBadge status={availability as any} />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold mb-3">Preparation Instructions</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-line">{selectedRecipe.instructions}</p>
                </div>
              </div>

              {/* Prep Items */}
              {selectedRecipe.prepItems.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Required Prep Items</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.prepItems.map((item, index) => (
                      <Badge key={index} variant="outline" className="p-2">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KitchenRecipes;