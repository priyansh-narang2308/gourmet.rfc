import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Clock, User, AlertCircle, CheckCircle2, Play } from 'lucide-react';
import { prepItemsData } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';

const PrepItems = () => {
  const [prepItems, setPrepItems] = useState(prepItemsData);

  const updatePrepStatus = (id: number, newStatus: 'completed' | 'in-progress' | 'needed') => {
    setPrepItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, status: newStatus, lastMade: newStatus === 'completed' ? new Date().toISOString() : item.lastMade }
          : item
      )
    );
  };

  const completedItems = prepItems.filter(item => item.status === 'completed').length;
  const inProgressItems = prepItems.filter(item => item.status === 'in-progress').length;
  const neededItems = prepItems.filter(item => item.status === 'needed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in-progress': return <Play className="h-5 w-5 text-warning" />;
      case 'needed': return <AlertCircle className="h-5 w-5 text-danger" />;
      default: return <ClipboardCheck className="h-5 w-5" />;
    }
  };

  const prioritySort = (a: any, b: any) => {
    const priority = { needed: 3, 'in-progress': 2, completed: 1 };
    return (priority[b.status as keyof typeof priority] || 0) - (priority[a.status as keyof typeof priority] || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prep Items Dashboard</h1>
          <p className="text-muted-foreground">Track and manage kitchen preparation items</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{prepItems.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{completedItems}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-warning" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{inProgressItems}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-danger">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-danger" />
              Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-danger">{neededItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Prep Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prepItems.sort(prioritySort).map((item) => (
          <Card key={item.id} className={`hover:shadow-lg transition-shadow ${
            item.status === 'needed' ? 'border-danger' :
            item.status === 'in-progress' ? 'border-warning' :
            'border-success'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  {item.name}
                </CardTitle>
                <StatusBadge status={item.status as any} />
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {item.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {item.assignedTo}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Stock */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Stock:</span>
                  <span className={`font-semibold ${
                    item.quantity === 0 ? 'text-danger' :
                    item.quantity < 3 ? 'text-warning' :
                    'text-success'
                  }`}>
                    {item.quantity} {item.unit}
                  </span>
                </div>

                {/* Last Made */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Made:</span>
                  <span className="text-sm">{new Date(item.lastMade).toLocaleDateString()}</span>
                </div>

                {/* Used In */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Used in:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.usedIn.slice(0, 2).map((dish, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dish}
                      </Badge>
                    ))}
                    {item.usedIn.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.usedIn.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {item.status === 'needed' && (
                    <Button 
                      size="sm" 
                      onClick={() => updatePrepStatus(item.id, 'in-progress')}
                      className="flex-1 bg-warning hover:bg-warning/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Prep
                    </Button>
                  )}
                  {item.status === 'in-progress' && (
                    <Button 
                      size="sm" 
                      onClick={() => updatePrepStatus(item.id, 'completed')}
                      className="flex-1 bg-success hover:bg-success/90"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  {item.status === 'completed' && item.quantity === 0 && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updatePrepStatus(item.id, 'needed')}
                      className="flex-1"
                    >
                      Mark as Needed
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Prep Schedule</CardTitle>
          <CardDescription>Recommended preparation order based on priority</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prepItems
              .filter(item => item.status === 'needed' || item.status === 'in-progress')
              .sort((a, b) => {
                if (a.status === 'in-progress' && b.status === 'needed') return -1;
                if (a.status === 'needed' && b.status === 'in-progress') return 1;
                return a.usedIn.length - b.usedIn.length; // Items used in more dishes get priority
              })
              .map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.prepTime} • Assigned to {item.assignedTo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status as any} />
                    <Button 
                      size="sm"
                      variant={item.status === 'needed' ? 'default' : 'outline'}
                      onClick={() => updatePrepStatus(
                        item.id, 
                        item.status === 'needed' ? 'in-progress' : 'completed'
                      )}
                    >
                      {item.status === 'needed' ? 'Start' : 'Complete'}
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

export default PrepItems;