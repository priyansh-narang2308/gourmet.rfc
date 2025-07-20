import { useState } from 'react';
import { Plus, Search, Download, Upload, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockIngredients } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function InventoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Ensure user has admin access
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <div className="space-y-2">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-medium">Access Denied</h3>
            <p className="text-sm text-muted-foreground">
              Only administrators can access the inventory management system.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock <= threshold * 0.5) return 'critical';
    if (stock <= threshold) return 'low';
    return 'good';
  };

  const getStockProgress = (stock: number, threshold: number) => {
    const max = threshold * 2; // Assume 2x threshold is "full"
    return Math.min((stock / max) * 100, 100);
  };

  const filteredIngredients = mockIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ingredient.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'low') {
      matchesStatus = getStockStatus(ingredient.stock, ingredient.threshold) !== 'good';
    } else if (statusFilter === 'good') {
      matchesStatus = getStockStatus(ingredient.stock, ingredient.threshold) === 'good';
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...Array.from(new Set(mockIngredients.map(i => i.category)))];
  const lowStockCount = mockIngredients.filter(i => getStockStatus(i.stock, i.threshold) !== 'good').length;
  const totalValue = mockIngredients.reduce((sum, i) => sum + (i.stock * 10), 0); // Mock pricing

  const getStatusBadge = (stock: number, threshold: number) => {
    const status = getStockStatus(stock, threshold);
    if (status === 'critical') {
      return <Badge variant="destructive">Critical</Badge>;
    }
    if (status === 'low') {
      return <Badge variant="secondary" className="status-warning">Low Stock</Badge>;
    }
    return <Badge variant="secondary" className="status-good">Good</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your kitchen's ingredient stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Ingredient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockIngredients.length}</div>
            <p className="text-xs text-muted-foreground">
              Active items in inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Items requiring attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Estimated total value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="good">Good Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Inventory</CardTitle>
          <CardDescription>
            Current stock levels and thresholds for all ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recent Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell>{ingredient.category}</TableCell>
                  <TableCell>
                    {ingredient.stock} {ingredient.unit}
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <div className="space-y-1">
                      <Progress 
                        value={getStockProgress(ingredient.stock, ingredient.threshold)}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {Math.round(getStockProgress(ingredient.stock, ingredient.threshold))}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ingredient.threshold} {ingredient.unit}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(ingredient.stock, ingredient.threshold)}
                  </TableCell>
                  <TableCell>
                    {ingredient.recentUsage} {ingredient.unit}/week
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Restock
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium">No ingredients found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search criteria or add a new ingredient.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}