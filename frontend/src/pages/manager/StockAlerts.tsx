import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Package, ShoppingCart, Settings, TrendingDown } from 'lucide-react';
import { inventoryData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';

const StockAlerts = () => {
  const [selectedItem, setSelectedItem] = useState<typeof inventoryData[0] | null>(null);
  const [reorderQuantity, setReorderQuantity] = useState('');

  const lowStockItems = inventoryData.filter(item => item.status === 'low' || item.status === 'critical');
  const criticalItems = inventoryData.filter(item => item.status === 'critical');

  const handleReorder = (item: typeof inventoryData[0]) => {
    // Simulate reorder process
    alert(`Reorder request sent for ${item.name} - ${reorderQuantity} ${item.unit}`);
    setSelectedItem(null);
    setReorderQuantity('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage low stock items</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-danger">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              Critical Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{criticalItems.length}</div>
            <p className="text-sm text-muted-foreground">Immediate action required</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-warning" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{lowStockItems.length - criticalItems.length}</div>
            <p className="text-sm text-muted-foreground">Below minimum levels</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-success" />
              Good Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{inventoryData.length - lowStockItems.length}</div>
            <p className="text-sm text-muted-foreground">Adequate levels</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Items Alert */}
      {criticalItems.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardHeader>
            <CardTitle className="text-danger flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Stock Alert
            </CardTitle>
            <CardDescription>These items require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {criticalItems.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-danger/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status as any} />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium">{item.current} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Level:</span>
                      <span>{item.minLevel} {item.unit}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-danger hover:bg-danger/90"
                    onClick={() => setSelectedItem(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Reorder Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Low Stock Items */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
          <CardDescription>All items below minimum stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Max Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={item.status === 'critical' ? 'font-semibold text-danger' : 'font-semibold text-warning'}>
                      {item.current} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell>{item.minLevel} {item.unit}</TableCell>
                  <TableCell>{item.maxLevel} {item.unit}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status as any} />
                  </TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={item.status === 'critical' ? 'default' : 'outline'}
                        className={item.status === 'critical' ? 'bg-danger hover:bg-danger/90' : ''}
                        onClick={() => setSelectedItem(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reorder Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Create a reorder request for this item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-semibold">{selectedItem.current} {selectedItem.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recommended</p>
                  <p className="font-semibold">{selectedItem.maxLevel - selectedItem.current} {selectedItem.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-semibold">{selectedItem.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit Cost</p>
                  <p className="font-semibold">${selectedItem.cost}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Reorder Quantity</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={reorderQuantity}
                    onChange={(e) => setReorderQuantity(e.target.value)}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-muted rounded-md text-sm">
                    {selectedItem.unit}
                  </span>
                </div>
              </div>

              {reorderQuantity && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium">
                    Total Cost: ${(parseFloat(reorderQuantity) * selectedItem.cost).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleReorder(selectedItem)}
                  disabled={!reorderQuantity}
                  className="bg-gradient-primary"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Submit Reorder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockAlerts;