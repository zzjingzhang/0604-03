import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Heart, FileText, MessageSquare, LogOut, User } from 'lucide-react';

const TenantLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/tenant/properties', label: '房源浏览', icon: Home },
    { path: '/tenant/favorites', label: '收藏房源', icon: Heart },
    { path: '/tenant/applications', label: '租赁申请', icon: FileText },
    { path: '/tenant/contracts', label: '我的合同', icon: FileText },
    { path: '/tenant/messages', label: '消息中心', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">🏠 租房平台 - 租客端</h1>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <User size={18} />
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition"
            >
              <LogOut size={16} />
              退出
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-3 transition ${
                      isActive
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
