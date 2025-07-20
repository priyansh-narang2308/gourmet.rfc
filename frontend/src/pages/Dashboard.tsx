import { Book, Package, AlertTriangle, ShoppingCart, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockAnalytics, mockAlerts, mockAuditLogs } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificStats = () => {
    const baseStats = [
      {
        title: 'Total Recipes',
        value: mockAnalytics.totalRecipes,
        description: 'Active recipes in system',
        icon: Book,
        trend: { value: 12, isPositive: true }
      }
    ];

    if (user?.role === 'admin') {
      return [
        ...baseStats,
        {
          title: 'Ingredients in Stock',
          value: mockAnalytics.ingredientsInStock,
          description: 'Items currently available',
          icon: Package,
          trend: { value: 5, isPositive: true }
        },
        {
          title: 'Active Alerts',
          value: mockAnalytics.activeAlerts,
          description: 'Require immediate attention',
          icon: AlertTriangle,
          trend: { value: 15, isPositive: false }
        },
        {
          title: 'Orders Today',
          value: mockAnalytics.ordersToday,
          description: 'Processed successfully',
          icon: ShoppingCart,
          trend: { value: 8, isPositive: true }
        }
      ];
    }

    if (user?.role === 'chef') {
      return [
        ...baseStats,
        {
          title: 'Orders Today',
          value: mockAnalytics.ordersToday,
          description: 'Kitchen processing',
          icon: ShoppingCart,
          trend: { value: 8, isPositive: true }
        },
        {
          title: 'Active Alerts',
          value: mockAnalytics.activeAlerts,
          description: 'Stock notifications',
          icon: AlertTriangle,
          trend: { value: 15, isPositive: false }
        }
      ];
    }

    if (user?.role === 'pos') {
      return [
        {
          title: 'Orders Today',
          value: mockAnalytics.ordersToday,
          description: 'Successfully processed',
          icon: ShoppingCart,
          trend: { value: 8, isPositive: true }
        },
        {
          title: 'Revenue Today',
          value: `$${mockAnalytics.revenueToday}`,
          description: 'Total sales amount',
          icon: DollarSign,
          trend: { value: 15, isPositive: true }
        },
        {
          title: 'Available Recipes',
          value: mockAnalytics.totalRecipes,
          description: 'Menu items ready',
          icon: Book
        }
      ];
    }

    return baseStats;
  };

  const getQuickActions = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Add Recipe', action: () => navigate('/recipes'), variant: 'default' as const },
        { label: 'Restock Ingredient', action: () => navigate('/inventory'), variant: 'secondary' as const },
        { label: 'View Alerts', action: () => navigate('/alerts'), variant: 'destructive' as const },
        { label: 'Analytics', action: () => navigate('/analytics'), variant: 'outline' as const }
      ];
    }

    if (user?.role === 'chef') {
      return [
        { label: 'Add Recipe', action: () => navigate('/recipes'), variant: 'default' as const },
        { label: 'View Orders', action: () => navigate('/orders'), variant: 'secondary' as const },
        { label: 'Check Alerts', action: () => navigate('/alerts'), variant: 'destructive' as const }
      ];
    }

    if (user?.role === 'pos') {
      return [
        { label: 'Open POS', action: () => navigate('/pos'), variant: 'default' as const },
        { label: 'View Orders', action: () => navigate('/orders'), variant: 'secondary' as const }
      ];
    }

    return [];
  };

  const stats = getRoleSpecificStats();
  const quickActions = getQuickActions();

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Welcome to your kitchen dashboard. Here's what's happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for your role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="w-full justify-start"
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {(user?.role === 'admin' || user?.role === 'chef') && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Latest notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    alert.severity === 'high' ? 'bg-destructive' :
                    alert.severity === 'medium' ? 'bg-warning' :
                    'bg-muted-foreground'
                  }`} />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    <Badge 
                      variant={alert.status === 'new' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {alert.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/alerts')}
              >
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAuditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.entityName} by {log.userName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {user?.role === 'admin' && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/audit')}
              >
                View Audit Logs
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {(user?.role === 'admin' || user?.role === 'chef') && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Recipes This Week</CardTitle>
            <CardDescription>
              Most ordered items in your kitchen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockAnalytics.popularRecipes.map((recipe, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{recipe.name}</p>
                    <p className="text-sm text-muted-foreground">{recipe.orders} orders</p>
                  </div>
                  <Badge variant="secondary">{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}