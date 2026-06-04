import { useState, useEffect } from 'react';
import { MessageSquare, Send, XCircle } from 'lucide-react';
import api from '../../utils/api';

const LandlordMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({ subject: '', content: '', receiver_id: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/received/');
      setMessages(response.data);
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data.filter(u => u.role === 'tenant'));
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/messages/${id}/mark_read/`);
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages/', newMessage);
      setShowCompose(false);
      setNewMessage({ subject: '', content: '', receiver_id: '' });
      fetchMessages();
      alert('消息发送成功！');
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送失败，请重试');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">消息中心</h2>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Send size={18} />
          发送消息
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">加载中...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
          <p>暂无消息</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow p-6 ${!msg.is_read ? 'border-l-4 border-green-500' : ''}`}
              onClick={() => !msg.is_read && markAsRead(msg.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {msg.subject}
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    来自：{msg.sender?.username || '系统'}
                  </p>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(msg.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <p className="text-gray-600">{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">发送消息</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">接收人</label>
                <select
                  value={newMessage.receiver_id}
                  onChange={(e) => setNewMessage({ ...newMessage, receiver_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">请选择接收人</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.username}（租客）</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">主题</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">内容</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordMessages;
