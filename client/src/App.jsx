import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
// Lazy load other pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage.jsx'));
const HistoryPage = lazy(() => import('./pages/HistoryPage.jsx'));
const ReportPage = lazy(() => import('./pages/ReportPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFound.jsx'));
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-[#0A0E1A]">
    <div className="text-center">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] mx-auto mb-4 animate-pulse" />
      <p className="text-[#94A3B8]">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public layout wrapper for protected pages
const ProtectedLayout = ({ children, title, breadcrumb, actions }) => (
  <AppShell title={title} breadcrumb={breadcrumb} actions={actions}>
    {children}
  </AppShell>
);

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout title="Dashboard">
                <DashboardPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analysis/:jobId"
          element={
            <ProtectedRoute>
              <ProtectedLayout title="Analysis Results">
                <AnalysisPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ProtectedLayout title="Analysis History" breadcrumb={['Dashboard', 'History']}>
                <HistoryPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Public/protected report page */}
        <Route path="/report/:reportId" element={<ReportPage />} />

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
