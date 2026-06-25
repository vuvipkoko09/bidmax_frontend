import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiTrendingUp } from 'react-icons/fi';

const AuctionManage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllAuctions();
      setAuctions(data || []);
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('Không thể kết nối đến Backend để tải danh sách đấu giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleCreateAuction = async () => {
    const title = window.prompt('Nhập tiêu đề phiên đấu giá:');
    if (!title) return;

    const startPriceStr = window.prompt('Nhập giá khởi điểm (VND):');
    if (!startPriceStr) return;
    const startingPrice = parseFloat(startPriceStr) || 0;

    const endTime = window.prompt('Nhập thời gian kết thúc (YYYY-MM-DD HH:mm):');
    if (!endTime) return;

    const newAuction = {
      title,
      startingPrice,
      currentPrice: startingPrice,
      endTime,
      status: 'ACTIVE'
    };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.createAuction(newAuction);
      setSuccess(`Đã tạo thành công phiên đấu giá: ${title}`);
      await fetchAuctions();
    } catch (err) {
      console.error('Error creating auction:', err);
      setError('Lỗi khi tạo mới phiên đấu giá trên hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteAuction = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa phiên đấu giá "${title}"?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteAuction(id);
      setSuccess(`Đã xóa thành công phiên đấu giá: ${title}`);
      await fetchAuctions();
    } catch (err) {
      console.error('Error deleting auction:', err);
      setError(`Lỗi khi thực hiện xóa phiên đấu giá ID: ${id}`);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleEditMock = (auc) => {
    window.prompt(`Cập nhật tiêu đề phiên đấu giá:`, auc.title);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiTrendingUp className="text-blue-600" /> Quản lý Đấu giá (Auctions)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Cấu hình thời gian, bước giá và các thông tin cần thiết cho phiên đấu giá.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateAuction}
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
      ) : auctions.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có phiên đấu giá nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tiêu đề</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Giá khởi điểm</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Giá hiện tại</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Thời gian kết thúc</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auctions.map((auction) => (
                <tr key={auction.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{auction.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{auction.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(auction.startingPrice)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(auction.currentPrice)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{auction.endTime}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      auction.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(auction)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteAuction(auction.id, auction.title)}
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

export default AuctionManage;
