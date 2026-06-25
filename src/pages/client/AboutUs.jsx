import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=2070&auto=format&fit=crop"
            alt="About Us Banner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Về Sàn Đấu Giá
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Chúng tôi tự hào là một trong những nền tảng đấu giá trực tuyến uy tín hàng đầu, kết nối người bán và người mua qua một hệ thống minh bạch, công bằng và an toàn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
              Tầm nhìn & Sứ mệnh
            </h3>
            <p className="mt-6 text-lg text-gray-600">
              Sứ mệnh của chúng tôi là mang lại giá trị thực cho từng sản phẩm. Bất kể là một tác phẩm nghệ thuật, đồ sưu tầm hay một món đồ công nghệ cũ, chúng tôi tin rằng mọi thứ đều có người trân trọng nó.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              Với tầm nhìn vươn ra khu vực, chúng tôi không ngừng cải tiến công nghệ, nâng cấp bảo mật và hoàn thiện dịch vụ chăm sóc khách hàng nhằm đem đến trải nghiệm đấu giá mượt mà nhất.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Our Team"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="mt-32">
          <h3 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Giá Trị Cốt Lõi</h3>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Minh Bạch</h4>
              <p className="text-gray-600">Mọi giao dịch, lịch sử đấu giá đều được công khai rõ ràng, đảm bảo tính công bằng cho tất cả các thành viên tham gia.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Bảo Mật</h4>
              <p className="text-gray-600">Áp dụng các công nghệ mã hoá và bảo vệ thông tin cá nhân tối tân. Tài sản của bạn luôn được giữ an toàn.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Tận Tâm</h4>
              <p className="text-gray-600">Đội ngũ hỗ trợ nhiệt tình 24/7 sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn trong suốt quá trình đấu giá.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
