import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <FiAlertOctagon className="w-12 h-12 text-red-600 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          403 - Truy cập bị từ chối
        </h1>
        
        <p className="text-lg text-gray-600 font-medium pb-4">
          Rất tiếc! Bạn không có quyền truy cập vào trang này hoặc thực hiện hành động này.
        </p>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <FiArrowLeft className="w-5 h-5" />
          Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
