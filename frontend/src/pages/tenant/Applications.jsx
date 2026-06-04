import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

const TenantApplications = () => {
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
      <h2 className="text-xl font-bold text-gray-800 mb-6">我的租赁申请</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无租赁申请记录</p>
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
                    <p className="text-gray-500 text-sm mt-1">
                      租金：¥{app.property.price}/月 · {app.property.area}㎡
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </span>
                </div>
                {app.message && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-gray-600 text-sm">申请留言：{app.message}</p>
                  </div>
                )}
                <div className="text-gray-400 text-sm">
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

export default TenantApplications;
