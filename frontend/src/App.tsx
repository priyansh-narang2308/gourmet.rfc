import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/login/LoginPage";
import RegisterPage from "./components/login/RegisterPage";
import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/manager/Dashboard";
import RecipeManagement from "./pages/manager/RecipeManagement";
import Reports from "./pages/manager/Reports";
import StockAlerts from "./pages/manager/StockAlerts";
import UserManagement from "./pages/manager/UserManagement";

import KitchenRecipes from "./pages/kitchen/Recipes";
import PrepItems from "./pages/kitchen/PrepItems";
import KitchenIngredients from "./pages/kitchen/Ingredients";
import KitchenOrders from "./pages/kitchen/Orders";

import StockMonitor from "./pages/inventory/StockMonitor";
import Transactions from "./pages/inventory/Transactions";
import UsageReports from "./pages/inventory/UsageReports";
import Deliveries from "./pages/inventory/Deliveries";

import Menu from "./pages/server/Menu";
import CurrentOrder from "./pages/server/CurrentOrder";
import Checkout from "./pages/server/Checkout";
import OrderHistory from "./pages/server/OrderHistory";
import Sales from "./pages/server/Sales";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        {/* Manager Routes */}
        {user.role === "Restaurant Manager" && (
          <>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recipes" element={<RecipeManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<StockAlerts />} />
          </>
        )}

        {/* Kitchen Staff Routes */}
        {user.role === "Kitchen Staff" && (
          <>
            <Route path="/" element={<Navigate to="/recipes" />} />
            <Route path="/recipes" element={<KitchenRecipes />} />
            <Route path="/prep" element={<PrepItems />} />
            <Route path="/ingredients" element={<KitchenIngredients />} />
            <Route path="/orders" element={<KitchenOrders />} />
          </>
        )}

        {/* Inventory Manager Routes */}
        {user.role === "Inventory Manager" && (
          <>
            <Route path="/" element={<Navigate to="/stock" />} />
            <Route path="/stock" element={<StockMonitor />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/alerts" element={<StockAlerts />} />
            <Route path="/reports" element={<UsageReports />} />
            <Route path="/deliveries" element={<Deliveries />} />
          </>
        )}

        {/* Server Routes */}
        {user.role === "Server" && (
          <>
            <Route path="/" element={<Navigate to="/menu" />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<CurrentOrder />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/sales" element={<Sales />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
