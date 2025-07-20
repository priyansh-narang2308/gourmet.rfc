import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChefHat, 
  LayoutDashboard, 
  Book, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  AlertTriangle, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'chef', 'pos'] },
  { name: 'Recipes', href: '/recipes', icon: Book, roles: ['admin', 'chef'] },
  { name: 'Inventory', href: '/inventory', icon: Package, roles: ['admin'] },
  { name: 'POS System', href: '/pos', icon: ShoppingCart, roles: ['pos'] },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin'] },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle, roles: ['admin'] },
  { name: 'Audit Logs', href: '/audit', icon: FileText, roles: ['admin'] },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className={cn(
      'flex flex-col bg-card border-r border-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Gourmet
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <ChevronLeft className="h-6 w-6" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground',
                  collapsed && 'justify-center h-10 w-10'
                )
              }
            >
              <Icon className={cn('h-5 w-5', !collapsed && 'mr-3')} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © Gourmet 2025
          </p>
          <p className="text-xs text-muted-foreground text-center">
            <a href="https://github.com/priyansh-narang2308/gourmet.rfc" className="hover:text-primary transition-colors">
              GitHub Repo
            </a>
          </p>
        </div>
      )}
    </div>
  );
}