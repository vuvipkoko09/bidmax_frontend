import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiBell } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const NotificationManage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userId: '', message: '' });
  const [editingItem, setEditingItem] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Không thể kết nối đến Backend để tải danh sách thông báo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateNotification = () => {
    setFormData({ userId: '', message: '' });
    setIsCreateModalOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const userId = parseInt(formData.userId) || 0;
    const newNotification = { userId, message: formData.message, isRead: false, createdAt: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsCreateModalOpen(false);
      await adminService.createNotification(newNotification);
      setSuccess(`Đã gửi thành công thông báo tới User ID: ${userId}`);
      await fetchNotifications();
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Lỗi khi gửi thông báo mới.');
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thông báo ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteNotification(id);
      setSuccess(`Đã xóa thành công thông báo ID: ${id}`);
      await fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(`Lỗi khi thực hiện xóa thông báo ID: ${id}`);
      setLoading(false);
    }
  };

  const handleEditMock = (item) => {
    setEditingItem(item);
    setFormData({ userId: item.userId || '', message: item.message || '' });
    setIsEditModalOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    console.log(`Cập nhật nội dung thông báo:`, formData.message);
    setSuccess(`Đã cập nhật giả lập nội dung thông báo ID=${editingItem.id}`);
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiBell className="text-blue-600" /> Quản lý Thông báo (Notifications)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý và gửi thông báo hệ thống, thông báo kết quả đấu giá tới người dùng.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateNotification}
        >
          <FiPlus className="w-4 h-4" /> Tạo mới
        </button>
      </div>

      {/* Success notification */}
      {success && (
        <div className="mx-6 mt-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="mx-6 mt-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có thông báo nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Người nhận</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Nội dung thông báo</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái đọc</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{notif.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{notif.userId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{notif.message}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      notif.isRead 
                        ? 'bg-gray-50 text-gray-700 border-gray-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {notif.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(notif)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteNotification(notif.id)}
                        title="Xóa"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm mới thông báo">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Người nhận (User ID)</label>
            <input type="number" name="userId" value={formData.userId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập ID người dùng..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung thông báo</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows="3" required placeholder="Nhập nội dung..."></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm shadow-blue-600/20">Gửi thông báo</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Cập nhật thông báo #${editingItem?.id}`}>
        <form onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Người dùng (User ID)</label>
            <input type="number" name="userId" value={formData.userId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung thông báo</label>
            <textarea name="message" value={formData.message} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows="3" required></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm shadow-blue-600/20">Cập nhật</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationManage;
