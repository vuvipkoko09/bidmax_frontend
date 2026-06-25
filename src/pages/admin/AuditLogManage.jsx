import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiArchive } from 'react-icons/fi';
import Modal from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const AuditLogManage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const schema = yup.object().shape({
    action: yup.string().required('Hành động là bắt buộc'),
    details: yup.string().required('Chi tiết là bắt buộc'),
    userId: yup.number().transform((value) => (isNaN(value) ? undefined : value)).nullable().notRequired()
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { action: '', details: '', userId: '' }
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Không thể kết nối đến Backend để tải danh sách nhật ký hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const openCreateModal = () => {
    setEditingLog(null);
    reset({ action: '', details: '', userId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (log) => {
    setEditingLog(log);
    reset({ action: log.action || '', details: log.details || '', userId: log.userId || '' });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    const payload = {
      ...data,
      userId: data.userId ? parseInt(data.userId, 10) : null
    };

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      if (editingLog) {
        await adminService.updateAuditLog(editingLog.id, payload);
        setSuccess(`Đã cập nhật thành công nhật ký: ${payload.action}`);
      } else {
        await adminService.createAuditLog(payload);
        setSuccess(`Đã tạo thành công nhật ký hành động: ${payload.action}`);
      }
      setIsModalOpen(false);
      await fetchLogs();
    } catch (err) {
      console.error('Error saving audit log:', err);
      setError('Lỗi khi lưu ghi chép nhật ký hệ thống.');
      setLoading(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dòng nhật ký ID: ${id}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await adminService.deleteAuditLog(id);
      setSuccess(`Đã xóa thành công dòng nhật ký ID: ${id}`);
      await fetchLogs();
    } catch (err) {
      console.error('Error deleting audit log:', err);
      setError(`Lỗi khi thực hiện xóa dòng nhật ký ID: ${id}`);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Title block */}
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 m-0">
            <FiArchive className="text-blue-600" /> Nhật ký hệ thống (Audit Logs)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Ghi nhận các hoạt động truy cập, thao tác dữ liệu nhạy cảm trên hệ thống.</p>
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
      ) : logs.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có nhật ký nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Hành động (Action)</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Chi tiết</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID Người thực hiện</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Thời gian ghi nhận</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.userId}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">{log.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        onClick={() => openEditModal(log)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
                        onClick={() => handleDeleteLog(log.id)}
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
        title={editingLog ? 'Cập nhật Nhật ký' : 'Tạo Nhật ký mới'}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hành động (Action) <span className="text-red-500">*</span></label>
            <input 
              {...register('action')}
              placeholder="VD: LOGIN, DELETE_USER"
              className={`w-full px-4 py-2 border ${errors.action ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
            />
            {errors.action && <p className="text-red-500 text-xs italic mt-1">{errors.action.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chi tiết <span className="text-red-500">*</span></label>
            <textarea 
              {...register('details')}
              placeholder="Nhập chi tiết hành động"
              className={`w-full px-4 py-2 border ${errors.details ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
              rows={3}
            />
            {errors.details && <p className="text-red-500 text-xs italic mt-1">{errors.details.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Người thực hiện</label>
            <input 
              {...register('userId')}
              placeholder="VD: 1"
              type="number"
              className={`w-full px-4 py-2 border ${errors.userId ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
            />
            {errors.userId && <p className="text-red-500 text-xs italic mt-1">{errors.userId.message}</p>}
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

export default AuditLogManage;
