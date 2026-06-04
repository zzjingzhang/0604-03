import { useState, useEffect } from 'react';
import { Home, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import api from '../../utils/api';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  const districts = [
    { value: 'chaoyang', label: '朝阳区' },
    { value: 'haidian', label: '海淀区' },
    { value: 'xicheng', label: '西城区' },
    { value: 'dongcheng', label: '东城区' },
    { value: 'fengtai', label: '丰台区' },
    { value: 'shijingshan', label: '石景山区' },
    { value: 'tongzhou', label: '通州区' },
    { value: 'changping', label: '昌平区' },
    { value: 'daxing', label: '大兴区' },
    { value: 'yizhuang', label: '亦庄' },
  ];

  const houseTypes = [
    { value: '1', label: '一室' },
    { value: '2', label: '两室' },
    { value: '3', label: '三室' },
    { value: '4', label: '四室及以上' },
  ];

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const fetchProperties = async () => {
    try {
      const response = await api.get(`/properties/?status=${statusFilter}`);
      setProperties(response.data);
    } catch (error) {
      console.error('获取房源列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('确定通过该房源审核吗？')) return;
    
    try {
      await api.post(`/properties/${id}/approve/`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('审核通过失败:', error);
      alert('操作失败，请重试');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('确定拒绝该房源审核吗？')) return;
    
    try {
      await api.post(`/properties/${id}/reject/`);
      setProperties(properties.filter(p => p.id !== id));
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
      case 'rented':
        return { label: '已出租', color: 'text-blue-600 bg-blue-100', icon: CheckCircle };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-100', icon: Clock };
    }
  };

  const getDistrictLabel = (value) => {
    const district = districts.find(d => d.value === value);
    return district ? district.label : value;
  };

  const getHouseTypeLabel = (value) => {
    const type = houseTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">房源审核</h2>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'rented'].map(status => {
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
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <Home size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无{getStatusConfig(statusFilter).label}的房源</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const statusConfig = getStatusConfig(property.status);
            const StatusIcon = statusConfig.icon;
            return (
              <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden flex">
                <div className="w-48 h-36 bg-gray-200 flex-shrink-0">
                  {property.image ? (
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                  )}
                </div>
                <div className="flex-1 p-4 flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{property.title}</h3>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusConfig.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      房东：{property.landlord_name}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {getDistrictLabel(property.district)} · {getHouseTypeLabel(property.house_type)} · {property.area}㎡
                    </div>
                    <div className="text-orange-500 font-bold text-lg">¥{property.price}/月</div>
                  </div>
                  <div className="flex flex-col justify-center gap-2 ml-4">
                    {property.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(property.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                        >
                          <CheckCircle size={16} />
                          通过
                        </button>
                        <button
                          onClick={() => handleReject(property.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        >
                          <XCircle size={16} />
                          拒绝
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
