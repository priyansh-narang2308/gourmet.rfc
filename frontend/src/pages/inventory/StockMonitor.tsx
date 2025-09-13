import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import { inventoryData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';
import MetricCard from '@/components/shared/MetricCard';

const StockMonitor = () => {
  const [inventory, setInventory] = useState(inventoryData);
  const [updateQuantities, setUpdateQuantities] = useState<{[key: number]: string}>({});

  const updateStock = (id: number, change: number) => {
    setInventory(items => 
      items.map(item => {
        if (item.id === id) {
          const newCurrent = Math.max(0, item.current + change);
          let newStatus: 'good' | 'low' | 'critical' = 'good';
          if (newCurrent <= item.minLevel * 0.5) newStatus = 'critical';
          else if (newCurrent <= item.minLevel) newStatus = 'low';
          
          return { ...item, current: newCurrent, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        return item;
      })
    );
  };

  const lowStock = inventory.filter(item => item.status === 'low' || item.status === 'critical').length;
  const criticalStock = inventory.filter(item => item.status === 'critical').length;
  const goodStock = inventory.filter(item => item.status === 'good').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.current * item.cost), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Monitor</h1>
          <p className="text-muted-foreground">Monitor and manage inventory levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Items" value={inventory.length} icon={Package} />
        <MetricCard title="Good Stock" value={goodStock} icon={Package} changeType="positive" />
        <MetricCard title="Low Stock" value={lowStock} icon={AlertTriangle} changeType="neutral" />
        <MetricCard title="Critical Stock" value={criticalStock} icon={AlertTriangle} changeType="negative" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>Real-time stock level monitoring and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      item.status === 'critical' ? 'text-danger' :
                      item.status === 'low' ? 'text-warning' : 'text-success'
                    }`}>
                      {item.current} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell>{item.minLevel}/{item.maxLevel} {item.unit}</TableCell>
                  <TableCell><StatusBadge status={item.status as any} /></TableCell>
                  <TableCell>${(item.current * item.cost).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateStock(item.id, -1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStock(item.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
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

export default StockMonitor;