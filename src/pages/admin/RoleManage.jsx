import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiShield } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const RoleManage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const schema = yup.object().shape({
    name: yup.string().required('Tên vai trò là bắt buộc'),
    code: yup.string().required('Mã vai trò là bắt buộc'),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '' }
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllRoles();
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Không thể kết nối đến Backend để tải danh sách vai trò.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    reset({ name: '', code: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    reset({ name: role.roleName || role.name || '', code: role.code || '' });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (editingRole) {
        await adminService.updateRole(editingRole.id, data);
        setSuccess(`Đã cập nhật thành công vai trò: ${data.name}`);
      } else {
        await adminService.createRole(data);
        setSuccess(`Đã tạo thành công vai trò: ${data.name}`);
      }
      setIsModalOpen(false);
      await fetchRoles();
    } catch (err) {
      console.error('Error saving role:', err);
      setError('Lỗi khi lưu vai trò trên hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${name}"?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteRole(id);
      setSuccess(`Đã xóa thành công vai trò: ${name}`);
      await fetchRoles();
    } catch (err) {
      console.error('Error deleting role:', err);
      setError(`Lỗi khi thực hiện xóa vai trò ID: ${id}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiShield className="text-blue-600" /> Quản lý Vai trò (Roles)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Phân quyền hệ thống, quản lý danh sách vai trò cho người dùng.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0" 
          onClick={openCreateModal}
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
      ) : roles.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có vai trò nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tên vai trò</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Mã vai trò (Code)</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{role.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{role.roleName || role.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600"><code>{role.code}</code></td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => openEditModal(role)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteRole(role.id, role.roleName || role.name)}
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

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Cập nhật Vai trò' : 'Thêm Vai trò mới'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò <span className="text-red-500">*</span></label>
            <input 
              {...register('name')}
              placeholder="VD: Quản trị viên"
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã vai trò <span className="text-red-500">*</span></label>
            <input 
              {...register('code')}
              placeholder="VD: ROLE_ADMIN"
              className={`w-full px-4 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
            />
            {errors.code && <p className="text-red-500 text-xs italic mt-1">{errors.code.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
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

    </div>
  );
};

export default RoleManage;

