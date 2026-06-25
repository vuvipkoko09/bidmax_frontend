import React from 'react';
import { FiCalendar, FiArrowRight } from 'react-icons/fi';

const News = () => {
  // Mock data for news articles
  const featuredArticle = {
    id: 1,
    title: "Triển lãm Đồng hồ & Trang sức cao cấp 2026: Những xu hướng định hình tương lai",
    excerpt: "Khám phá những bộ sưu tập độc quyền và công nghệ chế tác tinh xảo nhất vừa được ra mắt tại sự kiện thường niên lớn nhất của giới thượng lưu.",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200",
    date: "15 Tháng 6, 2026",
    category: "Sự kiện"
  };

  const articles = [
    {
      id: 2,
      title: "Cẩm nang: Cách phân biệt túi Hermes Birkin thật và giả",
      excerpt: "Những chuyên gia kiểm định hàng đầu của BidMax chia sẻ bí quyết nhận diện hàng chuẩn authentic.",
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600",
      date: "12 Tháng 6, 2026",
      category: "Kiến thức"
    },
    {
      id: 3,
      title: "Phiên đấu giá mùa Hè: Bộ sưu tập siêu xe cổ điển lộ diện",
      excerpt: "Danh sách 10 mẫu xe thể thao huyền thoại sẽ xuất hiện trên sàn đấu giá BidMax vào tháng tới.",
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600",
      date: "10 Tháng 6, 2026",
      category: "Tin tức"
    },
    {
      id: 4,
      title: "Đầu tư Nghệ thuật: Lợi nhuận vượt trội thời kỳ lạm phát?",
      excerpt: "Phân tích từ chuyên gia tài chính về việc biến các tác phẩm hội họa thành hầm trú ẩn tài sản an toàn.",
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=600",
      date: "05 Tháng 6, 2026",
      category: "Thị trường"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Tạp chí BidMax</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Cập nhật những tin tức nóng hổi, bài phân tích chuyên sâu và cẩm nang từ các chuyên gia hàng đầu trong giới sưu tầm và đấu giá.
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12 group cursor-pointer border border-gray-100 hover:shadow-lg transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="overflow-hidden h-64 md:h-auto">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm font-semibold mb-4">
                <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{featuredArticle.category}</span>
                <span className="text-gray-400 flex items-center gap-1.5"><FiCalendar /> {featuredArticle.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold group/btn">
                <span>Đọc toàn bộ bài viết</span>
                <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all flex flex-col">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-gray-400 font-semibold flex items-center gap-1.5 mb-3">
                  <FiCalendar /> {article.date}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-blue-600 text-sm font-bold mt-auto">
                  <span>Đọc tiếp</span>
                  <FiArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default News;
