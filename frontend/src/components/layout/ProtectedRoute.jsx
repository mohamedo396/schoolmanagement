// src/components/layout/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore         from '../../store/auth.store.js';

// Outlet renders the child route's component if authenticated.
// Navigate redirects to /login if not.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}