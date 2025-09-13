import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { ordersData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';

const KitchenOrders = () => {
  const [orders, setOrders] = useState(ordersData);

  const updateOrderStatus = (orderId: string, newStatus: 'preparing' | 'ready' | 'completed') => {
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const getTimeSinceOrder = (orderTime: string) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${hours}h ${remainingMinutes}m ago`;
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Play className="h-5 w-5 text-warning" />;
      case 'ready': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-muted-foreground" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getUrgencyColor = (orderTime: string) => {
    const diffMinutes = Math.floor((new Date().getTime() - new Date(orderTime).getTime()) / (1000 * 60));
    
    if (diffMinutes > 30) return 'border-danger bg-danger/5';
    if (diffMinutes > 20) return 'border-warning bg-warning/5';
    return 'border-border';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Orders</h1>
          <p className="text-muted-foreground">Manage incoming orders and preparation status</p>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOrders.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <Play className="h-5 w-5" />
              Preparing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{preparingOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{readyOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Avg Prep Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18m</div>
            <p className="text-sm text-muted-foreground">Current average</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOrders
          .sort((a, b) => new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime())
          .map((order) => (
          <Card key={order.id} className={`hover:shadow-lg transition-shadow ${getUrgencyColor(order.orderTime)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {order.id}
                </CardTitle>
                <StatusBadge status={order.status as any} />
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {order.tableNumber}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {order.server}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getTimeSinceOrder(order.orderTime)}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div>
                  <p className="text-sm font-medium mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start p-2 bg-muted/50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.quantity}x {item.name}</p>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground italic">"{item.notes}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === 'preparing' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1"
                    >
                      Order Served
                    </Button>
                  )}
                </div>

                {/* Order Details */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  <div className="flex justify-between">
                    <span>Total: ${order.total.toFixed(2)}</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Ordered: {new Date(order.orderTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Queue Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Queue Summary</CardTitle>
          <CardDescription>Quick overview of all active orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeOrders
              .sort((a, b) => new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime())
              .map((order, index) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{order.id} - {order.tableNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • 
                        {getTimeSinceOrder(order.orderTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status as any} />
                    <Button 
                      size="sm"
                      variant={order.status === 'preparing' ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(
                        order.id, 
                        order.status === 'preparing' ? 'ready' : 'completed'
                      )}
                    >
                      {order.status === 'preparing' ? 'Ready' : 'Served'}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KitchenOrders;