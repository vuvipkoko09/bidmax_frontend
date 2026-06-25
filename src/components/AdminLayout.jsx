import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiUsers, 
  FiShield, 
  FiFolder, 
  FiMapPin, 
  FiTrendingUp, 
  FiImage, 
  FiDollarSign, 
  FiFileText, 
  FiActivity, 
  FiShoppingCart, 
  FiCreditCard, 
  FiStar, 
  FiBookOpen, 
  FiBell, 
  FiBookmark, 
  FiArchive,
  FiChevronRight,
  FiPieChart,
  FiSettings
} from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // List of links with corresponding icons
  const menuItems = [
    { path: '/admin/dashboard', label: 'Thống kê (Dashboard)', icon: FiPieChart },
    { path: '/admin/users', label: 'Quản lý Người dùng', icon: FiUsers },
    { path: '/admin/roles', label: 'Quản lý Vai trò', icon: FiShield },
    { path: '/admin/categories', label: 'Quản lý Danh mục', icon: FiFolder },
    { path: '/admin/locations', label: 'Quản lý Địa điểm', icon: FiMapPin },
    { path: '/admin/auctions', label: 'Quản lý Phiên đấu giá', icon: FiTrendingUp },
    { path: '/admin/auction-images', label: 'Quản lý Ảnh đấu giá', icon: FiImage },
    { path: '/admin/auction-deposits', label: 'Quản lý Tiền đặt cọc', icon: FiDollarSign },
    { path: '/admin/auction-registrations', label: 'Quản lý Đăng ký', icon: FiFileText },
    { path: '/admin/bids', label: 'Quản lý Lượt đặt giá', icon: FiActivity },
    { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: FiShoppingCart },
    { path: '/admin/transactions', label: 'Quản lý Giao dịch', icon: FiCreditCard },
    { path: '/admin/reviews', label: 'Quản lý Đánh giá', icon: FiStar },
    { path: '/admin/news', label: 'Quản lý Tin tức', icon: FiBookOpen },
    { path: '/admin/notifications', label: 'Quản lý Thông báo', icon: FiBell },
    { path: '/admin/watchlists', label: 'Danh sách theo dõi', icon: FiBookmark },
    { path: '/admin/audit-logs', label: 'Nhật ký hệ thống', icon: FiArchive },
    { path: '/admin/settings', label: 'Cấu hình hệ thống', icon: FiSettings }
  ];

  const activeItem = menuItems.find(item => item.path === currentPath);
  const pageTitle = activeItem ? activeItem.label : 'Tổng quan';

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-20">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
            A
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-white uppercase m-0 leading-none">
              AUCTION ADMIN
            </h2>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
              SYSTEM PORTAL
            </span>
          </div>
        </div>

        {/* Dynamic scrollable navigation */}
        <nav className="flex-1 overflow-y-auto py-6 sidebar-nav">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <li key={idx}>
                  <Link 
                    to={item.path} 
                    className={`flex items-center gap-3 px-4 py-3 mx-4 rounded-lg font-semibold text-sm transition-all duration-150 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-100'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-500 font-medium">SaaS Platform v1.0.0</p>
        </div>
      </aside>

      {/* Workspace Area */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
          
          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Admin</span>
            <FiChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900">{pageTitle}</span>
          </div>

          {/* Profile User avatar mockup */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Trang Client
            </Link>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 m-0">{user?.username || 'Quản trị viên'}</p>
                <p className="text-[11px] text-gray-400 m-0">{user?.email || 'admin@auction.com'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-sm shadow-sm uppercase">
                {(user?.username || 'AD').substring(0, 2)}
              </div>
              <button 
                onClick={logout}
                title="Đăng xuất"
                className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="p-8 flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
