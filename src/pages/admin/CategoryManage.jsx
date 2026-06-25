import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiFolder, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '../../components/common/Modal';
const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required('Tên danh mục là bắt buộc').min(2, 'Tên quá ngắn').max(100, 'Tên quá dài'),
    code: yup.string().required('Mã danh mục là bắt buộc'),
    description: yup.string().max(500, 'Mô tả quá dài')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', description: '' }
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error('Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateForm = () => {
    reset({ name: '', code: '', description: '' });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (cat) => {
    reset({ name: cat.name, code: cat.code || '', description: cat.description || '' });
    setEditingId(cat.id);
    setIsFormOpen(true);
  };

  const onSubmitForm = async (data) => {
    try {
      if (editingId) {
        // Assume adminService.updateCategory exists, or fallback
        toast.error("Chức năng cập nhật đang được phát triển, tạm thời thử tạo mới.");
        // await adminService.updateCategory(editingId, data);
        // toast.success(`Đã cập nhật: ${data.name}`);
      } else {
        await adminService.createCategory(data);
        toast.success(`Đã tạo danh mục: ${data.name}`);
      }
      setIsFormOpen(false);
      await fetchCategories();
    } catch (err) {
      toast.error('Lỗi khi lưu danh mục.');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) return;

    try {
      setLoading(true);
      await adminService.deleteCategory(id);
      toast.success(`Đã xóa danh mục: ${name}`);
      await fetchCategories();
    } catch (err) {
      toast.error(`Lỗi khi xóa danh mục ID: ${id}`);
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
            <FiFolder className="text-blue-600" /> Quản lý Danh mục (Categories)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý danh mục hàng hóa đấu giá trực tuyến trên hệ thống.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0 cursor-pointer" 
          onClick={openCreateForm}
        >
          <FiPlus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-red-500">*</span></label>
            <input 
              {...register('name')}
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              placeholder="VD: Đồ cổ"
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã danh mục <span className="text-red-500">*</span></label>
            <input 
              {...register('code')}
              className={`w-full px-4 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              placeholder="VD: antiques"
            />
            {errors.code && <p className="text-red-500 text-xs italic mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea 
              {...register('description')}
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              placeholder="Mô tả danh mục..."
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có danh mục nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tên danh mục</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Mã danh mục</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Mô tả</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600"><code>{cat.code}</code></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{cat.description}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => openEditForm(cat)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
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

export default CategoryManage;
