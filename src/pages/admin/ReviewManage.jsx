import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const ReviewManage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ auctionId: '', senderName: '', rating: '5', comment: '' });
  const [editingItem, setEditingItem] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Không thể kết nối đến Backend để tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = () => {
    setFormData({ auctionId: '', senderName: '', rating: '5', comment: '' });
    setIsCreateModalOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const auctionId = parseInt(formData.auctionId) || 0;
    const rating = parseInt(formData.rating) || 5;

    const newReview = { auctionId, senderName: formData.senderName, rating, comment: formData.comment || '', createdAt: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsCreateModalOpen(false);
      await adminService.createReview(newReview);
      setSuccess(`Đã tạo thành công đánh giá từ: ${formData.senderName}`);
      await fetchReviews();
    } catch (err) {
      console.error('Error creating review:', err);
      setError('Lỗi khi thêm đánh giá mới.');
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id, senderName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đánh giá của "${senderName}"?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteReview(id);
      setSuccess(`Đã xóa thành công đánh giá ID: ${id}`);
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(`Lỗi khi thực hiện xóa đánh giá ID: ${id}`);
      setLoading(false);
    }
  };

  const handleEditMock = (rev) => {
    setEditingItem(rev);
    setFormData({ auctionId: rev.auctionId || '', senderName: rev.senderName || '', rating: rev.rating || '5', comment: rev.comment || '' });
    setIsEditModalOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    console.log(`Cập nhật phản hồi đánh giá của: ${editingItem.senderName}`, formData.comment);
    setSuccess(`Đã cập nhật giả lập đánh giá ID=${editingItem.id}`);
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
            <FiStar className="text-blue-600" /> Quản lý Đánh giá (Reviews)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý các phản hồi, đánh giá chất lượng sản phẩm và thái độ giao dịch từ người mua/bán.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateReview}
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
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có đánh giá nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Phiên đấu giá</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Người đánh giá</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Số sao (Rating)</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Bình luận</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{rev.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rev.auctionId}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{rev.senderName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-500">{rev.rating} ★</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rev.comment}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(rev)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteReview(rev.id, rev.senderName)}
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
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm mới đánh giá">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Phiên đấu giá (Auction ID)</label>
            <input type="number" name="auctionId" value={formData.auctionId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập ID phiên đấu giá..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên người gửi</label>
            <input type="text" name="senderName" value={formData.senderName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập tên người gửi..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Điểm đánh giá (1-5)</label>
            <input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bình luận</label>
            <textarea name="comment" value={formData.comment} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows="3" placeholder="Nhập bình luận..."></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm shadow-blue-600/20">Lưu lại</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Cập nhật đánh giá #${editingItem?.id}`}>
        <form onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Phiên đấu giá (Auction ID)</label>
            <input type="number" name="auctionId" value={formData.auctionId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên người gửi</label>
            <input type="text" name="senderName" value={formData.senderName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Điểm đánh giá (1-5)</label>
            <input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bình luận</label>
            <textarea name="comment" value={formData.comment} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" rows="3"></textarea>
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

export default ReviewManage;
