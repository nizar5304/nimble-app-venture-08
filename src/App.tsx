
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import AddTransaction from "./pages/AddTransaction";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import UserAuth from "./pages/UserAuth";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import StaffManagement from "./pages/StaffManagement";

// Create QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<UserAuth />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
              <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
              <Route path="/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
              <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
              <Route path="/add" element={<RequireAuth><AddTransaction /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/subscription" element={<RequireAuth><Subscription /></RequireAuth>} />
              <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><Admin /></RequireAuth>} />
              <Route path="/staff-management" element={<RequireAuth allowedRoles={['owner']}><StaffManagement /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
