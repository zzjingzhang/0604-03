import { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

const LandlordContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await api.get('/contracts/');
      setContracts(response.data);
    } catch (error) {
      console.error('获取合同列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { label: '生效中', color: 'text-green-600 bg-green-100', icon: CheckCircle };
      case 'expired':
        return { label: '已到期', color: 'text-gray-600 bg-gray-100', icon: Clock };
      case 'terminated':
        return { label: '已终止', color: 'text-red-600 bg-red-100', icon: XCircle };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">我的合同</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : contracts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无合同记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const statusConfig = getStatusConfig(contract.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={contract.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{contract.property.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      租客：{contract.tenant.username}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusConfig.color}`}>
                    <StatusIcon size={16} />
                    {statusConfig.label}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>租金：¥{contract.monthly_rent}/月</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>押金：¥{contract.deposit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>开始：{contract.start_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>结束：{contract.end_date}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">合同条款</h4>
                  <p className="text-gray-600 text-sm">{contract.terms}</p>
                </div>

                <div className="text-gray-400 text-sm mt-4">
                  签订时间：{new Date(contract.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LandlordContracts;
