import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";

// Page components
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ForumPage from "./pages/ForumPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import SupportPage from "./pages/SupportPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Scroll to top when navigating
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes - accessible without login */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forum/public" element={<Navigate to="/forum/public/retirement-tips" replace />} />
            <Route path="/forum/public/:id" element={<ForumPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/private"
              element={
                <ProtectedRoute>
                  <Navigate to="/forum/private/my-circle" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forum/private/:id"
              element={
                <ProtectedRoute>
                  <ForumPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SupportPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;