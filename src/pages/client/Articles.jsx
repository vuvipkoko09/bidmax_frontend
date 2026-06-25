import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await adminService.getApprovedArticles();
      setArticles(res);
    } catch (error) {
      toast.error('Lỗi khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }
    try {
      setIsSubmitting(true);
      let thumbnailUrl = '';
      if (thumbnailFile) {
        const uploadRes = await adminService.uploadFile(thumbnailFile);
        thumbnailUrl = uploadRes.fileUrl;
      }

      await adminService.createArticle({
        title,
        content,
        thumbnail: thumbnailUrl,
        authorId: user.id
      });
      toast.success('Gửi bài viết thành công! Vui lòng chờ kiểm duyệt.');
      setShowCreateModal(false);
      setTitle('');
      setContent('');
      setThumbnailFile(null);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Tin Tức Sàn Đấu Giá</h1>
          <button 
            onClick={() => {
              if (user) {
                setShowCreateModal(true);
              } else {
                toast.error('Vui lòng đăng nhập để viết bài!');
                navigate('/auth');
              }
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            + Viết bài mới
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold text-lg">Đang tải bài viết...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">Chưa có bài viết nào được duyệt.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link to={`/articles/${article.id}`} key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <img src={article.thumbnail || 'https://via.placeholder.com/400x250'} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-blue-600 font-bold mb-2 uppercase tracking-wide">Tin tức</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">{article.title}</h3>
                  <div className="mt-auto pt-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-50">
                    <span className="font-semibold">{article.authorName}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal Đăng Bài */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">Đăng Bài Viết Mới</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề bài viết</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none" placeholder="Nhập tiêu đề..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa (Thumbnail)</label>
                <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files[0])} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
              <div className="h-64 mb-10">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung</label>
                <ReactQuill theme="snow" value={content} onChange={setContent} className="h-48" />
              </div>
            </form>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">Hủy</button>
              <button type="submit" onClick={handleCreateSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? 'Đang gửi...' : 'Gửi bài kiểm duyệt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
