import React, { useEffect, useState } from 'react';
import { FiStar, FiSend } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

import API from '../../services/api';

const Reviews = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!reviewerName.trim() || !reviewContent.trim()) {
      toast.error("Vui lòng điền đầy đủ tên và nội dung!");
      return;
    }
    toast.success("Cảm ơn bạn! Đánh giá sẽ được hiển thị sau khi duyệt.");
    setRating(0);
    setReviewerName("");
    setReviewContent("");
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await API.get('/reviews');
        if (res.data && res.data.length > 0) {
          const dbReviews = res.data.map((r, idx) => ({
            id: r.id,
            name: r.reviewerName || "Thành viên BidMax",
            role: "Khách hàng cá nhân",
            avatar: `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`,
            rating: r.ratingStar || 5,
            date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
            content: r.comment || "Không có nội dung"
          }));
          setReviews(dbReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Tiếng nói từ Khách hàng</h1>
          <p className="text-lg text-gray-600 mb-8">
            Niềm tin của khách hàng là tài sản lớn nhất của chúng tôi. Hãy xem cộng đồng nói gì về trải nghiệm đấu giá tại BidMax.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 inline-flex">
            <div className="flex items-center gap-1.5">
              {renderStars(5)}
            </div>
            <div className="text-left border-l-2 border-gray-100 pl-6">
              <div className="text-2xl font-bold text-gray-900">4.9 / 5.0</div>
              <div className="text-sm text-gray-500 font-medium">Dựa trên 1,000+ lượt đánh giá</div>
            </div>
          </div>
        </div>

        {/* Reviews Masonry/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full ring-2 ring-gray-100 object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{review.role}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Viết Đánh Giá */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chia sẻ trải nghiệm của bạn</h2>
            <p className="text-gray-500">Đánh giá của bạn giúp BidMax ngày càng hoàn thiện hơn</p>
          </div>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <span className="text-sm font-semibold text-gray-700">Chất lượng dịch vụ</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <FiStar className={`w-8 h-8 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và Tên</label>
                <input 
                  type="text" 
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nhập tên của bạn..."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá</label>
                <textarea 
                  rows="4" 
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Hãy chia sẻ cảm nhận của bạn về quá trình đấu giá, thanh toán, hỗ trợ..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
              >
                Gửi đánh giá <FiSend />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Reviews;
