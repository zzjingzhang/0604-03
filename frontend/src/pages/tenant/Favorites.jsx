import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
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
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/properties/favorites/');
      setFavorites(response.data);
    } catch (error) {
      console.error('获取收藏列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    if (!confirm('确定要取消收藏吗？')) return;
    
    try {
      await api.delete(`/properties/favorites/remove/?property_id=${propertyId}`);
      setFavorites(favorites.filter(f => f.property.id !== propertyId));
    } catch (error) {
      console.error('取消收藏失败:', error);
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
      <h2 className="text-xl font-bold text-gray-800 mb-6">我的收藏</h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <Heart size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无收藏的房源</p>
          <Link
            to="/tenant/properties"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            去浏览房源 →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white rounded-lg shadow overflow-hidden flex">
              <Link to={`/tenant/properties/${fav.property.id}`} className="w-48 h-36 bg-gray-200 flex-shrink-0">
                {fav.property.image ? (
                  <img src={fav.property.image} alt={fav.property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                )}
              </Link>
              <div className="flex-1 p-4 flex justify-between">
                <div className="flex-1">
                  <Link
                    to={`/tenant/properties/${fav.property.id}`}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-1 block"
                  >
                    {fav.property.title}
                  </Link>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin size={14} className="mr-1" />
                    <span>{getDistrictLabel(fav.property.district)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{getHouseTypeLabel(fav.property.house_type)}</span>
                    <span>{fav.property.area}㎡</span>
                    <span className="text-orange-500 font-bold">¥{fav.property.price}/月</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end ml-4">
                  <button
                    onClick={() => removeFavorite(fav.property.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2"
                    title="取消收藏"
                  >
                    <Trash2 size={20} />
                  </button>
                  <Link
                    to={`/tenant/properties/${fav.property.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
