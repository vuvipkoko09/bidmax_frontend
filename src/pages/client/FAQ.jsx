import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: "Làm sao để nạp tiền vào ví?",
    answer: "Bạn có thể nạp tiền vào ví thông qua tính năng 'Nạp Tiền' trong mục 'Tài Khoản'. Hệ thống hiện đang hỗ trợ thanh toán qua Cổng VNPAY an toàn và tiện lợi. Sau khi giao dịch thành công, số dư sẽ tự động được cập nhật."
  },
  {
    question: "Tôi có cần đặt cọc trước khi đấu giá không?",
    answer: "Tuỳ thuộc vào từng phiên đấu giá. Một số phiên có giá trị cao hoặc yêu cầu cam kết từ người mua sẽ yêu cầu một khoản tiền cọc cố định. Nếu bạn không trúng đấu giá, tiền cọc sẽ được hoàn trả đầy đủ vào ví."
  },
  {
    question: "Trúng đấu giá nhưng không nhận hàng bị sao không?",
    answer: "Nếu bạn từ chối nhận hàng (boom hàng) mà không có lý do chính đáng (như hàng không đúng mô tả), bạn sẽ bị mất toàn bộ số tiền đã cọc. Ngoài ra, tài khoản của bạn sẽ bị hệ thống đánh giá uy tín thấp, nếu vi phạm nhiều lần có thể bị khoá vĩnh viễn."
  },
  {
    question: "Cách hệ thống tính phí giao hàng như thế nào?",
    answer: "Phí giao hàng được áp dụng một mức phí mặc định trên toàn quốc (Thường là 30.000 VNĐ). Tuy nhiên, nếu giá trị đơn hàng của bạn vượt quá hạn mức Freeship do hệ thống quy định (VD: Trên 5.000.000 VNĐ), bạn sẽ được miễn phí giao hàng hoàn toàn."
  },
  {
    question: "Làm sao để trở thành người bán?",
    answer: "Để đăng bán tài sản, bạn cần cập nhật thông tin cá nhân đầy đủ và yêu cầu nâng cấp lên tài khoản SELLER. Ban quản trị sẽ xét duyệt thông tin của bạn. Khi được duyệt, bạn sẽ có khu vực Quản Lý Sản Phẩm riêng."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Giải đáp những thắc mắc phổ biến của người dùng về hoạt động đấu giá.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'bg-slate-50 ring-1 ring-blue-500' : 'bg-white hover:border-slate-300'}`}
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={`font-semibold text-left ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <FiChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'transform rotate-180 text-blue-600' : 'text-gray-400'}`} 
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${isActive ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 leading-relaxed pt-2 border-t border-slate-200/60">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
