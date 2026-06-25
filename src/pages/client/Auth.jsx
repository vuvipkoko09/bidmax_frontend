import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiUser, FiInfo, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  // Define schema dynamically based on isLogin state
  const schema = yup.object().shape({
    username: yup.string().required('Tên tài khoản không được để trống'),
    password: yup.string()
      .required('Mật khẩu không được để trống')
      .min(6, 'Mật khẩu phải từ 6 ký tự'),
    ...( !isLogin && { 
      email: yup.string()
        .required('Email không được để trống')
        .email('Email không đúng định dạng') 
    }),
    roleName: yup.string(),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on change so we can disable the button dynamically
    defaultValues: {
      username: '',
      password: '',
      email: '',
      roleName: 'USER',
    }
  });

  const hasErrors = Object.keys(errors).length > 0;
  const isSubmitDisabled = isSubmitting || hasErrors;

  const onSubmitForm = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        // Backend POST to /auth/login
        const response = await API.post('/auth/login', {
          username: data.username.trim(),
          password: data.password,
        });

        const token = response.data?.token;
        if (!token) {
          throw new Error('Token không tìm thấy trong phản hồi từ server.');
        }

        // Context login saves token and fetches detailed user profile
        const loggedUser = await login({ username: data.username.trim() }, token);
        
        // Navigate based on resolved role
        if (loggedUser && loggedUser.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Backend POST to /auth/register
        await API.post('/auth/register', {
          username: data.username.trim(),
          password: data.password,
          email: data.email.trim(),
          roleName: data.roleName,
        });

        setSuccessMsg('Đăng ký tài khoản thành công! Vui lòng chuyển sang tab Đăng nhập.');
        setIsLogin(true);
        // Clean email field
        setValue('email', '');
      }
    } catch (err) {
      console.error('Auth error:', err);
      // Handle array of errors or map of errors if validation fails from backend
      if (err.response?.data?.message && typeof err.response.data.message === 'object') {
        const errorObject = err.response.data.message;
        const firstErrorKey = Object.keys(errorObject)[0];
        setErrorMsg(`Lỗi từ server: ${errorObject[firstErrorKey]}`);
      } else {
        const errMsg = err.response?.data?.message || err.response?.data?.error || 'Đã xảy ra lỗi trong quá trình xác thực. Vui lòng kiểm tra kết nối.';
        setErrorMsg(errMsg);
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="bg-white w-full max-w-md border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6 text-left">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20 mx-auto">
            🔨
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 m-0 mt-3">Chào mừng bạn đến với BidMax</h2>
          <p className="text-xs text-gray-400">Tham gia sàn đấu giá tài sản trực tuyến uy tín số 1</p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200">
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all cursor-pointer ${
              isLogin ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Đăng nhập
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all cursor-pointer ${
              !isLogin ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Success notification */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <FiCheckCircle className="shrink-0 w-4 h-4 text-emerald-600" /> {successMsg}
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <FiInfo className="shrink-0 w-4 h-4 text-rose-600" /> {errorMsg}
          </div>
        )}

        {/* Auth Forms */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Tên tài khoản</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nhấn để nhập" 
                {...register('username')}
                className={`w-full pl-10 pr-4 py-2.5 border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500`}
              />
              <FiUser className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email - Sign Up Only */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Địa chỉ Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500`}
                />
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-600">Mật khẩu</label>
              {isLogin && (
                <a href="#" className="text-[11px] font-bold text-blue-600 hover:text-blue-700">Quên mật khẩu?</a>
              )}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                {...register('password')}
                className={`w-full pl-10 pr-10 py-2.5 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:outline-none focus:border-blue-500`}
              />
              <FiLock className="absolute left-3.5 top-3.5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Role Dropdown - Sign Up Only */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600">Loại tài khoản (Vai trò)</label>
              <select
                {...register('roleName')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="USER">Người dùng (Tham gia đấu giá)</option>
                <option value="SELLER">Seller (Người bán hàng)</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitDisabled}
            className={`w-full py-3 font-extrabold rounded-xl transition-all shadow-md text-center text-sm uppercase tracking-wide cursor-pointer 
              ${isSubmitDisabled 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'}`}
          >
            {isSubmitting ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Auth;
