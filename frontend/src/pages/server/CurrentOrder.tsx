import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CurrentOrder = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Current Order</h1>
        <p className="text-muted-foreground">Manage active order creation</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Builder</CardTitle>
          <CardDescription>Create and modify current order</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Order management interface would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentOrder;