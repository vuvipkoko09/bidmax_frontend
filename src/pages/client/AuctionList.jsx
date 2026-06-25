import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFilter, FiSearch, FiClock, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../../services/api';
import publicService from '../../services/publicService';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategoriesList(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAuctions();
  }, [page]); // Re-fetch when page changes

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 9
      };
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await publicService.searchAuctions(params);
      setAuctions(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    setPage(0); // Reset to first page
    fetchAuctions();
  };

  const handleClearFilter = () => {
    setKeyword('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    setPage(0);
    // Note: We can't immediately call fetchAuctions here if we rely on state updates. 
    // We can pass empty params directly.
    setLoading(true);
    publicService.searchAuctions({ page: 0, size: 9 })
      .then(res => {
        setAuctions(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .finally(() => setLoading(false));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const calculateTimeLeft = (endTime) => {
    if (!endTime) return { hours: 0, minutes: 0 };
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return { hours: 0, minutes: 0 };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900 m-0">Tất cả phiên đấu giá</h2>
          <p className="text-xs text-gray-500 mt-1">Tìm thấy {totalElements} sản phẩm</p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Lọc tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Filter Sidebar */}
        <aside className="w-full lg:w-64 bg-white border border-gray-200 rounded-xl p-6 h-fit shrink-0 space-y-6 text-left">
          
          <div className="flex items-center gap-2 font-bold text-gray-900 border-b border-gray-100 pb-3">
            <FiFilter className="text-blue-600" /> Bộ lọc tìm kiếm
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-800">Danh mục tài sản</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input 
                  type="radio"
                  name="category"
                  checked={categoryId === ''}
                  onChange={() => setCategoryId('')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span>Tất cả</span>
              </label>
              {categoriesList.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="radio"
                    name="category"
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-800">Khoảng giá (VNĐ)</h4>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Từ..."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                placeholder="Đến..."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <button 
              onClick={handleApplyFilter}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
            >
              Áp dụng bộ lọc
            </button>
            <button 
              onClick={handleClearFilter}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>

        </aside>

        {/* Right Auction Grid */}
        <div className="flex-1 flex flex-col">
          {loading ? (
             <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-4 flex-1">
               <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p>Đang tải dữ liệu đấu giá...</p>
             </div>
          ) : auctions.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-16 text-center text-gray-400 flex-1">
              Chưa có phiên đấu giá nào phù hợp với bộ lọc đã chọn.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auc) => {
                  const timeLeft = calculateTimeLeft(auc.bidEndTime);
                  const placeholderImage = auc.images && auc.images.length > 0 ? auc.images[0] : 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400';
                  
                  return (
                    <div 
                      key={auc.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-all text-left"
                    >
                      {/* Image */}
                      <div className="relative aspect-4/3 bg-gray-50 overflow-hidden">
                        <img 
                          src={placeholderImage} 
                          alt={auc.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info details */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                            <Link to={`/auction/${auc.id}`}>{auc.title}</Link>
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiClock className="text-red-500 shrink-0" />
                            <span>Còn lại: {timeLeft.hours}h : {timeLeft.minutes}m</span>
                          </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-auto">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Giá hiện tại</span>
                            <p className="text-base font-extrabold text-blue-600">
                              {formatCurrency(auc.currentPrice || auc.startPrice || 0)}
                            </p>
                          </div>
                          <Link 
                            to={`/auction/${auc.id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Đấu giá
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                        page === i 
                          ? 'bg-blue-600 text-white border border-blue-600' 
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};

export default AuctionList;
