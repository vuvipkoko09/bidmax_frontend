import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiTrendingUp, FiCheck } from 'react-icons/fi';

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

  const handleApproveAuction = async (auction) => {
    if (!window.confirm(`Bạn có chắc chắn muốn duyệt phiên đấu giá "${auction.title}" không?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updatePayload = {
        title: auction.title,
        description: auction.description || 'N/A',
        startPrice: auction.startPrice,
        stepPrice: auction.stepPrice || 0,
        depositAmount: auction.depositAmount || 0,
        sellerId: auction.sellerId || 1,
        categoryId: auction.categoryId || 1,
        locationId: auction.locationId || 1,
        status: 'ACTIVE',
        regStartTime: auction.regStartTime,
        regEndTime: auction.regEndTime,
        bidStartTime: auction.bidStartTime,
        bidEndTime: auction.bidEndTime
      };

      await adminService.updateAuction(auction.id, updatePayload);
      setSuccess(`Đã duyệt thành công phiên đấu giá: ${auction.title}`);
      await fetchAuctions();
    } catch (err) {
      console.error('Error approving auction:', err);
      setError(`Lỗi khi duyệt phiên đấu giá ID: ${auction.id}`);
      setLoading(false);
    }
  };

  const [editingAuction, setEditingAuction] = useState(null);

  const handleEditAuction = (auction) => {
    setEditingAuction({ ...auction });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingAuction((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitEditAuction = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const updatePayload = {
        title: editingAuction.title,
        description: editingAuction.description || 'N/A',
        startPrice: parseFloat(editingAuction.startPrice) || 0,
        stepPrice: parseFloat(editingAuction.stepPrice) || 0,
        depositAmount: parseFloat(editingAuction.depositAmount) || 0,
        sellerId: editingAuction.sellerId || 1,
        categoryId: editingAuction.categoryId || 1,
        locationId: editingAuction.locationId || 1,
        status: editingAuction.status,
        regStartTime: editingAuction.regStartTime,
        regEndTime: editingAuction.regEndTime,
        bidStartTime: editingAuction.bidStartTime,
        bidEndTime: editingAuction.bidEndTime
      };

      await adminService.updateAuction(editingAuction.id, updatePayload);
      setSuccess(`Đã cập nhật phiên đấu giá thành công!`);
      setEditingAuction(null);
      await fetchAuctions();
    } catch (err) {
      console.error('Error updating auction:', err);
      setError(`Lỗi khi cập nhật phiên đấu giá ID: ${editingAuction.id}`);
      setLoading(false);
    }
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
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Hình ảnh</th>
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
                  <td className="px-6 py-4 text-sm">
                    {auction.thumbnail ? (
                      <img src={auction.thumbnail} alt="thumbnail" className="w-12 h-12 object-cover rounded border border-gray-200" />
                    ) : (
                      <span className="text-gray-400 text-xs italic">Không có ảnh</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(auction.startPrice)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600">{formatCurrency(auction.currentPrice)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(auction.bidEndTime).toLocaleString()}</td>
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
                      {auction.status === 'PENDING' && (
                        <button 
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" 
                          onClick={() => handleApproveAuction(auction)}
                          title="Duyệt (Approve)"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditAuction(auction)}
                        title="Chỉnh sửa (Edit Title)"
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
      {/* Edit Modal */}
      {editingAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Chỉnh sửa phiên đấu giá #{editingAuction.id}</h3>
              <button onClick={() => setEditingAuction(null)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="edit-auction-form" onSubmit={submitEditAuction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề</label>
                  <input type="text" name="title" value={editingAuction.title || ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
                  <select name="status" value={editingAuction.status || ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                    <option value="PENDING">PENDING</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SOLD">SOLD</option>
                    <option value="UNSOLD">UNSOLD</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giá khởi điểm</label>
                  <input type="number" name="startPrice" value={editingAuction.startPrice || ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bước giá</label>
                  <input type="number" name="stepPrice" value={editingAuction.stepPrice || ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tiền cọc</label>
                  <input type="number" name="depositAmount" value={editingAuction.depositAmount || ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bắt đầu đăng ký</label>
                  <input type="datetime-local" name="regStartTime" value={editingAuction.regStartTime ? editingAuction.regStartTime.substring(0,16) : ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kết thúc đăng ký</label>
                  <input type="datetime-local" name="regEndTime" value={editingAuction.regEndTime ? editingAuction.regEndTime.substring(0,16) : ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bắt đầu đấu giá</label>
                  <input type="datetime-local" name="bidStartTime" value={editingAuction.bidStartTime ? editingAuction.bidStartTime.substring(0,16) : ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Kết thúc đấu giá</label>
                  <input type="datetime-local" name="bidEndTime" value={editingAuction.bidEndTime ? editingAuction.bidEndTime.substring(0,16) : ''} onChange={handleEditFormChange} className="w-full border border-gray-300 rounded-lg p-2" />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setEditingAuction(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors">Hủy bỏ</button>
              <button type="submit" form="edit-auction-form" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionManage;
