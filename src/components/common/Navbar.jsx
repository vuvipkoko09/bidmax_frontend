import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FiHeart, FiMenu, FiX, FiUser, FiBox, FiSettings, FiLogOut, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Handle Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/auctions?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false); // Close mobile menu if searching from mobile
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        
        {/* === Cụm Trái === */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-extrabold text-2xl tracking-tight text-gray-900 flex items-center gap-1.5">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">🔨</span>
            Bid<span className="text-blue-600">Max</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="flex items-center gap-6 font-semibold text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
            <Link to="/auctions" className="hover:text-blue-600 transition-colors">Đấu giá</Link>
            <Link to="/articles" className="hover:text-blue-600 transition-colors">Tin tức</Link>
            <Link to="/reviews" className="hover:text-blue-600 transition-colors">Đánh giá</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">Giới thiệu</Link>
            <Link to="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Liên hệ</Link>
          </div>
        </div>

        {/* === Cụm Giữa (Search Bar - Desktop) === */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài sản đấu giá..."
              className="w-full pl-5 pr-12 py-2.5 bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-full text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center">
              <FaSearch className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* === Cụm Phải === */}
        <div className="flex items-center gap-4">
          
          {user ? (
            <div className="flex items-center gap-5">
              {(user.role === 'SELLER' || user.role === 'ADMIN' || user.role?.toUpperCase() === 'SELLER' || user.role?.toUpperCase() === 'ADMIN') && (
                <Link to="/seller/my-auctions" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                  <FiPlus className="w-4 h-4" /> Đặt bán
                </Link>
              )}
              
              <Link to="/watchlists" className="text-gray-500 hover:text-rose-500 transition-colors relative" title="Sản phẩm yêu thích">
                <FiHeart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </Link>
              
              {/* User Dropdown */}
              <div 
                className="relative group" 
                ref={dropdownRef}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold text-sm transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.username?.substring(0, 2) || 'U'}
                  </div>
                  {user?.username || 'User'}
                </Link>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full pt-3 w-56">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                        <FiUser className="w-4 h-4" /> Hồ sơ cá nhân
                      </Link>
                      
                      {(user.role === 'SELLER' || user.role === 'ADMIN' || user.role?.toUpperCase() === 'SELLER' || user.role?.toUpperCase() === 'ADMIN') && (
                        <Link to="/seller/my-auctions" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                          <FiBox className="w-4 h-4" /> Quản lý sản phẩm
                        </Link>
                      )}

                      {(user.role === 'ADMIN' || user.role?.toUpperCase() === 'ADMIN') && (
                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-t border-gray-100">
                          <FiSettings className="w-4 h-4" /> Trang Quản trị
                        </Link>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-bold border-t border-gray-100 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth" className="text-gray-600 hover:text-blue-600 font-semibold text-sm px-3 py-2 transition-colors">
                Đăng nhập
              </Link>
              <Link to="/auth" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Hamburger Menu Icon (Mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-500 hover:text-gray-900 p-1 transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* === Mobile Menu Panel === */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài sản..."
              className="w-full pl-4 pr-10 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col gap-2 font-semibold text-gray-600">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Trang chủ</Link>
            <Link to="/auctions" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Đấu giá</Link>
            <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Tin tức</Link>
            <Link to="/reviews" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Đánh giá</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Giới thiệu</Link>
            <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">FAQ</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 hover:bg-gray-50 rounded-lg">Liên hệ</Link>
            
            {user ? (
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link to="/watchlists" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-rose-500">
                  <FiHeart /> Sản phẩm yêu thích
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                  <FiUser /> Hồ sơ cá nhân ({user.username})
                </Link>
                {(user.role === 'SELLER' || user.role === 'ADMIN' || user.role?.toUpperCase() === 'SELLER' || user.role?.toUpperCase() === 'ADMIN') && (
                  <Link to="/seller/my-auctions" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700">
                    <FiBox /> Quản lý sản phẩm
                  </Link>
                )}
                {(user.role === 'ADMIN' || user.role?.toUpperCase() === 'ADMIN') && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-blue-600">
                    <FiSettings /> Trang Quản trị
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-600 text-left font-bold border-t border-gray-100 mt-1">
                  <FiLogOut /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 border-t border-gray-100 mt-2 pt-4">
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-gray-600 hover:text-blue-600 font-semibold text-sm px-3 py-2 transition-colors border border-gray-200 rounded-lg">
                  Đăng nhập
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-lg shadow-md transition-all">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
