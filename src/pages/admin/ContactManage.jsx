import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { FiMail, FiCheckCircle, FiSearch, FiMessageSquare } from 'react-icons/fi';

const ContactManage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal states for reading message
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markContactAsRead(id);
      toast.success('Đã đánh dấu là đã đọc');
      setContacts(contacts.map(c => c.id === id ? { ...c, isRead: true } : c));
      
      // Update modal state if open
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const openMessageModal = (contact) => {
    setSelectedMessage(contact);
    setIsModalOpen(true);
    if (!contact.isRead) {
      handleMarkAsRead(contact.id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const filteredContacts = contacts.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (c.fullName && c.fullName.toLowerCase().includes(searchLower)) || 
      (c.email && c.email.toLowerCase().includes(searchLower)) ||
      (c.subject && c.subject.toLowerCase().includes(searchLower));
      
    if (filterStatus === 'UNREAD') return matchesSearch && !c.isRead;
    if (filterStatus === 'READ') return matchesSearch && c.isRead;
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Header and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quản lý Liên hệ</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý tin nhắn từ trang liên hệ của khách hàng</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Tìm tên, email, tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Tất cả</option>
              <option value="UNREAD">Chưa đọc</option>
              <option value="READ">Đã đọc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Đang tải dữ liệu...
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FiMessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p>Không tìm thấy tin nhắn liên hệ nào.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Người gửi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 transition-colors ${!contact.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{contact.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">{contact.fullName}</div>
                    <div className="text-xs text-gray-500">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate font-medium">{contact.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {contact.isRead ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã đọc
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Chưa đọc
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openMessageModal(contact)}
                      className="text-blue-600 hover:text-blue-900 mx-2 font-bold cursor-pointer"
                    >
                      Xem chi tiết
                    </button>
                    {!contact.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(contact.id)}
                        className="text-emerald-600 hover:text-emerald-900 font-bold cursor-pointer"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message Detail Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiMail className="text-blue-600" /> Chi tiết tin nhắn
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Người gửi</p>
                  <p className="text-sm font-bold text-gray-900">{selectedMessage.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm text-blue-600 font-medium">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Thời gian gửi</p>
                  <p className="text-sm text-gray-700">{new Date(selectedMessage.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trạng thái</p>
                  <p className="text-sm font-medium">
                    {selectedMessage.isRead ? (
                      <span className="text-emerald-600 flex items-center gap-1"><FiCheckCircle /> Đã đọc</span>
                    ) : (
                      <span className="text-rose-600">Chưa đọc</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tiêu đề</p>
                <p className="text-lg font-bold text-gray-900 mb-4">{selectedMessage.subject}</p>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nội dung tin nhắn</p>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContactManage;
