// src/About.jsx
import React from 'react';

function About() {
  return (
    <div className="bg-white py-12 md:py-16"> {/* Nền trắng cho trang About, padding tổng thể */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Tiêu đề và Lời mở đầu */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4">
            Về Okami Food
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Chào mừng bạn đến với Okami Food! Chúng tôi không chỉ phục vụ những bữa ăn ngon, mà còn mang đến những trải nghiệm ẩm thực đáng nhớ, nơi hương vị truyền thống hòa quyện cùng sự sáng tạo hiện đại.
          </p>
        </section>

        {/* Section 2: Câu Chuyện Của Chúng Tôi */}
        <section className="mb-12 md:mb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Câu Chuyện Của Chúng Tôi</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Okami Food được thành lập vào năm 2023 từ niềm đam mê cháy bỏng với ẩm thực và ước mơ xây dựng một không gian nơi mọi người có thể cùng nhau thưởng thức những món ăn chất lượng trong một bầu không khí ấm cúng. Tên gọi "Okami" - có nghĩa là "sói" trong tiếng Nhật, cũng là biểu tượng của sự mạnh mẽ, thông minh và tinh thần đồng đội - những giá trị mà chúng tôi luôn theo đuổi.
                </p>
                <p>
                  Từ những ngày đầu tiên với một thực đơn nhỏ và vài chiếc bàn, chúng tôi đã không ngừng lắng nghe, học hỏi và cải tiến để mang đến những sản phẩm và dịch vụ tốt nhất. Mỗi món ăn tại Okami Food đều là kết tinh của sự tận tâm, từ việc lựa chọn nguyên liệu kỹ lưỡng đến công thức chế biến độc đáo được phát triển bởi đội ngũ đầu bếp tài năng của chúng tôi.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Đầu bếp Okami Food đang chuẩn bị món ăn" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Sứ Mệnh & Giá Trị Cốt Lõi */}
        <section className="bg-gray-50 py-12 md:py-16 rounded-lg mb-12 md:mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Sứ Mệnh & Giá Trị</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">Sứ Mệnh</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tại Okami Food, sứ mệnh của chúng tôi là làm phong phú thêm cuộc sống của mọi người thông qua những trải nghiệm ẩm thực vượt trội, kết nối cộng đồng bằng những bữa ăn ngon và dịch vụ tận tâm.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-orange-600 mb-2">Giá Trị Cốt Lõi</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 leading-relaxed">
                  <li><strong className="font-medium">Chất Lượng:</strong> Cam kết nguyên liệu tươi ngon và quy trình chế biến đạt chuẩn.</li>
                  <li><strong className="font-medium">Sáng Tạo:</strong> Luôn tìm tòi, đổi mới để mang đến hương vị độc đáo.</li>
                  <li><strong className="font-medium">Tận Tâm:</strong> Khách hàng là trung tâm, phục vụ bằng cả trái tim.</li>
                  <li><strong className="font-medium">Cộng Đồng:</strong> Xây dựng mối quan hệ bền vững và đóng góp tích cực.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Cam Kết Về Chất Lượng */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Cam Kết Về Chất Lượng</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Icon placeholder - bạn có thể dùng SVG */}
              <div className="text-orange-500 text-4xl mb-3 mx-auto w-fit">☀️</div> 
              <h4 className="text-lg font-semibold text-gray-700 mb-1">Nguyên Liệu Tươi Mới</h4>
              <p className="text-sm text-gray-600">Chúng tôi lựa chọn nguyên liệu tươi sạch mỗi ngày từ các nhà cung cấp uy tín.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-4xl mb-3 mx-auto w-fit">🍳</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-1">Công Thức Độc Đáo</h4>
              <p className="text-sm text-gray-600">Những công thức được nghiên cứu kỹ lưỡng, mang đến hương vị đặc trưng.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-orange-500 text-4xl mb-3 mx-auto w-fit">❤️</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-1">Phục Vụ Tận Tình</h4>
              <p className="text-sm text-gray-600">Đội ngũ nhân viên luôn sẵn sàng mang đến trải nghiệm tốt nhất cho bạn.</p>
            </div>
          </div>
        </section>

        {/* Section 5: Không Gian Của Chúng Tôi (Tùy chọn) */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Không Gian Tại Okami Food</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=80" alt="Không gian nhà hàng Okami Food 1" className="rounded-lg shadow-lg w-full h-64 object-cover"/>
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGludGVyaW9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=80" alt="Không gian nhà hàng Okami Food 2" className="rounded-lg shadow-lg w-full h-64 object-cover"/>
            {/* Bạn có thể thêm nhiều ảnh hơn */}
          </div>
          <p className="mt-6 text-gray-600">
            Hãy đến và trải nghiệm không gian ấm cúng, hiện đại của chúng tôi!
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;