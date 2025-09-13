import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, TrendingUp, DollarSign, Package } from "lucide-react";
import { ordersData, inventoryData } from "@/data/mockData";

const Reports = () => {
  const dailyRevenue = [
    { date: "1/10", revenue: 850, orders: 25 },
    { date: "1/11", revenue: 920, orders: 28 },
    { date: "1/12", revenue: 780, orders: 22 },
    { date: "1/13", revenue: 1100, orders: 35 },
    { date: "1/14", revenue: 1250, orders: 40 },
    { date: "1/15", revenue: 1400, orders: 45 },
  ];

  const popularDishes = [
    { name: "Margherita Pizza", orders: 45, revenue: 584.55 },
    { name: "Chicken Pasta", orders: 30, revenue: 509.7 },
    { name: "Caesar Salad", orders: 25, revenue: 249.75 },
    { name: "Garlic Bread", orders: 20, revenue: 99.8 },
  ];

  const ingredientUsage = [
    { ingredient: "Mozzarella", used: 15, cost: 187.5 },
    { ingredient: "Chicken Breast", used: 8, cost: 144.0 },
    { ingredient: "Flour", used: 12, cost: 30.0 },
    { ingredient: "Tomatoes", used: 10, cost: 42.0 },
  ];

  const foodCostAnalysis = [
    { category: "Pizza", cost: 45.5, revenue: 155.88, margin: 70.8 },
    { category: "Pasta", cost: 27.6, revenue: 67.96, margin: 59.4 },
    { category: "Salad", cost: 12.9, revenue: 29.97, margin: 57.0 },
    { category: "Appetizer", cost: 8.0, revenue: 19.96, margin: 59.9 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Revenue Trend
          </CardTitle>
          <CardDescription>
            Revenue and order count over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="hsl(var(--primary))"
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Dishes</CardTitle>
            <CardDescription>Top performing menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularDishes.map((dish, index) => (
                <div
                  key={dish.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{dish.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dish.orders} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${dish.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Top Ingredient Usage
            </CardTitle>
            <CardDescription>
              Most consumed ingredients this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingredientUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="ingredient" type="category" width={80} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "used" ? `${value} kg` : `$${value}`,
                    name === "used" ? "Used" : "Cost",
                  ]}
                />
                <Bar dataKey="used" fill="hsl(var(--warning))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Food Cost Analysis
          </CardTitle>
          <CardDescription>
            Cost breakdown and profit margins by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {foodCostAnalysis.map((item) => (
              <div
                key={item.category}
                className="p-4 border rounded-lg space-y-2"
              >
                <h3 className="font-semibold">{item.category}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost:</span>
                    <span>${item.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span>${item.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Margin:</span>
                    <span className="text-success">
                      {item.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-success h-2 rounded-full"
                    style={{ width: `${item.margin}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
