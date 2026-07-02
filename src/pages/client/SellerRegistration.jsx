import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiTrendingUp, FiCreditCard } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';

const SellerRegistration = () => {
  const navigate = useNavigate();
  const { user, refreshUser, setUser } = useAuth();
  const [agreed, setAgreed] = useState(false);

  // If user is already a SELLER or ADMIN, redirect them to manage auctions
  useEffect(() => {
    if (user && (user.role === 'SELLER' || user.role === 'ADMIN')) {
      navigate('/seller/my-auctions', { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      phone: user?.phone || '',
      address: user?.address || '',
      idCard: '', // Mock field for UI purposes
      storeName: '' // Mock field for UI purposes
    }
  });

  const onSubmit = async (data) => {
    if (!agreed) {
      toast.error('Vui lòng đồng ý với Điều khoản & Chính sách bán hàng.');
      return;
    }

    try {
      if (!user?.id) {
        toast.error('Không tìm thấy ID người dùng.');
        return;
      }
      
      // We only send phone and address as the backend DTO currently expects
      await API.post(`/users/${user.id}/register-seller`, {
        phone: data.phone,
        address: data.address
      });

      toast.success('Đăng ký thành công! Chào mừng bạn đến với hệ thống Người bán.');
      
      // Update local context immediately to prevent 403 when navigating
      if (setUser) {
        setUser(prev => ({ ...prev, role: 'SELLER' }));
      }
      await refreshUser();
      
      // Redirect to seller dashboard after a short delay
      setTimeout(() => {
        navigate('/seller/my-auctions');
      }, 1500);
      
    } catch (error) {
      console.error('Lỗi khi đăng ký bán hàng:', error);
      const msg = error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại!';
      if (typeof msg === 'object') {
         toast.error('Vui lòng kiểm tra lại thông tin hợp lệ.');
      } else {
         toast.error(msg);
      }
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Trở thành Đối tác Bán hàng
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Tiếp cận hàng ngàn khách hàng tiềm năng và bán tài sản của bạn với mức giá tốt nhất thông qua nền tảng đấu giá chuyên nghiệp của chúng tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="md:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Thông tin đăng ký
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                {/* Store Name (Mock for UI) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Tên cửa hàng / Thương hiệu (Tuỳ chọn)</label>
                  <input 
                    {...register('storeName')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    placeholder="VD: Cửa hàng Đồng hồ Tuấn Kiệt"
                  />
                  <p className="text-xs text-slate-400">Sẽ hiển thị công khai trên các phiên đấu giá của bạn.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Số điện thoại <span className="text-rose-500">*</span></label>
                    <input 
                      {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-sm focus:outline-none focus:bg-white transition-colors`}
                      placeholder="09xx xxx xxx"
                    />
                    {errors.phone && <span className="text-xs text-rose-500">{errors.phone.message}</span>}
                  </div>

                  {/* ID Card (Mock for UI) */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Số CCCD / CMND <span className="text-rose-500">*</span></label>
                    <input 
                      {...register('idCard', { required: 'Vui lòng nhập CCCD để xác minh định danh' })}
                      className={`w-full px-4 py-3 bg-slate-50 border ${errors.idCard ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-sm focus:outline-none focus:bg-white transition-colors`}
                      placeholder="Gồm 12 chữ số"
                    />
                    {errors.idCard && <span className="text-xs text-rose-500">{errors.idCard.message}</span>}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Địa chỉ liên hệ <span className="text-rose-500">*</span></label>
                  <textarea 
                    {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                    rows="3"
                    className={`w-full px-4 py-3 bg-slate-50 border ${errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-sm focus:outline-none focus:bg-white transition-colors`}
                    placeholder="Nhập địa chỉ đầy đủ để phục vụ giao nhận hàng hóa"
                  />
                  {errors.address && <span className="text-xs text-rose-500">{errors.address.message}</span>}
                </div>

                {/* Checkbox */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <FiCheckCircle className="absolute text-white w-3 h-3 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">
                      Tôi xác nhận các thông tin trên là chính xác và đồng ý với <a href="/terms" target="_blank" className="text-blue-600 font-semibold hover:underline">Chính sách bán hàng</a> và <a href="/terms" target="_blank" className="text-blue-600 font-semibold hover:underline">Quy chế đấu giá</a> của BidMax.
                    </span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || !agreed}
                  className={`w-full py-4 mt-6 font-bold rounded-xl transition-all text-base flex items-center justify-center gap-2 ${
                    isSubmitting || !agreed 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : 'Xác nhận Đăng ký Kênh Bán Hàng'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Benefits */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
              
              <h3 className="text-xl font-bold mb-6 relative z-10">Đặc quyền Người bán</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FiTrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Tối đa hoá lợi nhuận</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">Tiếp cận tập khách hàng sẵn sàng chi trả cao thông qua cơ chế đấu giá minh bạch.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FiShield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">An toàn tuyệt đối</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">Người mua phải đặt cọc trước khi tham gia, đảm bảo quyền lợi tuyệt đối cho người bán.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <FiCreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Thanh toán nhanh chóng</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">Nhận tiền ngay sau khi giao dịch hoàn tất thông qua hệ thống tích hợp VNPAY.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800">
              <strong>Lưu ý:</strong> Mọi hành vi đăng bán hàng giả, hàng cấm hoặc cố tình phá giá sẽ bị khoá tài khoản vĩnh viễn và xử lý theo quy định của pháp luật.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistration;
