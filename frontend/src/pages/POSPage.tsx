import { useState } from 'react';
import { Plus, Minus, ShoppingCart, Search, CreditCard, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockRecipes, OrderItem } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem extends OrderItem {
  id: string;
}

export default function POSPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Mock prices for recipes
  const getRecipePrice = (recipeId: string) => {
    const prices: Record<string, number> = {
      '1': 18.99, // Margherita Pizza
      '2': 16.99, // Grilled Chicken Caesar
    };
    return prices[recipeId] || 12.99;
  };

  const filteredRecipes = mockRecipes.filter(recipe => 
    !recipe.archived && (
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const addToCart = (recipe: typeof mockRecipes[0]) => {
    const existingItem = cart.find(item => item.recipeId === recipe.id);
    const price = getRecipePrice(recipe.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.recipeId === recipe.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        recipeId: recipe.id,
        recipeName: recipe.name,
        quantity: 1,
        price: price
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    // Mock checkout process
    setOrderConfirmed(true);
    
    // Clear cart after 3 seconds
    setTimeout(() => {
      setCart([]);
      setOrderConfirmed(false);
    }, 3000);
  };

  const OrderConfirmationDialog = () => (
    <Dialog open={orderConfirmed} onOpenChange={setOrderConfirmed}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-success" />
            Order Confirmed!
          </DialogTitle>
          <DialogDescription>
            Your order has been successfully placed and sent to the kitchen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">Order #${Date.now().toString().slice(-4)}</div>
            <div className="text-sm text-muted-foreground">
              Total: ${getCartTotal().toFixed(2)}
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            This dialog will close automatically...
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Menu Section */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
            <p className="text-muted-foreground">
              Select items from the menu to create orders
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Menu Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/80">
                      {recipe.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      ${getRecipePrice(recipe.id)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {recipe.prepTime} min • {recipe.difficulty}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => addToCart(recipe)}
                      className="w-full"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8">
              <h3 className="font-medium">No menu items found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 border-l border-border bg-muted/20">
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Current Order</h2>
              <Badge variant="secondary">{cart.length}</Badge>
            </div>
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Cart is empty. Add items from the menu.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.recipeName}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border space-y-4">
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <Button 
                onClick={handleCheckout}
                className="w-full gap-2"
                size="lg"
              >
                <CreditCard className="h-4 w-4" />
                Process Order
              </Button>
            </div>
          )}
        </div>
      </div>

      <OrderConfirmationDialog />
    </div>
  );
}