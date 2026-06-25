import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import { FaGavel } from 'react-icons/fa';

const AuctionCard = ({ auction }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const isEndingSoon = auction.hoursLeft <= 24;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
      
      {/* Product Image & Badge */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img 
          src={auction.imageUrl} 
          alt={auction.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md animate-pulse ${isEndingSoon ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {isEndingSoon ? 'Sắp kết thúc' : 'Đang diễn ra'}
          </span>
        </div>

        {/* Countdown Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4">
          <div className="flex items-center gap-2 text-white text-xs font-bold">
            <FiClock className="w-4 h-4 text-red-400 animate-bounce" />
            <span className="tracking-wide">
              Còn lại: <span className="font-mono text-red-300 text-sm">{String(auction.hoursLeft).padStart(2, '0')}:{String(auction.minutesLeft).padStart(2, '0')}:00</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors flex-1">
          <Link to={`/auction/${auction.id}`} className="absolute inset-0 z-0"></Link>
          {auction.title}
        </h3>

        {/* Bids Info */}
        <div className="text-[11px] font-semibold text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 w-fit border border-gray-100">
          🔥 {auction.bidsCount} lượt đã đặt giá
        </div>

        {/* Price & Action */}
        <div className="flex items-end justify-between mt-1 relative z-10">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Giá hiện tại</p>
            <p className="text-lg font-black text-red-600">{formatCurrency(auction.currentPrice)}</p>
          </div>
          <Link 
            to={`/auction/${auction.id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md hover:shadow-blue-500/30"
          >
            <FaGavel className="w-3.5 h-3.5" /> Ra giá ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
