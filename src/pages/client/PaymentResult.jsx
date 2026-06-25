import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get('vnp_ResponseCode');
  const transactionNo = searchParams.get('vnp_TransactionNo');

  const isSuccess = responseCode === '00';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nạp tiền thành công!</h2>
            <p className="text-gray-500 mb-6">
              Giao dịch của bạn đã được VNPAY xử lý thành công. Số dư ví đã được cập nhật.
            </p>
            {transactionNo && (
              <div className="bg-gray-50 rounded-lg px-4 py-3 w-full mb-8 flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Mã giao dịch:</span>
                <span className="font-bold text-gray-900">{transactionNo}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
              <FiXCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giao dịch thất bại</h2>
            <p className="text-gray-500 mb-8">
              Rất tiếc, giao dịch của bạn đã bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán.
            </p>
          </div>
        )}

        <Link 
          to="/profile" 
          className="inline-flex w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          Quay lại ví của tôi
        </Link>
      </div>
    </div>
  );
};

export default PaymentResult;
