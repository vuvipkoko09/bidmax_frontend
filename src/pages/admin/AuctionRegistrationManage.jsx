import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiFileText } from 'react-icons/fi';

const AuctionRegistrationManage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllAuctionRegistrations();
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Không thể kết nối đến Backend để tải danh sách đăng ký đấu giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCreateRegistration = async () => {
    const userIdStr = window.prompt('Nhập ID người dùng (User ID):');
    if (!userIdStr) return;
    const userId = parseInt(userIdStr) || 0;

    const auctionIdStr = window.prompt('Nhập ID phiên đấu giá (Auction ID):');
    if (!auctionIdStr) return;
    const auctionId = parseInt(auctionIdStr) || 0;

    const newReg = { userId, auctionId, registrationTime: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.createAuctionRegistration(newReg);
      setSuccess(`Đăng ký thành công cho User ID: ${userId} tham gia Phiên ID: ${auctionId}`);
      await fetchRegistrations();
    } catch (err) {
      console.error('Error creating registration:', err);
      setError('Lỗi khi đăng ký tham gia đấu giá.');
      setLoading(false);
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đăng ký ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteAuctionRegistration(id);
      setSuccess(`Đã xóa đăng ký tham gia ID: ${id}`);
      await fetchRegistrations();
    } catch (err) {
      console.error('Error deleting registration:', err);
      setError(`Lỗi khi thực hiện xóa đăng ký tham gia ID: ${id}`);
      setLoading(false);
    }
  };

  const handleEditMock = (reg) => {
    window.prompt(`Cập nhật đăng ký: ID=${reg.id}`, `User ID=${reg.userId}, Auction ID=${reg.auctionId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiFileText className="text-blue-600" /> Quản lý Đăng ký đấu giá (Auction Registrations)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Lưu trữ, rà soát danh sách hồ sơ đăng ký tham gia đấu giá của các thành viên.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateRegistration}
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
      ) : registrations.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có lượt đăng ký nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Người dùng</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Phiên đấu giá</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{reg.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{reg.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{reg.auctionId}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(reg)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteRegistration(reg.id)}
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

export default AuctionRegistrationManage;
