import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '@/components/shared/MetricCard';
import { DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';

const Sales = () => {
  const salesData = [
    { hour: '12PM', sales: 120 },
    { hour: '1PM', sales: 180 },
    { hour: '2PM', sales: 150 },
    { hour: '3PM', sales: 90 },
    { hour: '4PM', sales: 70 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <p className="text-muted-foreground">Track your sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Today's Sales" value="$847.50" icon={DollarSign} changeType="positive" change="+12%" />
        <MetricCard title="Orders Served" value="28" icon={ShoppingCart} changeType="positive" change="+5" />
        <MetricCard title="Avg Order Value" value="$30.27" icon={TrendingUp} changeType="positive" change="+8%" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Sales</CardTitle>
          <CardDescription>Sales performance throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;