import React, { useState, useEffect } from 'react';
import { FiX, FiUploadCloud, FiImage } from 'react-icons/fi';
import API from '../../services/api';
import adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuctionFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startPrice: '',
    stepPrice: '',
    categoryId: '',
    endTime: '',
    image: null
  });

  useEffect(() => {
    if (isOpen) {
      adminService.getAllCategories().then(data => setCategories(data)).catch(console.error);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('startPrice', formData.startPrice);
      data.append('stepPrice', formData.stepPrice);
      data.append('categoryId', formData.categoryId);
      const end = new Date(formData.endTime);
      const now = new Date();
      // Ensure the dates are sequential for backend validation
      const totalDuration = end.getTime() - now.getTime();
      const regEnd = new Date(now.getTime() + totalDuration / 3);
      const bidStart = new Date(now.getTime() + (totalDuration * 2) / 3);

      // Local datetime formatting to YYYY-MM-DDTHH:mm:ss
      const formatLocal = (d) => {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 19);
      };

      data.append('regStartTime', formatLocal(now));
      data.append('regEndTime', formatLocal(regEnd));
      data.append('bidStartTime', formatLocal(bidStart));
      
      let endTimeStr = formData.endTime;
      if (endTimeStr.length === 16) {
        endTimeStr += ':00';
      }
      data.append('bidEndTime', endTimeStr);
      data.append('sellerId', user?.id || 1);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      await API.post('/seller/auctions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Đăng bán sản phẩm thành công! Đang chờ duyệt.');
      // reset form
      setFormData({ title: '', description: '', startPrice: '', stepPrice: '', categoryId: '', endTime: '', image: null });
      setPreviewUrl(null);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Đăng bán tài sản mới</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="auction-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh sản phẩm</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-blue-500 transition-all group overflow-hidden">
                {previewUrl ? (
                  <div className="relative aspect-video w-full bg-gray-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold flex items-center gap-2"><FiUploadCloud /> Thay đổi ảnh</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                      <FiImage className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-700">Click để chọn ảnh hoặc kéo thả vào đây</p>
                    <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG (Max 5MB)</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên tài sản</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500" placeholder="VD: Đồng hồ Rolex Submariner..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Danh mục</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Hạn chót kết thúc</label>
                  <input type="datetime-local" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Giá khởi điểm (VNĐ)</label>
                  <input type="number" value={formData.startPrice} onChange={e => setFormData({...formData, startPrice: e.target.value})} required min="10000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Bước giá (VNĐ)</label>
                  <input type="number" value={formData.stepPrice} onChange={e => setFormData({...formData, stepPrice: e.target.value})} required min="1000" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả chi tiết</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows="4" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
          <button type="submit" form="auction-form" disabled={loading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">
            {loading ? 'Đang xử lý...' : 'Đăng bán ngay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionFormModal;
