import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import API from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const Watchlists = () => {
  const { user } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      // 1. Get watchlist entries
      const res = await API.get(`/watchlists/user/${user.id}`);
      const entries = res.data;
      
      // 2. Fetch full auction details for each entry
      const itemsWithDetails = await Promise.all(
        entries.map(async (entry) => {
          try {
            const auctionRes = await API.get(`/auctions/${entry.auctionId}`);
            return {
              watchlistId: entry.id,
              addedAt: entry.addedAt,
              auction: auctionRes.data
            };
          } catch (err) {
            console.error(`Failed to fetch auction ${entry.auctionId}`, err);
            return null;
          }
        })
      );
      
      setWatchlistItems(itemsWithDetails.filter(item => item !== null));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchWatchlist();
    }
  }, [user]);

  const handleRemove = async (watchlistId) => {
    try {
      await API.delete(`/watchlists/${watchlistId}`);
      setWatchlistItems(prev => prev.filter(item => item.watchlistId !== watchlistId));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Xóa thất bại!");
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
          <FiHeart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
          <p className="text-gray-500 text-sm">Quản lý các phiên đấu giá bạn đang theo dõi</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500">Đang tải danh sách...</p>
        </div>
      ) : watchlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Danh sách trống</h3>
          <p className="text-gray-500 mt-2 mb-6">Bạn chưa thêm sản phẩm nào vào mục yêu thích.</p>
          <Link to="/auctions" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
            Khám phá đấu giá
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4 font-bold">Sản phẩm</th>
                  <th className="px-6 py-4 font-bold text-center">Giá hiện tại</th>
                  <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {watchlistItems.map(({ watchlistId, auction }) => (
                  <tr key={watchlistId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=200" 
                            alt={auction.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link to={`/auction/${auction.id}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1">
                            {auction.title}
                          </Link>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span className="bg-gray-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{auction.categoryName || 'Chưa phân loại'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-extrabold text-blue-600">
                        {formatCurrency(auction.currentPrice || auction.startPrice || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Đang diễn ra
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/auction/${auction.id}`}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                        <button 
                          onClick={() => handleRemove(watchlistId)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa khỏi danh sách"
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
        </div>
      )}
    </div>
  );
};

export default Watchlists;
