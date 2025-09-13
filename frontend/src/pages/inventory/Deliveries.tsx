import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Truck, Plus } from 'lucide-react';

const Deliveries = () => {
  const deliveries = [
    { id: 'DEL001', supplier: 'Fresh Farm', items: 'Tomatoes, Lettuce', scheduled: '2024-01-16 09:00', status: 'scheduled' },
    { id: 'DEL002', supplier: 'Cheese Inc', items: 'Mozzarella, Parmesan', scheduled: '2024-01-16 14:00', status: 'scheduled' },
    { id: 'DEL003', supplier: 'Meat Co', items: 'Chicken Breast', scheduled: '2024-01-15 10:00', status: 'received' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deliveries Management</h1>
          <p className="text-muted-foreground">Track and manage supplier deliveries</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Delivery
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Delivery Schedule
          </CardTitle>
          <CardDescription>Upcoming and recent deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.supplier}</TableCell>
                  <TableCell>{delivery.items}</TableCell>
                  <TableCell>{delivery.scheduled}</TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === 'received' ? 'default' : 'secondary'}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {delivery.status === 'scheduled' && (
                      <Button size="sm" variant="outline">Receive</Button>
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

export default Deliveries;