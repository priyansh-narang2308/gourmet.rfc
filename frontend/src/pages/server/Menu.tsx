import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { menuData } from '@/data/mockData';

const Menu = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: number, quantity: number}>>([]);

  const addToCart = (item: typeof menuData[0]) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? {...p, quantity: p.quantity + 1} : p);
      }
      return [...prev, {id: item.id, name: item.name, price: item.price, quantity: 1}];
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Menu</h1>
        <p className="text-muted-foreground">Browse menu items and add to order</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuData.map((item) => (
          <Card key={item.id} className={!item.available ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-4xl">{item.image}</div>
                <Badge variant={item.available ? 'default' : 'secondary'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${item.price}</p>
                  <p className="text-sm text-muted-foreground">{item.prepTime}</p>
                </div>
                <Button 
                  disabled={!item.available}
                  onClick={() => addToCart(item)}
                  className="bg-gradient-primary"
                >
                  Add to Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cart.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Cart ({cart.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Menu;