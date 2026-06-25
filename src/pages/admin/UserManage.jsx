import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiUsers } from 'react-icons/fi';
import Modal from '../../components/admin/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const schema = yup.object().shape({
    username: yup.string().required('Tên người dùng không được bỏ trống'),
    email: yup.string().email('Email không đúng định dạng').required('Email không được bỏ trống'),
    phone: yup.string().nullable().matches(/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/, { message: 'Số điện thoại không hợp lệ', excludeEmptyString: true }),
    address: yup.string().nullable(),
    roleId: yup.number().typeError('Vui lòng chọn vai trò').required('Vai trò không được bỏ trống'),
    status: yup.string().required('Trạng thái không được bỏ trống')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      address: '',
      roleId: 2, // default USER role id or similar
      status: 'ACTIVE'
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllRoles().catch(() => []) // fallback if no roles api
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      toast.error('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    reset({
      username: '',
      email: '',
      phone: '',
      address: '',
      roleId: roles.length > 0 ? roles[0].id : 2,
      status: 'ACTIVE'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    reset({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      roleId: user.role?.id || user.roleId || (roles.length > 0 ? roles[0].id : 2),
      status: user.status || 'ACTIVE'
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await adminService.updateUser(editingId, data);
        toast.success(`Đã cập nhật người dùng: ${data.username}`);
      } else {
        await adminService.createUser({ ...data, password: 'password123' }); // temporary default password for create
        toast.success(`Đã tạo thành công người dùng: ${data.username}`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi lưu dữ liệu.');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}"?`)) return;

    try {
      setLoading(true);
      await adminService.deleteUser(id);
      toast.success(`Đã xóa thành công người dùng: ${name}`);
      fetchData();
    } catch (err) {
      toast.error(`Lỗi khi thực hiện xóa người dùng ID: ${id}`);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setLoading(true);
      await adminService.updateUserStatus(id, newStatus);
      toast.success(`Cập nhật trạng thái thành công.`);
      fetchData();
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái.');
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOCKED': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'BANNED': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <Toaster position="top-right" />

      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiUsers className="text-blue-600" /> Quản lý Người dùng (Users)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Quản lý thông tin tài khoản và phân quyền người dùng tham gia đấu giá.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0 cursor-pointer"
          onClick={handleOpenCreate}
        >
          <FiPlus className="w-4 h-4" /> Thêm người dùng
        </button>
      </div>

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có người dùng nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tên người dùng</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{user.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.status || 'ACTIVE'}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${getStatusStyle(user.status)}`}
                    >
                      <option value="ACTIVE" className="bg-white text-emerald-800 font-semibold">ACTIVE</option>
                      <option value="PENDING" className="bg-white text-amber-800 font-semibold">PENDING</option>
                      <option value="LOCKED" className="bg-white text-slate-800 font-semibold">LOCKED</option>
                      <option value="BANNED" className="bg-white text-rose-800 font-semibold">BANNED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        onClick={() => handleOpenEdit(user)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        onClick={() => handleDeleteUser(user.id, user.username)}
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

      {/* Reusable Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}
        onCancel={() => setIsModalOpen(false)}
        formId="user-form"
        isSubmitting={isSubmitting}
      >
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
              <input
                {...register('username')}
                disabled={!!editingId}
                className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500`}
                placeholder="VD: admin123"
              />
              {errors.username && <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="VD: admin@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
              <input
                {...register('phone')}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="VD: 0987654321"
              />
              {errors.phone && <p className="text-red-500 text-xs italic mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label>
              <select
                {...register('roleId')}
                className={`w-full px-3 py-2 border ${errors.roleId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer`}
              >
                {roles.length === 0 ? (
                  <option value="2">USER (Mặc định)</option>
                ) : (
                  roles.map(r => (
                    <option key={r.id} value={r.id}>{r.roleName}</option>
                  ))
                )}
              </select>
              {errors.roleId && <p className="text-red-500 text-xs italic mt-1">{errors.roleId.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ</label>
            <input
              {...register('address')}
              className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="VD: Hà Nội"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
            <select
              {...register('status')}
              className={`w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer`}
            >
              <option value="ACTIVE">ACTIVE - Hoạt động</option>
              <option value="PENDING">PENDING - Chờ duyệt</option>
              <option value="LOCKED">LOCKED - Tạm khóa</option>
              <option value="BANNED">BANNED - Cấm vĩnh viễn</option>
            </select>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default UserManage;
