import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiPlus, FiTrash2, FiEdit2, FiMapPin, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const LocationManage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const schema = yup.object().shape({
    cityName: yup.string().required('Tên thành phố là bắt buộc').min(2, 'Tên quá ngắn').max(100, 'Tên quá dài'),
    address: yup.string().required('Địa chỉ là bắt buộc').min(5, 'Địa chỉ quá ngắn').max(255, 'Địa chỉ quá dài')
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { cityName: '', address: '' }
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllLocations();
      setLocations(data || []);
    } catch (err) {
      toast.error('Không thể kết nối đến Backend để tải danh sách địa điểm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const openCreateForm = () => {
    reset({ cityName: '', address: '' });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (loc) => {
    reset({ cityName: loc.cityName || loc.name, address: loc.address || loc.code || '' });
    setEditingId(loc.id);
    setIsFormOpen(true);
  };

  const onSubmitForm = async (data) => {
    try {
      if (editingId) {
        toast.error("Chức năng cập nhật đang được phát triển, tạm thời thử tạo mới.");
        // await adminService.updateLocation(editingId, data);
        // toast.success(`Đã cập nhật: ${data.cityName}`);
      } else {
        await adminService.createLocation(data);
        toast.success(`Đã tạo địa điểm: ${data.cityName}`);
      }
      setIsFormOpen(false);
      await fetchLocations();
    } catch (err) {
      toast.error('Lỗi khi lưu địa điểm trên hệ thống.');
    }
  };

  const handleDeleteLocation = async (id, cityName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa địa điểm "${cityName}"?`)) return;

    try {
      setLoading(true);
      await adminService.deleteLocation(id);
      toast.success(`Đã xóa thành công địa điểm: ${cityName}`);
      await fetchLocations();
    } catch (err) {
      toast.error(`Lỗi khi thực hiện xóa địa điểm ID: ${id}`);
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
            <FiMapPin className="text-blue-600" /> Quản lý Địa điểm (Locations)
          </h2>
          <p className="text-xs text-gray-500 mt-1">Đăng ký, lưu trữ thông tin địa điểm phục vụ cho công tác bàn giao và phân phối.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors duration-150 shadow-sm shrink-0 cursor-pointer" 
          onClick={openCreateForm}
        >
          <FiPlus className="w-4 h-4" /> Thêm địa điểm
        </button>
      </div>

      {isFormOpen && (
        <div className="p-6 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-bold text-gray-800">{editingId ? 'Cập nhật địa điểm' : 'Thêm địa điểm mới'}</h3>
            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><FiX /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tên thành phố <span className="text-red-500">*</span></label>
              <input 
                {...register('cityName')}
                className={`w-full px-3 py-2 border ${errors.cityName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="VD: Hà Nội"
              />
              {errors.cityName && <p className="text-red-500 text-xs italic mt-1">{errors.cityName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
              <input 
                {...register('address')}
                className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="VD: Số 1 Đại Cồ Việt"
              />
              {errors.address && <p className="text-red-500 text-xs italic mt-1">{errors.address.message}</p>}
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm disabled:bg-blue-400 cursor-pointer"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu địa điểm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading state or Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Đang tải dữ liệu...</div>
      ) : locations.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-500 font-medium">Chưa có địa điểm nào trên hệ thống.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Thành phố</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Địa chỉ chi tiết</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{loc.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{loc.cityName || loc.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loc.address || loc.code}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => openEditForm(loc)}
                        title="Sửa"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer" 
                        onClick={() => handleDeleteLocation(loc.id, loc.cityName || loc.name)}
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

export default LocationManage;
