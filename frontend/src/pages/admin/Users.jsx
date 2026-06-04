import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      let response;
      if (statusFilter === 'pending') {
        response = await api.get('/users/pending_users/');
      } else {
        response = await api.get('/users/');
        response.data = response.data.filter(u => u.status === statusFilter && u.role !== 'admin');
      }
      setUsers(response.data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('确定通过该用户审核吗？')) return;
    
    try {
      await api.post(`/users/${id}/approve/`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('审核通过失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('确定拒绝该用户审核吗？')) return;
    
    try {
      await api.post(`/users/${id}/reject/`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('审核拒绝失败:', error);
      alert('操作失败，请重试');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { label: '待审核', color: 'text-yellow-600 bg-yellow-100', icon: Clock };
      case 'approved':
        return { label: '已通过', color: 'text-green-600 bg-green-100', icon: CheckCircle };
      case 'rejected':
        return { label: '已拒绝', color: 'text-red-600 bg-red-100', icon: XCircle };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'tenant':
        return '租客';
      case 'landlord':
        return '房东';
      case 'admin':
        return '管理员';
      default:
        return role;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">用户审核</h2>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected'].map(status => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无{getStatusConfig(statusFilter).label}的用户</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const statusConfig = getStatusConfig(user.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getRoleLabel(user.role)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            拒绝
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
