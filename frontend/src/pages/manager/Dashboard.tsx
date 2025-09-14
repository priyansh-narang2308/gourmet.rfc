import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/shared/MetricCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChefHat, Package, DollarSign, ShoppingCart, Plus } from "lucide-react";
import { inventoryData, transactionsData, ordersData } from "@/data/mockData";

const Dashboard = () => {
  const lowStockItems = inventoryData.filter(
    (item) => item.status === "low" || item.status === "critical"
  ).length;
  const todayRevenue = ordersData.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = ordersData.filter(
    (order) => order.status !== "completed"
  ).length;

  const dailySales = [
    { day: "Mon", revenue: 850 },
    { day: "Tue", revenue: 920 },
    { day: "Wed", revenue: 780 },
    { day: "Thu", revenue: 1100 },
    { day: "Fri", revenue: 1250 },
    { day: "Sat", revenue: 1400 },
    { day: "Sun", revenue: 1050 },
  ];

  const topDishes = [
    { name: "Margherita Pizza", value: 45, color: "#FF6B35" },
    { name: "Chicken Pasta", value: 30, color: "#F7931E" },
    { name: "Caesar Salad", value: 25, color: "#FFD23F" },
  ];

  const recentActivity = transactionsData.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Recipes"
          value="15"
          icon={ChefHat}
          change="+2 this week"
          changeType="positive"
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={Package}
          change={lowStockItems > 2 ? "Action needed" : "Under control"}
          changeType={lowStockItems > 2 ? "negative" : "positive"}
        />
        <MetricCard
          title="Today's Revenue"
          value={`$${todayRevenue.toFixed(2)}`}
          icon={DollarSign}
          change="+12% from yesterday"
          changeType="positive"
        />
        <MetricCard
          title="Active Orders"
          value={activeOrders}
          icon={ShoppingCart}
          description="Orders in progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Revenue for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Dishes</CardTitle>
            <CardDescription>Orders by dish type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topDishes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {topDishes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest inventory transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "Added"
                        ? "bg-success/20"
                        : transaction.type === "Used"
                        ? "bg-warning/20"
                        : "bg-danger/20"
                    }`}
                  >
                    {transaction.type === "Added"
                      ? "+"
                      : transaction.type === "Used"
                      ? "-"
                      : "×"}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.ingredient}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.type === "Added"
                        ? "text-success"
                        : transaction.type === "Used"
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    {transaction.quantity > 0 ? "+" : ""}
                    {transaction.quantity} {transaction.unit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
