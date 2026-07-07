import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiImage } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const AuctionImageManage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ auctionId: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllAuctionImages();
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching auction images:', err);
      setError('Không thể kết nối đến Backend để tải danh sách ảnh đấu giá.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleCreateImage = () => {
    setFormData({ auctionId: '' });
    setSelectedFile(null);
    setIsCreateModalOpen(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const auctionId = parseInt(formData.auctionId) || 0;
    
    if (!selectedFile) {
      setError('Vui lòng chọn một ảnh để tải lên.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsCreateModalOpen(false);
      
      // 1. Gọi API Upload File lên Cloudinary
      setSuccess(`Đang tải ảnh lên Cloudinary...`);
      const uploadResult = await adminService.uploadFile(selectedFile);
      const imageUrl = uploadResult.imageUrl;

      // 2. Lưu đường dẫn ảnh vào Database
      setSuccess(`Đang lưu thông tin ảnh vào Database...`);
      const newImage = { auctionId, imageUrl, isPrimary: false };
      await adminService.createAuctionImage(newImage);
      
      setSuccess(`Đã thêm thành công ảnh cho phiên đấu giá ID: ${auctionId}`);
      await fetchImages();
    } catch (err) {
      console.error('Error uploading/creating auction image:', err);
      setError('Lỗi khi tải hình ảnh lên hoặc lưu vào CSDL.');
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ảnh đấu giá ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteAuctionImage(id);
      setSuccess(`Đã xóa thành công hình ảnh ID: ${id}`);
      await fetchImages();
    } catch (err) {
      console.error('Error deleting auction image:', err);
      setError(`Lỗi khi thực hiện xóa hình ảnh ID: ${id}`);
      setLoading(false);
    }
  };

  const handleEditMock = (img) => {
    setEditingItem(img);
    setSelectedFile(null);
    setIsEditModalOpen(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh mới để thay thế.');
      setIsEditModalOpen(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setIsEditModalOpen(false);
      
      setSuccess(`Đang tải ảnh cập nhật lên Cloudinary...`);
      const uploadResult = await adminService.uploadFile(selectedFile);
      const imageUrl = uploadResult.imageUrl;

      setSuccess(`Đang cập nhật thông tin ảnh trong Database...`);
      await adminService.updateAuctionImage(editingItem.id, { ...editingItem, imageUrl });
      
      setSuccess(`Đã cập nhật thành công ảnh ID: ${editingItem.id}`);
      await fetchImages();
    } catch (err) {
      console.error('Error updating auction image:', err);
      setError('Lỗi khi cập nhật hình ảnh.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiImage className="text-blue-600" /> Quản lý Ảnh đấu giá (Auction Images)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Đính kèm các liên kết hình ảnh trực quan cho từng sản phẩm đấu giá.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={handleCreateImage}
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
      ) : images.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có ảnh đấu giá nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Phiên đấu giá</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Ảnh Preview</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Đường dẫn ảnh</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {images.map((img) => (
                <tr key={img.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{img.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{img.auctionId}</td>
                  <td className="px-6 py-4 text-sm">
                    {img.imageUrl && (
                      <img src={img.imageUrl} alt="preview" className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono break-all">{img.imageUrl}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => handleEditMock(img)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteImage(img.id)}
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
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Thêm mới ảnh đấu giá">
        <form onSubmit={submitCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Phiên đấu giá (Auction ID)</label>
            <input type="number" name="auctionId" value={formData.auctionId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" required placeholder="Nhập ID phiên đấu giá..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Chọn Ảnh</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none" required />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors">Hủy</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-sm shadow-blue-600/20">Tải lên</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Cập nhật ảnh #${editingItem?.id}`}>
        <form onSubmit={submitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh hiện tại</label>
            {editingItem?.imageUrl && <img src={editingItem.imageUrl} alt="current" className="w-24 h-24 object-cover rounded-lg border border-gray-200 mb-3" />}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Chọn ảnh mới thay thế</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none" required />
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

export default AuctionImageManage;
