import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import API from '../../services/api';
import { FiMail, FiKey, FiLock, FiArrowLeft } from 'react-icons/fi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      await API.post('/auth/reset-password', {
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword
      });
      toast.success('Đổi mật khẩu thành công! Đang chuyển hướng...');
      setTimeout(() => {
        navigate('/auth');
      }, 1500);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">Tạo mật khẩu mới</h2>
          <p className="mt-3 text-sm text-slate-500">
            Vui lòng nhập mã OTP đã nhận qua email và mật khẩu mới của bạn.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email của bạn</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                {...register('email', { required: 'Vui lòng nhập email của bạn' })}
                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-rose-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>}
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Mã OTP (6 số)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiKey className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                {...register('otp', { required: 'Vui lòng nhập mã OTP' })}
                className={`block w-full pl-10 pr-3 py-3 border ${errors.otp ? 'border-rose-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm`}
                placeholder="Ví dụ: 123456"
              />
            </div>
            {errors.otp && <p className="mt-1 text-sm text-rose-500">{errors.otp.message}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Mật khẩu mới</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                {...register('newPassword', { 
                  required: 'Vui lòng nhập mật khẩu mới',
                  minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                })}
                className={`block w-full pl-10 pr-3 py-3 border ${errors.newPassword ? 'border-rose-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-rose-500">{errors.newPassword.message}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: value => value === newPassword || 'Mật khẩu không khớp'
                })}
                className={`block w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-rose-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Đổi mật khẩu'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <Link to="/auth" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
            <FiArrowLeft className="mr-1" />
            Trở lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
