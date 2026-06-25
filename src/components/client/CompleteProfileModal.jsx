import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Hoàn thiện hồ sơ để đấu giá
        </h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Vui lòng cung cấp Số điện thoại và Địa chỉ để đảm bảo quyền lợi khi bạn thắng cuộc.
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Để sau
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/profile');
            }}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Cập nhật ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
