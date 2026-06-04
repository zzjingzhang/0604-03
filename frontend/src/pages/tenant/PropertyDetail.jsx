import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowLeft, Send } from 'lucide-react';
import api from '../../utils/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}/`);
      setProperty(response.data);
    } catch (error) {
      console.error('获取房源详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (property.is_favorited) {
        await api.delete(`/properties/favorites/remove/?property_id=${id}`);
      } else {
        await api.post('/properties/favorites/', { property_id: id });
      }
      setProperty({ ...property, is_favorited: !property.is_favorited });
    } catch (error) {
      console.error('操作收藏失败:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/properties/applications/', {
        property_id: id,
        message: applyMessage,
      });
      alert('申请已提交！');
      setShowApplyModal(false);
      setApplyMessage('');
    } catch (error) {
      console.error('提交申请失败:', error);
      alert('提交申请失败，请重试');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (!property) {
    return <div className="text-center py-10">房源不存在</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={20} className="mr-1" />
        返回列表
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-80 bg-gray-200 flex items-center justify-center">
          {property.image ? (
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xl">暂无图片</span>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition ${
                property.is_favorited
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={property.is_favorited ? 'currentColor' : 'none'} />
              {property.is_favorited ? '已收藏' : '收藏'}
            </button>
          </div>

          <div className="flex items-center text-orange-500 text-3xl font-bold mb-6">
            ¥{property.price}
            <span className="text-base text-gray-500 font-normal ml-1">/月</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">户型</div>
              <div className="text-lg font-semibold">{getHouseTypeLabel(property.house_type)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">面积</div>
              <div className="text-lg font-semibold">{property.area}㎡</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">区域</div>
              <div className="text-lg font-semibold">{getDistrictLabel(property.district)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">楼层</div>
              <div className="text-lg font-semibold">{property.floor || '-'}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">房源描述</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>
          </div>

          {property.facilities && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">配套设施</h3>
              <p className="text-gray-600">{property.facilities}</p>
            </div>
          )}

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <div className="text-gray-500 text-sm mb-1">房东</div>
              <div className="font-semibold">{property.landlord?.username}</div>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              <Send size={18} />
              申请租赁
            </button>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">提交租赁申请</h3>
            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">留言（可选）</label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="请输入您的留言..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {submitting ? '提交中...' : '提交申请'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
