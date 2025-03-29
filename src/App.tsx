import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loaded page components
const LandingPage = lazy(() => import("./pages/LandingPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ForumPage = lazy(() => import("./pages/ForumPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Scroll to top when navigating
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

const App = () => {
  useEffect(() => {
    const checkAuth = () => {
      const lastActivity = parseInt(sessionStorage.getItem('lastActivity') || '0');
      const now = Date.now();
      if (now - lastActivity > 30 * 60 * 1000) {
        sessionStorage.clear();
        window.location.href = '/login';
      } else {
        sessionStorage.setItem('lastActivity', now.toString());
      }
    };

    const interval = setInterval(checkAuth, 60000);
    window.addEventListener('storage', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forum/public" element={<Navigate to="/forum/public/retirement-tips" replace />} />
          <Route path="/forum/public/:id" element={<ForumPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/forum/private" element={<ProtectedRoute><Navigate to="/forum/private/my-circle" replace /></ProtectedRoute>} />
          <Route path="/forum/private/:id" element={<ProtectedRoute><ForumPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;