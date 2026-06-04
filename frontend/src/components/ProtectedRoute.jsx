import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'tenant') return <Navigate to="/tenant/properties" replace />;
    if (user?.role === 'landlord') return <Navigate to="/landlord/properties" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/properties" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
