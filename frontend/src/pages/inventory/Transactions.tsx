import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { transactionsData } from '@/data/mockData';

const Transactions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Transactions</h1>
        <p className="text-muted-foreground">Complete transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Complete log of inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Ingredient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Staff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                  <TableCell>{transaction.ingredient}</TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.type === 'Added' ? 'default' :
                      transaction.type === 'Used' ? 'secondary' : 'destructive'
                    }>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={
                    transaction.quantity > 0 ? 'text-success' : 'text-danger'
                  }>
                    {transaction.quantity > 0 ? '+' : ''}{transaction.quantity} {transaction.unit}
                  </TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell>{transaction.staff}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;