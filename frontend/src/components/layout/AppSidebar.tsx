import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  FileText,
  Truck,
  CreditCard,
  History,
  Menu,
} from "lucide-react";

const getSidebarItems = (role: string) => {
  switch (role) {
    case "Restaurant Manager":
      return [
        { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
        { icon: ChefHat, label: "Recipe Management", path: "/recipes" },
        { icon: FileText, label: "Reports & Analytics", path: "/reports" },
        { icon: AlertTriangle, label: "Stock Alerts", path: "/alerts" },
        { icon: Users, label: "User Management", path: "/users" },
      ];
    case "Kitchen Staff":
      return [
        { icon: ChefHat, label: "Recipes", path: "/recipes" },
        { icon: ClipboardList, label: "Prep Items", path: "/prep" },
        { icon: Package, label: "Ingredients", path: "/ingredients" },
        { icon: ShoppingCart, label: "Orders", path: "/orders" },
      ];
    case "Inventory Manager":
      return [
        { icon: Package, label: "Stock Monitor", path: "/stock" },
        { icon: ClipboardList, label: "Transactions", path: "/transactions" },
        { icon: AlertTriangle, label: "Low Stock", path: "/alerts" },
        { icon: FileText, label: "Usage Reports", path: "/reports" },
        { icon: Truck, label: "Deliveries", path: "/deliveries" },
      ];
    case "Server":
      return [
        { icon: Menu, label: "Menu", path: "/menu" },
        { icon: ShoppingCart, label: "Current Order", path: "/order" },
        { icon: CreditCard, label: "Checkout", path: "/checkout" },
        { icon: History, label: "Order History", path: "/history" },
        { icon: BarChart3, label: "Sales", path: "/sales" },
      ];
    default:
      return [];
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;

  const items = getSidebarItems(user?.role || "");
  const isCollapsed = state === "collapsed";

  const baseRow =
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150";

  const inactiveRow =
    "text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-primary";

  const activeRowExtra = "font-bold  shadow-sm";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 py-2 text-xs uppercase tracking-wide text-sidebar-foreground/70">
              {user?.role}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active =
                  currentPath === item.path ||
                  currentPath.startsWith(item.path + "/");

                const activeStyle: React.CSSProperties = active
                  ? {
                      backgroundColor:
                        "var(--sidebar-primary, rgba(249,115,22,0.08))",
                      color:
                        "var(--sidebar-primary-foreground, rgb(234,88,12))",
                      borderLeft: "4px solid var(--sidebar-primary, #f97316)",
                    }
                  : {};

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        className={`${baseRow} ${
                          active ? activeRowExtra : inactiveRow
                        }`}
                        style={active ? activeStyle : undefined}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
