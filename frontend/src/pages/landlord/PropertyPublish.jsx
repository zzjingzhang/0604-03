import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const PropertyPublish = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: 'chaoyang',
    address: '',
    price: '',
    house_type: '1',
    area: '',
    floor: '',
    orientation: '',
    decoration: '',
    facilities: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (isEdit) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}/`);
      const data = response.data;
      setFormData({
        title: data.title,
        description: data.description,
        district: data.district,
        address: data.address,
        price: data.price,
        house_type: data.house_type,
        area: data.area,
        floor: data.floor || '',
        orientation: data.orientation || '',
        decoration: data.decoration || '',
        facilities: data.facilities || '',
      });
    } catch (error) {
      console.error('获取房源详情失败:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isEdit) {
        await api.put(`/properties/${id}/`, formData);
        alert('房源更新成功！');
      } else {
        await api.post('/properties/', formData);
        alert('房源发布成功，等待管理员审核！');
      }
      navigate('/landlord/properties');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('操作失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-600 hover:text-green-800 mb-4"
      >
        <ArrowLeft size={20} className="mr-1" />
        返回
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {isEdit ? '编辑房源' : '发布新房源'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">房源标题 *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">区域 *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {districts.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">详细地址 *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">月租金（元）*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">户型 *</label>
              <select
                name="house_type"
                value={formData.house_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {houseTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">面积（㎡）*</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">楼层</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">朝向</label>
              <input
                type="text"
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="如：南北通透"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">装修情况</label>
              <input
                type="text"
                name="decoration"
                value={formData.decoration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="如：精装修"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">房源描述 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={4}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">配套设施</label>
              <textarea
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
                placeholder="如：空调、冰箱、洗衣机、宽带..."
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? '提交中...' : isEdit ? '保存修改' : '发布房源'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyPublish;
