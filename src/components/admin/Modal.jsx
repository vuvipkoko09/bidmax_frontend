import React from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, onSubmit, onCancel, isSubmitting, submitText = 'Lưu', formId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Form) */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          )}
          {(onSubmit || formId) && (
            <button
              type={formId ? "submit" : "button"}
              form={formId}
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Đang lưu...' : submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
