import React, { useState, useEffect } from 'react';
import { FiBox, FiActivity, FiCheckCircle, FiDollarSign, FiUsers, FiCalendar } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#f87171'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    completedAuctions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    auctionsByStatus: [],
    revenueByMonth: []
  });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filterType, setFilterType] = useState('ALL_TIME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const fetchStats = async (start = '', end = '') => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats(start, end);
      setStats(res);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Không thể lấy dữ liệu thống kê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilter(filterType);
  }, [filterType]);

  const applyFilter = (type) => {
    const today = new Date();
    let start = '';
    let end = '';

    switch (type) {
      case 'THIS_MONTH':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        setStartDate(start);
        setEndDate(end);
        fetchStats(start, end);
        break;
      case 'THIS_YEAR':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        setStartDate(start);
        setEndDate(end);
        fetchStats(start, end);
        break;
      case 'CUSTOM':
        // Do not fetch immediately, let user click Apply
        break;
      case 'ALL_TIME':
      default:
        setStartDate('');
        setEndDate('');
        fetchStats('', '');
        break;
    }
  };

  const handleCustomFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn đầy đủ Từ ngày và Đến ngày.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Từ ngày không thể lớn hơn Đến ngày.");
      return;
    }
    fetchStats(startDate, endDate);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Thống kê hệ thống</h2>
          <p className="text-sm text-slate-500">Tổng quan tình hình hoạt động của toàn bộ nền tảng</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-2.5 text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 appearance-none min-w-[150px]"
            >
              <option value="ALL_TIME">Tất cả thời gian</option>
              <option value="THIS_MONTH">Tháng này</option>
              <option value="THIS_YEAR">Năm nay</option>
              <option value="CUSTOM">Tuỳ chỉnh...</option>
            </select>
          </div>

          {filterType === 'CUSTOM' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleCustomFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500">Đang tính toán dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <FiBox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tổng sản phẩm</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.totalAuctions}</h3>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <FiActivity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Đang đấu giá</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.activeAuctions}</h3>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Đã bán (Thành công)</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.completedAuctions}</h3>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-slate-500 font-medium">Doanh thu dự kiến</p>
              <h3 className="text-xl font-bold text-slate-800 truncate" title={formatCurrency(stats.totalRevenue)}>
                {formatCurrency(stats.totalRevenue)}
              </h3>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600 flex items-center justify-center shrink-0">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tổng người dùng</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.totalUsers}</h3>
            </div>
          </div>

          {/* Charts Area */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Area Chart: Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Doanh thu 6 tháng qua</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.revenueByMonth}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 12}}
                      tickFormatter={(value) => `${value / 1000000}M`}
                      dx={-10}
                    />
                    <RechartsTooltip 
                      formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Tỷ lệ Trạng thái</h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.auctionsByStatus}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.auctionsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
