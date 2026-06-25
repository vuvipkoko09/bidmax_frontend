import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiEye, FiFilter, FiBox, FiActivity, FiClock, FiCheckCircle, FiArchive, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../services/api';
import AuctionFormModal from '../../components/seller/AuctionFormModal';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageAuctions = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/seller/auctions?sellerId=${user.id}`);
      setAuctions(res.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAuctions();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700">Chờ duyệt</span>;
      case 'ACTIVE':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">Đang đấu giá</span>;
      case 'SOLD':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700">Chờ thanh toán</span>;
      case 'PAID':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700">Đã thanh toán</span>;
      case 'SHIPPED':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700">Đang giao hàng</span>;
      case 'COMPLETED':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">Hoàn thành</span>;
      case 'FAILED':
      case 'REJECTED':
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">Thất bại</span>;
      default:
        return <span className="rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const filteredAuctions = auctions.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý phiên đấu giá</h1>
            <p className="text-slate-500">Quản lý các sản phẩm bạn đang đăng bán</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" /> Đăng sản phẩm mới
          </button>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Đang tải dữ liệu...</p>
          </div>
        ) : auctions.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm border border-slate-100">
            <FiArchive className="w-20 h-20 text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">Bạn chưa có phiên đấu giá nào</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-md text-center">Bắt đầu đăng bán tài sản của bạn ngay hôm nay để tiếp cận với hàng ngàn người mua tiềm năng trên hệ thống.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-blue-500/30 shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" /> Tạo sản phẩm đầu tiên
            </button>
          </div>
        ) : (
          // Premium Table
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tên sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div className="relative min-w-[200px]">
                <FiFilter className="absolute left-3.5 top-3 text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors appearance-none"
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="ACTIVE">Đang đấu giá</option>
                  <option value="SOLD">Chờ thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="SHIPPED">Đang giao hàng</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="FAILED">Thất bại</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Hình ảnh & Tên</th>
                    <th className="px-6 py-4 text-center">Giá khởi điểm</th>
                    <th className="px-6 py-4 text-center">Thời gian kết thúc</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuctions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                        Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredAuctions.map(auction => (
                      <tr key={auction.id} className="hover:bg-blue-50/50 transition-colors border-b border-slate-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                              <img src={auction.thumbnail || 'https://via.placeholder.com/150'} alt={auction.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{auction.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{auction.categoryName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-700">
                          {formatCurrency(auction.startPrice)}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {new Date(auction.bidEndTime).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(auction.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {auction.status === 'PENDING' && (
                              <button 
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <FiEdit className="w-4 h-4" />
                              </button>
                            )}
                            <Link 
                              to={`/auction/${auction.id}`}
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AuctionFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchAuctions();
          }}
        />
      </div>
    </div>
  );
};

export default ManageAuctions;
