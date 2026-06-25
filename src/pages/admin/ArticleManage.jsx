import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ArticleManage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllArticles();
      // Sort PENDING to the top
      const sorted = res.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setArticles(sorted);
    } catch (error) {
      toast.error('Lỗi khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateArticleStatus(id, status);
      toast.success('Cập nhật trạng thái thành công');
      fetchArticles();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Ảnh bìa</th>
                <th className="px-6 py-4 w-1/3">Tiêu đề</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Đang tải...</td></tr>
              ) : articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{article.id}</td>
                  <td className="px-6 py-4">
                    <img src={article.thumbnail || 'https://via.placeholder.com/50'} alt="thumbnail" className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 line-clamp-2">{article.title}</td>
                  <td className="px-6 py-4">{article.authorName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      article.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      article.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => { setSelectedArticle(article); setShowPreview(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip" title="Xem trước">
                        <FiEye className="w-5 h-5" />
                      </button>
                      {article.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleStatusChange(article.id, 'APPROVED')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Duyệt">
                            <FiCheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleStatusChange(article.id, 'REJECTED')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Từ chối">
                            <FiXCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">Xem trước: {selectedArticle.title}</h2>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <img src={selectedArticle.thumbnail} alt="Cover" className="w-full h-64 object-cover rounded-xl mb-6" />
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
               <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Đóng</button>
               {selectedArticle.status === 'PENDING' && (
                  <>
                     <button onClick={() => { handleStatusChange(selectedArticle.id, 'REJECTED'); setShowPreview(false); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Từ chối</button>
                     <button onClick={() => { handleStatusChange(selectedArticle.id, 'APPROVED'); setShowPreview(false); }} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">Duyệt bài</button>
                  </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManage;
