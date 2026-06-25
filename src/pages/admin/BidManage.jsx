import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiActivity } from 'react-icons/fi';

const BidManage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBids = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllBids();
      setBids(data || []);
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Không thể kết nối đến Backend để tải danh sách đặt giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleCreateBid = async () => {
    const auctionId = window.prompt('Nhập ID sản phẩm đấu giá:');
    if (!auctionId) return;

    const userName = window.prompt('Nhập tên người dùng (user name):');
    if (!userName) return;

    const bidAmountStr = window.prompt('Nhập số tiền đặt (VND):');
    if (!bidAmountStr) return;
    const bidAmount = parseFloat(bidAmountStr) || 0;

    const newBid = {
      auctionId: parseInt(auctionId),
      userName,
      bidAmount,
      bidTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.createBid(newBid);
      setSuccess(`Đã tạo thành công lượt đặt giá của: ${userName}`);
      await fetchBids();
    } catch (err) {
      console.error('Error creating bid:', err);
      setError('Lỗi khi tạo mới lượt đặt giá trên hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteBid = async (id, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lượt đặt giá của "${userName}"?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteBid(id);
      setSuccess(`Đã xóa thành công lượt đặt giá ID: ${id}`);
      await fetchBids();
    } catch (err) {
      console.error('Error deleting bid:', err);
      setError(`Lỗi khi thực hiện xóa lượt đặt giá ID: ${id}`);
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleEditMock = (bid) => {
    window.prompt(`Cập nhật số tiền đặt giá:`, bid.bidAmount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiActivity className="text-blue-600" /> Quản lý Đặt giá (Bids)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý lịch sử đặt giá và kiểm tra logs đấu giá của người dùng.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateBid}
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
      ) : bids.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có lượt đặt giá nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Sản phẩm</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Người đặt giá</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Số tiền đặt</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Thời gian đặt</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{bid.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">#{bid.auctionId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bid.userName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-600">{formatCurrency(bid.bidAmount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{bid.bidTime}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(bid)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteBid(bid.id, bid.userName)}
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

export default BidManage;
