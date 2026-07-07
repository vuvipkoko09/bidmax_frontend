import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import publicService from '../../services/publicService';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await publicService.sendContactMessage(data);
      toast.success("Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm!");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Liên Hệ Với Chúng Tôi</h1>
          <p className="mt-4 text-lg text-gray-600">
            Bạn có câu hỏi, góp ý hay cần hỗ trợ? Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn trong thời gian sớm nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Left Column: Contact Info & Map */}
          <div className="bg-slate-900 text-white p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Thông Tin Liên Hệ</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <FiMapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Địa chỉ văn phòng</h4>
                    <p className="text-slate-400 mt-1">20A Tăng Nhơn Phú, Hiệp Phú, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <FiPhone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Hotline hỗ trợ</h4>
                    <p className="text-slate-400 mt-1">0386342682</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <FiMail className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Email</h4>
                    <p className="text-slate-400 mt-1">vuvipkoko08@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <FiClock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Giờ làm việc</h4>
                    <p className="text-slate-400 mt-1">Thứ 2 - Thứ 6: 08:00 - 17:30<br />Thứ 7: 08:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="mt-12 rounded-xl overflow-hidden h-64 border border-slate-700 relative z-10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3253162688755!2d106.66539207480509!3d10.78637698936306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c80767d%3A0x5a981a5ef2e411b!2sViettel%20Complex%20Building!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-10 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Gửi tin nhắn cho chúng tôi</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('fullName', { required: 'Vui lòng nhập họ và tên' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ"
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  {...register('subject', { required: 'Vui lòng nhập tiêu đề' })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Vấn đề bạn cần hỗ trợ..."
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
                <textarea
                  {...register('message', { required: 'Vui lòng nhập nội dung tin nhắn' })}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Mô tả chi tiết vấn đề của bạn..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi tin nhắn"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
