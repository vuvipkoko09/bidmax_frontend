import React, { useState, useEffect } from 'react';
import { FiUser, FiActivity, FiHeart, FiFileText, FiDollarSign, FiEdit2, FiSave, FiX, FiAward } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const [isEditing, setIsEditing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [bidsHistory, setBidsHistory] = useState([]);
  const [isPaying, setIsPaying] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);
  
  const { user, refreshUser, setUser } = useAuth();

  useEffect(() => {
    if (user?.id) {
      const fetchUserData = async () => {
        try {
          const [wonRes, watchRes, bidRes] = await Promise.all([
            API.get('/client/my-won-auctions', { params: { userId: user.id } }),
            API.get(`/watchlists/user/${user.id}`),
            API.get(`/bids/user/${user.id}`)
          ]);
          setWonAuctions(wonRes.data);
          setWatchlist(watchRes.data);
          setBidsHistory(bidRes.data);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu user:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handlePayAuction = async (auctionId) => {
    try {
      setIsPaying(true);
      await API.post(`/client/pay-auction/${auctionId}?userId=${user.id}`);
      toast.success("Thanh toán thành công!");
      setWonAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, status: 'PAID' } : a));
      await refreshUser();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Thanh toán thất bại";
      toast.error((t) => (
        <div className="flex flex-col gap-2">
          <span>{msg}</span>
          {msg.includes("Số dư không đủ") && (
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setShowDepositModal(true);
              }}
              className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-700 w-full"
            >
              Đi tới Nạp tiền
            </button>
          )}
        </div>
      ));
    } finally {
      setIsPaying(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setIsDepositing(true);
      const response = await API.get('/payment/create-url', {
        params: {
          amount: depositAmount,
          username: user.username
        }
      });
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL nạp tiền:", error);
      toast.error("Không thể kết nối đến cổng thanh toán VNPAY.");
    } finally {
      setIsDepositing(false);
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      fullName: user?.username || '',
      phone: user?.phone || '',
      address: user?.address || '',
      cccd: user?.cccd || ''
    }
  });

  // Re-sync form default values when user changes
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.username || '',
        phone: user.phone || '',
        address: user.address || '',
        cccd: user.cccd || ''
      });
    }
  }, [user, reset]);

  // Removed Mocks

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const onSubmit = async (data) => {
    try {
      if (!user?.id) {
        toast.error("Không tìm thấy ID người dùng.");
        return;
      }
      
      // Call backend API
      await API.put(`/users/${user.id}/profile`, {
        phone: data.phone,
        address: data.address,
        cccd: data.cccd
      });

      toast.success("Cập nhật thông tin thành công!");
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      const msg = error.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại!";
      if (typeof msg === 'object') {
         toast.error("Vui lòng kiểm tra lại thông tin hợp lệ.");
      } else {
         toast.error(msg);
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (pwdData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      setIsSubmittingPwd(true);
      await API.put(`/users/${user.id}/password`, {
        oldPassword: pwdData.oldPassword,
        newPassword: pwdData.newPassword
      });
      toast.success("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPwdData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      const msg = error.response?.data?.message || "Đổi mật khẩu thất bại!";
      toast.error(msg);
    } finally {
      setIsSubmittingPwd(false);
    }
  };



  if (!user) {
    return <div className="text-center py-20">Đang tải thông tin...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left relative">
      <Toaster position="top-right" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: User Profile Info Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
            {!isEditing && !isChangingPassword && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 rounded-full cursor-pointer"
                title="Chỉnh sửa hồ sơ"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center text-blue-700 text-3xl font-bold shadow-inner uppercase">
                {user.username?.substring(0, 2) || 'US'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 mb-0">{user.username}</h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'SELLER' ? 'Người bán hàng' : 'Người dùng'}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-6">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Tên hiển thị</label>
                    <input 
                      {...register('fullName')}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
                    />
                    <p className="text-[10px] text-gray-400">Tên hiển thị hiện không thể thay đổi</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                      className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-blue-500`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Địa chỉ <span className="text-red-500">*</span></label>
                    <textarea 
                      {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                      rows="2"
                      className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-blue-500`}
                      placeholder="Nhập địa chỉ của bạn"
                    />
                    {errors.address && <span className="text-[10px] text-red-500">{errors.address.message}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Căn cước công dân (CCCD) <span className="text-red-500">*</span></label>
                    <input 
                      {...register('cccd', { 
                        required: 'CCCD là bắt buộc',
                        pattern: {
                          value: /^\d{12}$/,
                          message: 'CCCD phải bao gồm đúng 12 chữ số'
                        }
                      })}
                      className={`w-full px-3 py-2 border ${errors.cccd ? 'border-red-500' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:border-blue-500`}
                      placeholder="Nhập 12 số CCCD"
                    />
                    {errors.cccd && <span className="text-[10px] text-red-500">{errors.cccd.message}</span>}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => { reset(); setIsEditing(false); }}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex justify-center items-center gap-1"
                    >
                      <FiX /> Hủy
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shadow-blue-500/20 cursor-pointer flex justify-center items-center gap-1 disabled:bg-blue-400"
                    >
                      <FiSave /> {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </form>
              ) : isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Mật khẩu cũ <span className="text-red-500">*</span></label>
                    <input 
                      type="password"
                      value={pwdData.oldPassword}
                      onChange={e => setPwdData({...pwdData, oldPassword: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Nhập mật khẩu cũ"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Mật khẩu mới <span className="text-red-500">*</span></label>
                    <input 
                      type="password"
                      value={pwdData.newPassword}
                      onChange={e => setPwdData({...pwdData, newPassword: e.target.value})}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Mật khẩu ít nhất 6 ký tự"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                    <input 
                      type="password"
                      value={pwdData.confirmPassword}
                      onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                      placeholder="Xác nhận lại mật khẩu mới"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex justify-center items-center gap-1"
                    >
                      <FiX /> Hủy
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmittingPwd}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shadow-blue-500/20 cursor-pointer flex justify-center items-center gap-1 disabled:bg-blue-400"
                    >
                      <FiSave /> {isSubmittingPwd ? 'Đang lưu...' : 'Đổi MK'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-800">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Số CCCD:</span>
                    <span className={`font-semibold ${user.cccd ? 'text-gray-800' : 'text-rose-500 italic'}`}>
                      {user.cccd || 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Số điện thoại:</span>
                    <span className={`font-semibold ${user.phone ? 'text-gray-800' : 'text-rose-500 italic'}`}>
                      {user.phone || 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Địa chỉ:</span>
                    <span className={`font-semibold ${user.address ? 'text-gray-800 text-right w-48' : 'text-rose-500 italic'}`}>
                      {user.address || 'Chưa cập nhật'}
                    </span>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-center">
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 underline transition-colors cursor-pointer"
                    >
                      Đổi mật khẩu bảo mật
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex justify-between items-center mt-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Số dư khả dụng</span>
                <p className="text-lg font-extrabold text-blue-700 m-0 mt-0.5">{formatCurrency(user.balance || 0)}</p>
              </div>
              <button 
                onClick={() => setShowDepositModal(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shadow-blue-500/10 cursor-pointer"
              >
                Nạp tiền
              </button>
            </div>
            
            {user.role === 'USER' && (
              <div className="mt-4">
                <Link 
                  to="/register-seller"
                  className="w-full flex items-center justify-center py-2.5 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Đăng ký Bán hàng
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nạp tiền vào ví</h3>
              <p className="text-sm text-gray-500 mb-4">Nhập số tiền bạn muốn nạp qua cổng VNPAY.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Số tiền (VNĐ)</label>
                  <input 
                    type="number" 
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="VD: 50000"
                  />
                </div>
                <button 
                  onClick={handleDeposit}
                  disabled={isDepositing || !depositAmount || parseInt(depositAmount) < 10000}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors shadow-sm"
                >
                  {isDepositing ? 'Đang xử lý...' : 'Xác nhận nạp'}
                </button>
                {depositAmount && parseInt(depositAmount) < 10000 && (
                  <p className="text-xs text-rose-500 text-center">Số tiền nạp tối thiểu là 10.000 VNĐ</p>
                )}
              </div>
            </div>
          </div>
        )}



        {/* Right Column: Bidding Details Tabs & Tables (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          
          {/* Tab Navigation header */}
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 flex shrink-0">
            <button 
              onClick={() => setActiveTab('watchlist')}
              className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'watchlist' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiHeart className="w-4 h-4" /> Watchlist ({watchlist.length})
            </button>
            <button 
              onClick={() => setActiveTab('bids')}
              className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bids' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiActivity className="w-4 h-4" /> Lịch sử đặt giá ({bidsHistory.length})
            </button>
            <button 
              onClick={() => setActiveTab('won-auctions')}
              className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'won-auctions' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiAward className="w-4 h-4" /> Tài sản trúng ({wonAuctions.length})
            </button>
          </div>

          {/* Table contents */}
          <div className="flex-grow p-6">
            {activeTab === 'won-auctions' ? (
              wonAuctions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FiAward className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">Bạn chưa trúng phiên đấu giá nào.</p>
                  <p className="text-sm text-gray-400 mt-1">Hãy tích cực săn hàng nhé!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wonAuctions.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
                      <div className="h-40 bg-gray-100 relative">
                        <img 
                          src={item.thumbnail || 'https://placehold.co/400x300'} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                            item.status === 'SOLD' ? 'bg-yellow-400 text-yellow-900' :
                            item.status === 'PAID' ? 'bg-green-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {item.status === 'SOLD' ? 'Chờ thanh toán' : 
                             item.status === 'PAID' ? 'Đã thanh toán' : item.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{item.title}</h4>
                        <div className="mt-auto">
                          <p className="text-xs text-gray-500 mb-1">Giá trúng thầu:</p>
                          <p className="text-rose-600 font-bold text-lg">{formatCurrency(item.currentPrice || item.startPrice)}</p>
                        </div>
                      </div>
                      {item.status === 'SOLD' && (
                        <div className="px-4 pb-4">
                          <button 
                            onClick={() => handlePayAuction(item.id)}
                            disabled={isPaying}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-sm rounded-lg transition-all shadow-sm shadow-blue-500/30 cursor-pointer"
                          >
                            {isPaying ? 'Đang xử lý...' : 'Thanh toán ngay'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : activeTab === 'watchlist' ? (
              watchlist.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">Danh sách theo dõi trống.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Mã phiên</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Tên sản phẩm</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Giá hiện tại</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {watchlist.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 text-sm text-gray-400 font-mono">#{item.auctionId}</td>
                          <td className="py-4 text-sm font-bold text-gray-900">{item.auctionTitle}</td>
                          <td className="py-4 text-sm font-semibold text-blue-600">{formatCurrency(item.currentPrice)}</td>
                          <td className="py-4 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm">
                            <Link to={`/auction/${item.auctionId}`} className="text-blue-600 hover:underline font-bold text-xs">Xem chi tiết</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              bidsHistory.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-12">Bạn chưa tham gia đấu giá sản phẩm nào.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">ID</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Giá tôi đặt</th>
                        <th className="pb-3.5 text-xs font-bold uppercase tracking-wider">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bidsHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 text-sm text-gray-400 font-mono">#{item.id}</td>
                          <td className="py-4 text-sm font-semibold text-gray-600">{formatCurrency(item.bidAmount)}</td>
                          <td className="py-4 text-xs text-gray-500">{new Date(item.bidTime).toLocaleString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
