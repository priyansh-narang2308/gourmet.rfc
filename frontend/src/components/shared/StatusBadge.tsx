import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'good' | 'low' | 'critical' | 'active' | 'inactive' | 'completed' | 'in-progress' | 'needed' | 'preparing' | 'ready' | 'completed';
  children?: React.ReactNode;
}

const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case 'good':
      case 'active':
      case 'completed':
      case 'ready':
        return 'default' as const;
      case 'low':
      case 'in-progress':
      case 'preparing':
        return 'secondary' as const;
      case 'critical':
      case 'inactive':
      case 'needed':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getClassName = () => {
    switch (status) {
      case 'good':
      case 'active':
      case 'completed':
      case 'ready':
        return 'bg-success text-success-foreground';
      case 'low':
      case 'in-progress':
      case 'preparing':
        return 'bg-warning text-warning-foreground';
      case 'critical':
      case 'inactive':
      case 'needed':
        return 'bg-danger text-danger-foreground';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={getClassName()}>
      {children || status}
    </Badge>
  );
};

export default StatusBadge;