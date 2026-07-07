import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiBookmark } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const WatchlistManage = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userId: '', auctionId: '' });
  const [editingItem, setEditingItem] = useState(null);

  const fetchWatchlists = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllWatchlists();
      setWatchlists(data || []);
    } catch (err) {
      console.error('Error fetching watchlists:', err);
      setError('Không thể kết nối đến Backend để tải danh sách theo dõi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const handleCreateWatchlist = () => {
    setFormData({ userId: '', auctionId: '' });
    setIsCreateModalOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const userId = parseInt(formData.userId) || 0;
    const auctionId = parseInt(formData.auctionId) || 0;

    const newWatch = { userId, auctionId, addedAt: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsCreateModalOpen(false);
      await adminService.createWatchlist(newWatch);
      setSuccess(`Đã thêm đấu giá ID: ${auctionId} vào danh sách theo dõi của User ID: ${userId}`);
      await fetchWatchlists();
    } catch (err) {
      console.error('Error creating watchlist:', err);
      setError('Lỗi khi thêm vào danh sách theo dõi.');
      setLoading(false);
    }
  };

  const handleDeleteWatchlist = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khỏi danh sách theo dõi ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteWatchlist(id);
      setSuccess(`Đã xóa thành công danh mục theo dõi ID: ${id}`);
      await fetchWatchlists();
    } catch (err) {
      console.error('Error deleting watchlist:', err);
      setError(`Lỗi khi thực hiện xóa khỏi danh sách theo dõi ID: ${id}`);
      setLoading(false);
    }
  };

  const handleEditMock = (watch) => {
    setEditingItem(watch);
    setFormData({ userId: watch.userId || '', auctionId: watch.auctionId || '' });
    setIsEditModalOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    // Giả lập call API cập nhật
    const userId = parseInt(formData.userId) || 0;
    const auctionId = parseInt(formData.auctionId) || 0;
    console.log(`Cập nhật theo dõi ID=${editingItem.id}`, `User=${userId}, Auction=${auctionId}`);
    setSuccess(`Đã cập nhật giả lập cho theo dõi ID=${editingItem.id}`);
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
            <FiBookmark className="text-blue-600" /> Danh sách theo dõi (Watchlists)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Giám sát các sản phẩm đấu giá được người dùng quan tâm và theo dõi.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateWatchlist}
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
      ) : watchlists.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có mục theo dõi nào trên hệ thống.</div>
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
              {watchlists.map((watch) => (
                <tr key={watch.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{watch.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{watch.userId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{watch.auctionId}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(watch)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteWatchlist(watch.id)}
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
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm mới theo dõi">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Người dùng (User ID)</label>
            <input type="number" name="userId" value={formData.userId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập ID người dùng..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Phiên đấu giá (Auction ID)</label>
            <input type="number" name="auctionId" value={formData.auctionId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập ID phiên đấu giá..." />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm shadow-blue-600/20">Lưu lại</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Cập nhật theo dõi #${editingItem?.id}`}>
        <form onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Người dùng (User ID)</label>
            <input type="number" name="userId" value={formData.userId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Phiên đấu giá (Auction ID)</label>
            <input type="number" name="auctionId" value={formData.auctionId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
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

export default WatchlistManage;
