import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UsageReports = () => {
  const usageData = [
    { ingredient: 'Mozzarella', usage: 15, cost: 187.50 },
    { ingredient: 'Chicken', usage: 8, cost: 144.00 },
    { ingredient: 'Flour', usage: 12, cost: 30.00 },
    { ingredient: 'Tomatoes', usage: 10, cost: 42.00 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usage Reports</h1>
        <p className="text-muted-foreground">Analyze ingredient consumption patterns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingredient Usage This Week</CardTitle>
          <CardDescription>Most consumed ingredients</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ingredient" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageReports;