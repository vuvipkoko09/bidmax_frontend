import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';

const ReviewManage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleCreateReview = async () => {
    const auctionIdStr = window.prompt('Nhập ID phiên đấu giá (Auction ID):');
    if (!auctionIdStr) return;
    const auctionId = parseInt(auctionIdStr) || 0;

    const senderName = window.prompt('Nhập tên người gửi đánh giá:');
    if (!senderName) return;

    const ratingStr = window.prompt('Nhập điểm đánh giá (1-5):');
    if (!ratingStr) return;
    const rating = parseInt(ratingStr) || 5;

    const comment = window.prompt('Nhập bình luận đánh giá:');

    const newReview = { auctionId, senderName, rating, comment: comment || '', createdAt: new Date().toISOString() };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.createReview(newReview);
      setSuccess(`Đã tạo thành công đánh giá từ: ${senderName}`);
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
    window.prompt(`Cập nhật phản hồi đánh giá của: ${rev.senderName}`, rev.comment);
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
    </div>
  );
};

export default ReviewManage;
