import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import api from '../../utils/api';

const LandlordApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/properties/applications/');
      setApplications(response.data);
    } catch (error) {
      console.error('获取申请列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('确定通过该申请吗？')) return;
    
    try {
      await api.post(`/properties/applications/${id}/approve/`);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'approved' } : app
      ));
    } catch (error) {
      console.error('通过申请失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('确定拒绝该申请吗？')) return;
    
    try {
      await api.post(`/properties/applications/${id}/reject/`);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'rejected' } : app
      ));
    } catch (error) {
      console.error('拒绝申请失败:', error);
      alert('操作失败，请重试');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { label: '待处理', color: 'text-yellow-600 bg-yellow-100', icon: Clock };
      case 'approved':
        return { label: '已通过', color: 'text-green-600 bg-green-100', icon: CheckCircle };
      case 'rejected':
        return { label: '已拒绝', color: 'text-red-600 bg-red-100', icon: XCircle };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">租赁申请管理</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无租赁申请</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={app.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{app.property.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <User size={14} />
                      <span>申请人：{app.tenant.username}</span>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </span>
                </div>
                
                <div className="text-gray-600 text-sm mb-4">
                  租金：¥{app.property.price}/月 · {app.property.area}㎡
                </div>
                
                {app.message && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-gray-600 text-sm">申请留言：{app.message}</p>
                  </div>
                )}

                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    >
                      <CheckCircle size={16} />
                      通过
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <XCircle size={16} />
                      拒绝
                    </button>
                  </div>
                )}

                <div className="text-gray-400 text-sm mt-4">
                  申请时间：{new Date(app.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandlordApplications;
