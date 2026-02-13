import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, currentRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // توجيه ذكي: إذا حاول السائق دخول صفحات الشاحن (shipper) يتم إرجاعه للوحة تحكمه
  if (currentRole === 'driver' && location.pathname.startsWith('/shipper')) {
    return <Navigate to="/driver/dashboard" replace />;
  }
  
  // إذا حاول الشاحن دخول صفحات السائق يتم إرجاعه
  if (currentRole === 'shipper' && location.pathname.startsWith('/driver')) {
    return <Navigate to="/shipper/dashboard" replace />;
  }

  return <Outlet />;
}
