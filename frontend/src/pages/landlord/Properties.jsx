import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../utils/api';

const LandlordProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties/');
      setProperties(response.data);
    } catch (error) {
      console.error('获取房源列表失败:', error);
    } finally {
      setLoading(false);
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
        <h2 className="text-xl font-bold text-gray-800">我的房源</h2>
        <Link
          to="/landlord/properties/publish"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          发布房源
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <Home size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无房源，快去发布一套吧！</p>
          <Link
            to="/landlord/properties/publish"
            className="inline-block mt-4 text-green-600 hover:underline"
          >
            立即发布 →
          </Link>
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
                    <div className="text-sm text-gray-500 mb-2">
                      {getDistrictLabel(property.district)} · {getHouseTypeLabel(property.house_type)} · {property.area}㎡
                    </div>
                    <div className="text-orange-500 font-bold text-lg">¥{property.price}/月</div>
                  </div>
                  <div className="flex flex-col justify-between items-end ml-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/landlord/properties/edit/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="编辑"
                      >
                        <Edit size={18} />
                      </Link>
                    </div>
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

export default LandlordProperties;
