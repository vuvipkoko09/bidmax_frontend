import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { Rating } from 'react-simple-star-rating';
import { FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Review form states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const articleData = await adminService.getArticleById(id);
      setArticle(articleData);
      
      const reviewsData = await adminService.getReviewsByArticle(id);
      setReviews(reviewsData);
    } catch (error) {
      toast.error('Không tìm thấy bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao');
      return;
    }
    if (!comment.trim()) {
      toast.error('Vui lòng nhập bình luận');
      return;
    }
    try {
      setIsSubmitting(true);
      await adminService.addArticleReview(id, {
        userId: user.id,
        rating,
        comment
      });
      toast.success('Gửi đánh giá thành công!');
      setRating(0);
      setComment('');
      fetchData(); // Refresh reviews
    } catch (error) {
      toast.error('Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="text-center py-20 text-gray-500 font-semibold">Đang tải...</div>;
  if (!article) return <div className="text-center py-20 text-red-500 font-semibold">Bài viết không tồn tại.</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toaster />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/articles" className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:underline">
          <FiArrowLeft /> Quay lại danh sách
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 font-medium">
            <span className="flex items-center gap-1.5"><FiUser /> {article.authorName}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5"><FiClock /> {new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-8">{article.title}</h1>
          
          {article.thumbnail && (
            <img src={article.thumbnail} alt="cover" className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-10" />
          )}

          {/* Render HTML content */}
          <div className="prose prose-lg max-w-none prose-blue" dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            Đánh giá bài viết 
            <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-lg">★ {averageRating}</span>
          </h3>

          {/* Form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">Viết đánh giá của bạn</h4>
              <div className="mb-4">
                <Rating 
                  onClick={setRating} 
                  initialValue={rating} 
                  size={32} 
                  fillColor="#f59e0b" 
                  emptyColor="#e5e7eb"
                />
              </div>
              <textarea 
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Bài viết rất hữu ích..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none mb-4 resize-none h-28"
              ></textarea>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </form>
          ) : (
            <div className="bg-blue-50 p-6 rounded-2xl mb-10 text-center border border-blue-100">
              <p className="text-blue-800 font-semibold mb-3">Vui lòng đăng nhập để đánh giá bài viết này</p>
              <Link to="/auth" className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Đăng nhập</Link>
            </div>
          )}

          {/* List Reviews */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-center text-gray-500 py-6">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold rounded-full uppercase">
                      {review.userName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{review.userName}</div>
                      <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString('vi-VN')}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                     <Rating initialValue={review.rating} size={16} readonly fillColor="#f59e0b" />
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetail;
