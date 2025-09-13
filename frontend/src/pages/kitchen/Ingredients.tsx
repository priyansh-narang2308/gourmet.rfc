import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { inventoryData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';

const KitchenIngredients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];
  
  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = inventoryData.filter(item => item.status === 'low' || item.status === 'critical').length;
  const criticalCount = inventoryData.filter(item => item.status === 'critical').length;
  const goodStockCount = inventoryData.filter(item => item.status === 'good').length;

  const handleRequestRestock = (itemName: string) => {
    alert(`Restock request sent for ${itemName} to inventory manager`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ingredient Availability</h1>
          <p className="text-muted-foreground">Monitor current stock levels for all ingredients</p>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inventoryData.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <Package className="h-5 w-5" />
              Good Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{goodStockCount}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{lowStockCount - criticalCount}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-danger">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{criticalCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ingredients..."
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

      {/* Critical Items Alert */}
      {criticalCount > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardHeader>
            <CardTitle className="text-danger flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Stock Alert
            </CardTitle>
            <CardDescription>These ingredients are critically low and need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryData.filter(item => item.status === 'critical').map((item) => (
                <div key={item.id} className="p-4 bg-white border border-danger/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status as any} />
                  </div>
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium text-danger">{item.current} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Level:</span>
                      <span>{item.minLevel} {item.unit}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-danger hover:bg-danger/90"
                    onClick={() => handleRequestRestock(item.name)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Request Restock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Ingredients ({filteredItems.length})</CardTitle>
          <CardDescription>Complete inventory with current stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        item.status === 'critical' ? 'text-danger' :
                        item.status === 'low' ? 'text-warning' :
                        'text-success'
                      }`}>
                        {item.current} {item.unit}
                      </span>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            item.status === 'critical' ? 'bg-danger' :
                            item.status === 'low' ? 'bg-warning' :
                            'bg-success'
                          }`}
                          style={{ 
                            width: `${Math.min((item.current / item.maxLevel) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.minLevel} {item.unit}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status as any} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(item.status === 'low' || item.status === 'critical') && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRequestRestock(item.name)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Request
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default KitchenIngredients;