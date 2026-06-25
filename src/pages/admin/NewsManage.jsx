import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiBookOpen, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const NewsManage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const schema = yup.object().shape({
    title: yup.string().required('Tiêu đề là bắt buộc').min(5, 'Tiêu đề quá ngắn').max(255, 'Tiêu đề quá dài'),
    content: yup.string().required('Nội dung là bắt buộc'),
    authorId: yup.number().typeError('Vui lòng nhập ID tác giả hợp lệ').required('ID tác giả là bắt buộc')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', content: '', authorId: 1 }
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllNews();
      setNews(data || []);
    } catch (err) {
      toast.error('Không thể kết nối đến Backend để tải danh sách tin tức.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateForm = () => {
    reset({ title: '', content: '', authorId: 1 });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item) => {
    reset({ title: item.title, content: item.content, authorId: item.authorId || 1 });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const onSubmitForm = async (data) => {
    try {
      if (editingId) {
        toast.error("Chức năng cập nhật đang được phát triển, tạm thời thử tạo mới.");
        // await adminService.updateNews(editingId, data);
      } else {
        await adminService.createNews(data);
        toast.success(`Đã tạo tin tức: ${data.title}`);
      }
      setIsFormOpen(false);
      await fetchNews();
    } catch (err) {
      toast.error('Lỗi khi lưu bài viết tin tức.');
    }
  };

  const handleDeleteNews = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tin tức "${title}"?`)) return;

    try {
      setLoading(true);
      await adminService.deleteNews(id);
      toast.success(`Đã xóa thành công bài viết ID: ${id}`);
      await fetchNews();
    } catch (err) {
      toast.error(`Lỗi khi thực hiện xóa bài viết ID: ${id}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <Toaster position="top-right" />
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiBookOpen className="text-blue-600" /> Quản lý Tin tức (News)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Đăng tải, cập nhật các bài viết tin tức, cẩm nang và hướng dẫn sử dụng dịch vụ đấu giá.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0 cursor-pointer" 
          onClick={openCreateForm}
        >
          <FiPlus className="w-4 h-4" /> Viết bài mới
        </button>
      </div>

      {isFormOpen && (
        <div className="p-6 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-bold text-gray-800">{editingId ? 'Cập nhật bài viết' : 'Viết bài mới'}</h3>
            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><FiX /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
              <input 
                {...register('title')}
                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Nhập tiêu đề bài viết..."
              />
              {errors.title && <p className="text-red-500 text-xs italic mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
              <textarea 
                {...register('content')}
                rows="5"
                className={`w-full px-3 py-2 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Nhập nội dung..."
              />
              {errors.content && <p className="text-red-500 text-xs italic mt-1">{errors.content.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ID Tác giả <span className="text-red-500">*</span></label>
              <input 
                type="number"
                {...register('authorId')}
                className={`w-full px-3 py-2 border ${errors.authorId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="ID User của tác giả"
              />
              {errors.authorId && <p className="text-red-500 text-xs italic mt-1">{errors.authorId.message}</p>}
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm disabled:bg-blue-400 cursor-pointer"
              >
                {isSubmitting ? 'Đang lưu...' : 'Xuất bản bài viết'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : news.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có bài viết nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tiêu đề</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tác giả</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Nội dung tóm tắt</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.author || item.authorId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.content && item.content.substring(0, 50)}...</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => openEditForm(item)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => handleDeleteNews(item.id, item.title)}
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

export default NewsManage;
