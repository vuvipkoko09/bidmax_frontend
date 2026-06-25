import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiBell } from 'react-icons/fi';

const NotificationManage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleCreateNotification = async () => {
    const userIdStr = window.prompt('Nhập ID người nhận (User ID):');
    if (!userIdStr) return;
    const userId = parseInt(userIdStr) || 0;

    const message = window.prompt('Nhập nội dung thông báo:');
    if (!message) return;

    const newNotification = { userId, message, isRead: false, createdAt: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
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
    window.prompt(`Cập nhật nội dung thông báo:`, item.message);
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
    </div>
  );
};

export default NotificationManage;
