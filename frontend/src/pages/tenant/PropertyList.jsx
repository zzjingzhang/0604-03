import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Search } from 'lucide-react';
import api from '../../utils/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    district: '',
    min_price: '',
    max_price: '',
    house_type: '',
    min_area: '',
    max_area: '',
  });
  const [loading, setLoading] = useState(true);

  const districts = [
    { value: '', label: '全部区域' },
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
    { value: '', label: '全部户型' },
    { value: '1', label: '一室' },
    { value: '2', label: '两室' },
    { value: '3', label: '三室' },
    { value: '4', label: '四室及以上' },
  ];

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/properties/?${params}`);
      setProperties(response.data);
    } catch (error) {
      console.error('获取房源失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (property.is_favorited) {
        await api.delete(`/properties/favorites/remove/?property_id=${propertyId}`);
      } else {
        await api.post('/properties/favorites/', { property_id: propertyId });
      }
      setProperties(properties.map(p => 
        p.id === propertyId ? { ...p, is_favorited: !p.is_favorited } : p
      ));
    } catch (error) {
      console.error('操作收藏失败:', error);
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
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">筛选条件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">区域</label>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {districts.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">最低价格</label>
            <input
              type="number"
              name="min_price"
              value={filters.min_price}
              onChange={handleFilterChange}
              placeholder="元/月"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">最高价格</label>
            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleFilterChange}
              placeholder="元/月"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">户型</label>
            <select
              name="house_type"
              value={filters.house_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {houseTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">最小面积</label>
            <input
              type="number"
              name="min_area"
              value={filters.min_area}
              onChange={handleFilterChange}
              placeholder="㎡"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">最大面积</label>
            <input
              type="number"
              name="max_area"
              value={filters.max_area}
              onChange={handleFilterChange}
              placeholder="㎡"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">房源列表</h2>
        <span className="text-gray-500">共 {properties.length} 套房源</span>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无符合条件的房源</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <Link to={`/tenant/properties/${property.id}`}>
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {property.image ? (
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">暂无图片</span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/tenant/properties/${property.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">
                    {property.title}
                  </Link>
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`p-1 rounded-full transition ${
                      property.is_favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={20} fill={property.is_favorited ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin size={14} className="mr-1" />
                  <span className="line-clamp-1">{getDistrictLabel(property.district)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{getHouseTypeLabel(property.house_type)} · {property.area}㎡</span>
                  <span className="text-orange-500 font-bold text-lg">¥{property.price}/月</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
