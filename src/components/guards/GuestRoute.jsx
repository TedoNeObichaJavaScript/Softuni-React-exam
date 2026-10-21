import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

export default function GuestRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // After logging in from a protected page, send the user back there.
    return <Navigate to={location.state?.from ?? '/trails'} replace />;
  }

  return <Outlet />;
}
