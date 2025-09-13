import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Checkout = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Process payment and complete orders</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Processing</CardTitle>
          <CardDescription>Complete order checkout</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Checkout interface would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;