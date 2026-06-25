import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 bg-white rounded-2xl shadow-sm border border-slate-100 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">Điều Khoản Dịch Vụ & Chính Sách</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Chấp nhận điều khoản</h2>
            <p>Bằng việc truy cập và sử dụng dịch vụ của Sàn Đấu Giá, bạn đồng ý tuân thủ toàn bộ các điều khoản và quy định được liệt kê dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng ngừng sử dụng dịch vụ.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Đăng ký tài khoản</h2>
            <p>Người dùng phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi tạo tài khoản. Bạn hoàn toàn chịu trách nhiệm bảo mật thông tin đăng nhập của mình. Bất kỳ giao dịch nào thực hiện thông qua tài khoản của bạn đều được coi là do chính bạn thực hiện.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Quy định tham gia đấu giá</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Người dùng phải có đủ số dư cọc để tham gia các phiên đấu giá yêu cầu cọc.</li>
              <li>Mỗi lượt đặt giá là một cam kết pháp lý. Người dùng không thể rút lại giá đã đặt.</li>
              <li>Hành vi đặt giá ảo, phá rối phiên đấu giá sẽ dẫn đến việc khóa tài khoản vĩnh viễn và có thể chịu trách nhiệm pháp lý.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Trách nhiệm người bán & người mua</h2>
            <p><strong>Người bán:</strong> Đảm bảo mô tả sản phẩm trung thực, chính xác và chịu trách nhiệm về chất lượng sản phẩm giao đến tay người mua.</p>
            <p className="mt-2"><strong>Người mua:</strong> Khi trúng đấu giá, người mua có nghĩa vụ thanh toán toàn bộ giá trị sản phẩm trong thời gian quy định. Từ chối nhận hàng mà không có lý do chính đáng (sản phẩm lỗi/khác mô tả) sẽ bị mất cọc và hạ uy tín tài khoản.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Giải quyết tranh chấp</h2>
            <p>Sàn Đấu Giá đóng vai trò trung gian hỗ trợ hai bên giải quyết tranh chấp. Quyết định cuối cùng của Ban Quản Trị dựa trên các bằng chứng thu thập được là quyết định có hiệu lực cao nhất.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
