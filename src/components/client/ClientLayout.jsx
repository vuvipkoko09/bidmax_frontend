import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import Navbar from '../common/Navbar';
import adminService from '../../services/adminService';

const ClientLayout = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getAllCategories();
        // Take up to 5 categories to show in footer
        setCategories(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load categories for footer", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* BƯỚC 4: TÍCH HỢP NAVBAR TẠI ĐÂY */}
      {/* Component Navbar được đặt ngoài cùng để bọc phần Outlet bên dưới */}
      <Navbar />

      {/* Main Content Workspace */}
      <main className="flex-grow">
        {/* Nơi chứa nội dung các trang con (Home, Auctions, Profile...) */}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* About Hub */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  🔨
                </span>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  BidMax
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Nền tảng đấu giá trực tuyến hiện đại, minh bạch và an toàn hàng đầu Việt Nam. Mang cơ hội sở hữu tài sản giá trị đến tay bạn chỉ bằng một click chuột.
              </p>
            </div>

            {/* Directory Links (Dynamic) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Danh mục phổ biến</h4>
              <ul className="space-y-2 text-xs">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/auctions?category=${cat.id}`} className="hover:text-white transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li><span className="text-gray-500">Đang cập nhật...</span></li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Hỗ trợ khách hàng</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="hover:text-white transition-colors">Giới thiệu</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Quy chế đấu giá</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">Câu hỏi thường gặp (FAQs)</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ hỗ trợ</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Liên hệ với chúng tôi</h4>
              <p className="text-xs leading-relaxed text-slate-400 mb-2">
                Hotline: 1900 6789<br />
                Email: support@bidmax.vn<br />
                Địa chỉ: Tòa nhà Hub, Cầu Giấy, Hà Nội
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="hover:text-white text-lg"><FiHeart /></a>
                <a href="#" className="hover:text-white text-lg"><FiShoppingCart /></a>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} BidMax Inc. Bảo lưu mọi quyền.</p>
            <div className="flex gap-4">
              <Link to="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ClientLayout;
