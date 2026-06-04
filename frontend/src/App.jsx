import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TenantLayout from './layouts/TenantLayout';
import LandlordLayout from './layouts/LandlordLayout';
import AdminLayout from './layouts/AdminLayout';
import PropertyList from './pages/tenant/PropertyList';
import PropertyDetail from './pages/tenant/PropertyDetail';
import Favorites from './pages/tenant/Favorites';
import TenantApplications from './pages/tenant/Applications';
import TenantContracts from './pages/tenant/Contracts';
import TenantMessages from './pages/tenant/Messages';
import LandlordProperties from './pages/landlord/Properties';
import LandlordApplications from './pages/landlord/Applications';
import LandlordContracts from './pages/landlord/Contracts';
import LandlordMessages from './pages/landlord/Messages';
import PropertyPublish from './pages/landlord/PropertyPublish';
import AdminProperties from './pages/admin/Properties';
import AdminUsers from './pages/admin/Users';
import AdminApplications from './pages/admin/Applications';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading, isTenant, isLandlord, isAdmin, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  const getHomeRoute = () => {
    if (!isAuthenticated) return '/login';
    if (isTenant) return '/tenant/properties';
    if (isLandlord) return '/landlord/properties';
    if (isAdmin) return '/admin/properties';
    return '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/tenant" element={<ProtectedRoute allowedRoles={['tenant']}><TenantLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="properties" replace />} />
        <Route path="properties" element={<PropertyList />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="applications" element={<TenantApplications />} />
        <Route path="contracts" element={<TenantContracts />} />
        <Route path="messages" element={<TenantMessages />} />
      </Route>
      
      <Route path="/landlord" element={<ProtectedRoute allowedRoles={['landlord']}><LandlordLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="properties" replace />} />
        <Route path="properties" element={<LandlordProperties />} />
        <Route path="properties/publish" element={<PropertyPublish />} />
        <Route path="properties/edit/:id" element={<PropertyPublish />} />
        <Route path="applications" element={<LandlordApplications />} />
        <Route path="contracts" element={<LandlordContracts />} />
        <Route path="messages" element={<LandlordMessages />} />
      </Route>
      
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="properties" replace />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="applications" element={<AdminApplications />} />
      </Route>
      
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-xl">页面不存在</div>} />
    </Routes>
  );
}

export default App;
