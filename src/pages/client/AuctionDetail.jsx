import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiHeart, FiDollarSign, FiShield, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import CompleteProfileModal from '../../components/client/CompleteProfileModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import API, { API_BASE_URL } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bidsCount, setBidsCount] = useState(0);
  
  const [watchlistActive, setWatchlistActive] = useState(false);
  const [watchlistId, setWatchlistId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPriceBlinking, setIsPriceBlinking] = useState(false);
  const [highestBidder, setHighestBidder] = useState("");
  const [bidHistory, setBidHistory] = useState([]);
  const stompClientRef = useRef(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const bidStep = auction?.stepPrice || 5000000;
  
  const schema = yup.object().shape({
    bidAmount: yup.number()
      .typeError('Vui lòng nhập số tiền hợp lệ')
      .required('Số tiền là bắt buộc')
      .min(currentPrice + bidStep, `Giá đặt tối thiểu: ${formatCurrency(currentPrice + bidStep)}`)
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  // Fetch auction data and watchlist status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/auctions/${id}`);
        setAuction(res.data);
        const price = res.data.currentPrice || res.data.startPrice || 0;
        setCurrentPrice(price);
        setValue('bidAmount', price + (res.data.stepPrice || 5000000));
        
        // Fetch bid history
        const bidsRes = await API.get(`/bids/auction/${id}`).catch(() => ({ data: [] }));
        setBidHistory(bidsRes.data || []);
        
        // Check watchlist
        if (user) {
          const wlRes = await API.get(`/watchlists/user/${user.id}`);
          const watchlistItem = wlRes.data.find(w => w.auctionId === parseInt(id));
          if (watchlistItem) {
            setWatchlistActive(true);
            setWatchlistId(watchlistItem.id);
          }
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        toast.error("Không tìm thấy phiên đấu giá!");
        navigate('/auctions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, setValue, navigate]);

  // WebSocket Setup
  useEffect(() => {
    if (!auction) return;
    
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/auction/${auction.id}`, (message) => {
        if (message.body) {
          const bidResponse = JSON.parse(message.body);
          if (bidResponse.bidAmount) {
            setCurrentPrice(bidResponse.bidAmount);
            setBidsCount(prev => prev + 1);
            setValue('bidAmount', bidResponse.bidAmount + (auction.stepPrice || 5000000));
            if (bidResponse.userName) {
              setHighestBidder(bidResponse.userName);
            }
            setBidHistory(prev => [bidResponse, ...prev]);
            setIsPriceBlinking(true);
            setTimeout(() => setIsPriceBlinking(false), 1500);
          }
        }
      });
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [auction, setValue]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để lưu vào yêu thích!");
      navigate('/auth');
      return;
    }
    
    try {
      if (watchlistActive && watchlistId) {
        // Xóa khỏi yêu thích
        await API.delete(`/watchlists/${watchlistId}`);
        setWatchlistActive(false);
        setWatchlistId(null);
        toast.success("Đã xóa khỏi mục yêu thích!");
      } else {
        // Thêm vào yêu thích
        const res = await API.post('/watchlists', {
          userId: user.id,
          auctionId: auction.id
        });
        setWatchlistActive(true);
        setWatchlistId(res.data.id);
        toast.success("Đã lưu vào mục yêu thích!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, thử lại sau!");
    }
  };

  const onSubmitBid = (data) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt giá!");
      navigate('/auth');
      return;
    }
    if (!user.phone || !user.address) {
      setIsModalOpen(true);
      return;
    }

    if (data.bidAmount < currentPrice + bidStep) {
      toast.error(`Giá đặt tối thiểu phải là ${formatCurrency(currentPrice + bidStep)}`);
      return;
    }

    if ((data.bidAmount - currentPrice) % bidStep !== 0) {
      toast.error("Giá đặt phải là bội số của bước giá");
      return;
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      const bidRequest = {
        auctionId: auction.id,
        bidAmount: data.bidAmount,
        userId: user.id
      };
      
      stompClientRef.current.publish({
        destination: `/app/auction/${auction.id}/bid`,
        body: JSON.stringify(bidRequest)
      });
      
      toast.success(`Đã gửi lệnh đặt giá ${formatCurrency(data.bidAmount)}...`);
    } else {
      toast.error("Chưa kết nối được máy chủ thời gian thực!");
    }
  };

  if (loading || !auction) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate Time Left
  const calcTimeLeft = () => {
    const diff = new Date(auction.bidEndTime) - new Date();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      s: Math.floor((diff % (1000 * 60)) / 1000)
    };
  };
  const timeLeft = calcTimeLeft();
  const placeholderImg = 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600';

  const maskName = (name) => {
    if (!name) return 'Ẩn danh';
    if (name.length <= 2) return name + '***';
    return name[0] + '***' + name[name.length - 1];
  };

  const isEnded = (timeLeft.h === 0 && timeLeft.m === 0 && timeLeft.s === 0) || ['SOLD', 'UNSOLD', 'COMPLETED'].includes(auction.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <Toaster position="top-right" />
      <CompleteProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Images & Descriptions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden aspect-video relative shadow-sm">
            <img 
              src={placeholderImg} 
              alt={auction.title} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={handleWatchlistToggle}
              className={`absolute top-4 right-4 p-3 rounded-full border shadow-md transition-all ${
                watchlistActive 
                  ? 'bg-red-50 text-red-600 border-red-200' 
                  : 'bg-white text-gray-400 hover:text-gray-600 border-gray-200'
              }`}
              title="Thêm vào danh sách theo dõi"
            >
              <FiHeart className={`w-5 h-5 ${watchlistActive ? 'fill-red-600' : ''}`} />
            </button>
          </div>

          {/* Specifications description */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 m-0">
              Chi tiết tài sản
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed m-0 whitespace-pre-wrap">
              {auction.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        </div>

        {/* Right Side: Bid Box & Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                {auction.categoryName || 'Chưa phân loại'}
              </span>
              <h2 className="text-2xl font-bold text-gray-950 mt-3 mb-2 leading-tight">
                {auction.title}
              </h2>
              
              {/* Current Price Highlight */}
              <div className="flex flex-col items-start mt-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Giá hiện tại</span>
                <div className={`-ml-2 p-2 rounded-lg ${isPriceBlinking ? 'animate-pulse bg-green-100 text-green-700 transition-all duration-300' : 'bg-transparent text-blue-600'}`}>
                  <p className="text-4xl font-extrabold leading-none">
                    {formatCurrency(currentPrice)}
                  </p>
                </div>
                {highestBidder && (
                  <span className="text-sm font-medium text-gray-500 mt-1">
                    Người đang giữ giá: <span className="font-bold text-gray-800">{highestBidder}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Timers & Location */}
            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Thời gian còn lại</span>
                <p className="text-base font-extrabold text-red-600 flex items-center gap-1.5 mt-1">
                  <FiClock className="w-4 h-4" /> {timeLeft.h}h : {timeLeft.m}m : {timeLeft.s}s
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Nơi bàn giao</span>
                <p className="text-sm font-bold text-gray-800 mt-1">{auction.locationName || 'Chưa cập nhật'}</p>
              </div>
            </div>

            {/* Bids Pricing details */}
            <div className="flex justify-between items-center bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Giá khởi điểm</span>
                <p className="text-sm font-semibold text-gray-500 mt-1">{formatCurrency(auction.startPrice || 0)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Số lượt đấu giá</span>
                <p className="text-sm font-semibold text-gray-800 mt-1">{bidsCount} lượt</p>
              </div>
            </div>

            {/* Bidding interactive Form */}
            <form onSubmit={handleSubmit(onSubmitBid)} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Mức giá đặt tối thiểu (Tổng tiền):</span>
                  <span className="text-rose-600">{formatCurrency(currentPrice + bidStep)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                  <span>Bước giá (Số tiền tăng ít nhất):</span>
                  <span className="text-blue-600">+{formatCurrency(bidStep)}</span>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    step={bidStep}
                    min={currentPrice + bidStep}
                    disabled={isEnded}
                    onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập mức giá là bội số của bước giá (VD: ' + formatCurrency(currentPrice + bidStep) + ')')}
                    onInput={(e) => {
                      e.target.setCustomValidity('');
                    }}
                    {...register('bidAmount')}
                    className={`w-full pl-8 pr-12 py-3 border ${errors.bidAmount ? 'border-red-500' : 'border-gray-200'} rounded-xl font-bold text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
                  />
                  <FiDollarSign className="absolute left-3.5 top-4 text-gray-400" />
                  <span className="absolute right-4 top-4 text-xs font-bold text-gray-400">VND</span>
                </div>
                {errors.bidAmount && <p className="text-red-500 text-xs italic">{errors.bidAmount.message}</p>}
                
                {/* Smart Bidding Buttons */}
                {!isEnded && (
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setValue('bidAmount', currentPrice + bidStep)} className="flex-1 py-2 px-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors flex flex-col items-center justify-center gap-0.5">
                      <span>+1 Bước giá</span>
                      <span className="font-extrabold text-[10px] bg-blue-200 px-2 rounded-full text-blue-800">
                        + {formatCurrency(bidStep)}
                      </span>
                    </button>
                    <button type="button" onClick={() => setValue('bidAmount', Math.ceil((currentPrice * 1.05) / bidStep) * bidStep)} className="flex-1 py-2 px-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors flex flex-col items-center justify-center gap-0.5">
                      <span>+5% Giá hiện tại</span>
                      <span className="font-extrabold text-[10px] bg-blue-200 px-2 rounded-full text-blue-800">
                        + {formatCurrency(Math.ceil((currentPrice * 1.05) / bidStep) * bidStep - currentPrice)}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isEnded}
                className={`w-full py-4 font-extrabold rounded-xl shadow-lg transition-all text-center uppercase tracking-wider ${isEnded ? 'bg-gray-400 cursor-not-allowed text-white shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
              >
                {isEnded ? "PHIÊN ĐẤU GIÁ ĐÃ KẾT THÚC" : "ĐẶT GIÁ NGAY"}
              </button>
            </form>
          </div>

          {/* Bid History Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-gray-900 border-b border-gray-100 pb-3 m-0">Lịch sử đặt giá</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {bidHistory.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có lượt đặt giá nào.</p>
              ) : (
                bidHistory.slice(0, 5).map((bid, index) => {
                  const bidTime = new Date(bid.bidTime);
                  const timeStr = `${bidTime.getHours().toString().padStart(2, '0')}:${bidTime.getMinutes().toString().padStart(2, '0')}:${bidTime.getSeconds().toString().padStart(2, '0')}`;
                  return (
                    <div key={index} className={`flex justify-between items-center p-3 rounded-xl border ${index === 0 ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500">{timeStr}</span>
                        <span className={`text-sm font-bold ${index === 0 ? 'text-blue-700' : 'text-gray-700'}`}>{maskName(bid.userName)}</span>
                      </div>
                      <div className={`font-extrabold ${index === 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                        {formatCurrency(bid.bidAmount)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Legal Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 text-xs text-gray-500">
            {/* Seller profile */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-lg font-bold">
                <FiUser />
              </div>
              <div className="flex-grow">
                <span className="text-[10px] uppercase font-bold text-gray-400">Người bán tài sản</span>
                <p className="text-sm font-bold text-gray-800 m-0">{auction.sellerName || 'Hệ thống BidMax'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Đáng tin cậy
                </span>
              </div>
            </div>

            {/* Safeguard items */}
            <div className="space-y-3 pt-1">
              <div className="flex gap-2.5 items-start">
                <FiShield className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                <p className="m-0 leading-relaxed">
                  <span className="font-bold text-gray-800">Khoản đặt cọc:</span> {formatCurrency(auction.depositAmount || 0)}. Tiền đặt cọc sẽ hoàn trả sau khi phiên kết thúc nếu không thắng cuộc.
                </p>
              </div>
              <div className="flex gap-2.5 items-start">
                <FiInfo className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
                <p className="m-0 leading-relaxed">
                  <span className="font-bold text-gray-800">Bước giá:</span> {formatCurrency(bidStep)}. Giá đặt kế tiếp phải là bội số của bước giá này.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
