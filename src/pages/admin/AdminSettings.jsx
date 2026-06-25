import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSettings, FiTruck, FiSave } from 'react-icons/fi';
import adminService from '../../services/adminService';

const AdminSettings = () => {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await adminService.getSystemConfigs();
      data.forEach(config => {
        if (config.configKey === 'DEFAULT_SHIPPING_FEE') {
          setValue('defaultShippingFee', config.configValue);
        }
        if (config.configKey === 'FREE_SHIPPING_THRESHOLD') {
          setValue('freeShippingThreshold', config.configValue);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const requestPayload = {
        configs: [
          {
            configKey: 'DEFAULT_SHIPPING_FEE',
            configValue: data.defaultShippingFee
          },
          {
            configKey: 'FREE_SHIPPING_THRESHOLD',
            configValue: data.freeShippingThreshold
          }
        ]
      };
      
      await adminService.updateSystemConfigs(requestPayload);
      toast.success('Cập nhật cấu hình thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi lưu cấu hình');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Đang tải cấu hình...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiSettings className="text-blue-600" /> Cấu Hình Hệ Thống
        </h2>
        <p className="text-slate-500 mt-1">Quản lý các thông số cốt lõi của toàn bộ hệ thống</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Shipping Config Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FiTruck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Cấu hình Vận chuyển (Shipping)</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phí giao hàng mặc định (VNĐ)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  {...register('defaultShippingFee', { required: true, min: 0 })}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold text-gray-800"
                  placeholder="30000"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-medium">VNĐ</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Mức phí giao hàng cơ bản áp dụng cho mọi đơn hàng.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn tối thiểu để Freeship (VNĐ)
              </label>
              <div className="relative">
                <input 
                  type="number"
                  {...register('freeShippingThreshold', { required: true, min: 0 })}
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold text-gray-800"
                  placeholder="5000000"
                />
                <span className="absolute right-4 top-3.5 text-gray-400 font-medium">VNĐ</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Nếu giá trị đơn hàng vượt mức này, người mua sẽ được miễn phí vận chuyển.</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSave className="w-5 h-5" />
            )}
            {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
