import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronRight, FiUserPlus, FiTarget, FiAward, FiArrowRight } from 'react-icons/fi';
import AuctionCard from '../../components/client/AuctionCard';
import adminService from '../../services/adminService';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch auctions, categories, and articles concurrently
        const [auctionsData, categoriesData, articlesData] = await Promise.all([
          adminService.getAllAuctions().catch(() => []),
          adminService.getAllCategories().catch(() => []),
          adminService.getApprovedArticles().catch(() => [])
        ]);
        
        // Transform backend categories to match UI
        const colorVariants = [
          { bgColor: 'bg-amber-50', textColor: 'text-amber-600', icon: '🏺' },
          { bgColor: 'bg-cyan-50', textColor: 'text-cyan-600', icon: '💎' },
          { bgColor: 'bg-red-50', textColor: 'text-red-600', icon: '🚗' },
          { bgColor: 'bg-fuchsia-50', textColor: 'text-fuchsia-600', icon: '🎨' },
          { bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: '💻' },
          { bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', icon: '🏢' },
        ];

        const mappedCategories = categoriesData.slice(0, 6).map((cat, index) => {
          const variant = colorVariants[index % colorVariants.length];
          const count = auctionsData.filter(a => a.categoryId === cat.id).length;
          return {
            name: cat.name,
            code: cat.id,
            count: count,
            icon: variant.icon,
            bgColor: variant.bgColor,
            textColor: variant.textColor
          };
        });

        // Transform backend auctions to match AuctionCard props
        const mappedAuctions = auctionsData.slice(0, 4).map(auc => {
          // Calculate time left from bidEndTime
          let hoursLeft = 0;
          let minutesLeft = 0;
          if (auc.bidEndTime) {
            const endDate = new Date(auc.bidEndTime);
            const now = new Date();
            const diffMs = endDate - now;
            if (diffMs > 0) {
              hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
              minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            }
          }

          return {
            id: auc.id,
            title: auc.title,
            currentPrice: auc.currentPrice || auc.startPrice,
            bidsCount: 0, // Requires Bid fetching in future
            imageUrl: auc.thumbnail || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600',
            hoursLeft,
            minutesLeft,
          };
        });

        // Transform backend articles
        const mappedArticles = articlesData.slice(0, 3).map(article => {
          return {
            id: article.id,
            title: article.title,
            excerpt: article.content ? article.content.substring(0, 100) + '...' : '',
            date: article.createdAt ? new Date(article.createdAt).toLocaleDateString('vi-VN') : '',
            image: article.thumbnail || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
            category: 'Tin tức'
          };
        });

        setCategories(mappedCategories);
        setAuctions(mappedAuctions);
        setArticles(mappedArticles);
      } catch (err) {
        console.error('Failed to load home data', err);
        toast.error('Có lỗi xảy ra khi tải dữ liệu trang chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query) {
      navigate(`/auctions?search=${query}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Sàn đấu giá số 1 Việt Nam
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
                Săn hàng hiệu, <br />
                <span className="text-blue-600">
                  Chốt giá hời!
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                BidMax là nền tảng đấu giá trực tuyến an toàn và minh bạch. Khám phá hàng ngàn tài sản giá trị, đồ cổ độc bản và siêu xe với mức giá khởi điểm cực kỳ hấp dẫn.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/auctions" 
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Tham gia đấu giá ngay <FiArrowRight />
                </Link>
                <Link 
                  to="/seller/my-auctions" 
                  className="px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Đăng bán tài sản
                </Link>
              </div>

            </div>

            {/* Right Visual Image */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-white rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800" 
                  alt="Rolex Watch Illustration" 
                  className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black uppercase rounded-lg">Đang Hot</span>
                    <span className="text-sm font-bold text-gray-500">Kết thúc sau: 02:45:00</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Rolex Submariner Date</h3>
                  <p className="text-3xl font-black text-blue-600">345.000.000 ₫</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Danh mục nổi bật</h2>
            <p className="text-gray-500 font-medium">Lựa chọn từ các danh mục tài sản được quan tâm và săn đón nhiều nhất trên nền tảng BidMax.</p>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải danh mục...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Chưa có danh mục nào.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat, idx) => (
                <Link 
                  key={idx} 
                  to={`/auctions?category=${cat.code}`}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 mx-auto ${cat.bgColor} ${cat.textColor} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{cat.name}</h4>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{cat.count} tài sản</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Phiên đấu giá sắp kết thúc */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                Sắp chốt phiên
              </div>
              <h2 className="text-3xl font-black text-gray-900">🔥 Phiên đấu giá sắp kết thúc</h2>
            </div>
            <Link to="/auctions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition-colors shrink-0">
              Xem tất cả <FiChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
             <div className="text-center py-10 text-gray-500">Đang tải phiên đấu giá...</div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Hiện chưa có phiên đấu giá nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.map((auc) => (
                <AuctionCard key={auc.id} auction={auc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tin tức mới nhất */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">📰 Tin tức mới nhất</h2>
              <p className="text-gray-500 font-medium">Cập nhật thông tin thị trường và kiến thức đấu giá.</p>
            </div>
            <Link to="/articles" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Xem tất cả <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.length > 0 ? articles.map(news => (
              <Link to={`/articles/${news.id}`} key={news.id} className="group">
                <div className="rounded-2xl overflow-hidden mb-4 relative h-60">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-lg">
                    {news.category}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-2">
                  <span>{news.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {news.excerpt}
                </p>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-10 text-gray-500">Chưa có tin tức nào.</div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/articles" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Xem tất cả <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Cách thức hoạt động */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-900 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Cách thức hoạt động</h2>
            <p className="text-gray-400 font-medium text-lg">Chỉ với 3 bước đơn giản để sở hữu tài sản mơ ước của bạn với mức giá tốt nhất.</p>
          </div>

          <div className={`grid grid-cols-1 ${!user ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-12 lg:gap-8 text-center relative`}>
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-gray-800 via-blue-500/50 to-gray-800 -z-10"></div>

            {/* Step 1 */}
            {!user && (
              <Link to="/auth" className="relative group block">
                <div className="w-24 h-24 mx-auto bg-gray-800 border-4 border-gray-900 rounded-3xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl relative z-10">
                  <FiUserPlus className="w-10 h-10" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white font-black rounded-full flex items-center justify-center text-sm border-4 border-gray-900">1</div>
                </div>
                <h3 className="text-xl font-bold mt-8 mb-3 group-hover:text-blue-400 transition-colors">Đăng ký tài khoản</h3>
                <p className="text-gray-400 leading-relaxed px-4">Tạo tài khoản BidMax miễn phí và xác thực danh tính để bắt đầu hành trình đấu giá an toàn.</p>
              </Link>
            )}

            {/* Step 2 */}
            <Link to="/auctions" className="relative group block">
              <div className="w-24 h-24 mx-auto bg-gray-800 border-4 border-gray-900 rounded-3xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xl relative z-10">
                <FiTarget className="w-10 h-10" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white font-black rounded-full flex items-center justify-center text-sm border-4 border-gray-900">{!user ? '2' : '1'}</div>
              </div>
              <h3 className="text-xl font-bold mt-8 mb-3 group-hover:text-emerald-400 transition-colors">Tìm kiếm & Theo dõi</h3>
              <p className="text-gray-400 leading-relaxed px-4">Khám phá hàng ngàn phiên đấu giá. Lưu lại tài sản yêu thích để nhận thông báo khi sắp kết thúc.</p>
            </Link>

            {/* Step 3 */}
            <Link to="/auctions" className="relative group block">
              <div className="w-24 h-24 mx-auto bg-gray-800 border-4 border-gray-900 rounded-3xl flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xl relative z-10">
                <FiAward className="w-10 h-10" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-500 text-white font-black rounded-full flex items-center justify-center text-sm border-4 border-gray-900">{!user ? '3' : '2'}</div>
              </div>
              <h3 className="text-xl font-bold mt-8 mb-3 group-hover:text-amber-400 transition-colors">Đặt giá & Chiến thắng</h3>
              <p className="text-gray-400 leading-relaxed px-4">Đưa ra mức giá tốt nhất, vượt qua các đối thủ cạnh tranh và mang về tài sản giá trị.</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
