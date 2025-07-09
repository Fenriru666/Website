// src/Contact.jsx
import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form (ví dụ: gửi email, lưu vào database)
    // Hiện tại chỉ log ra console
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn lòng lắng nghe từ bạn! Đừng ngần ngại gửi cho chúng tôi câu hỏi, góp ý hoặc yêu cầu đặt bàn.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Phần Form Liên Hệ */}
          <section className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="bạn@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Góp ý về món ăn"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Nội dung tin nhắn</label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Nội dung bạn muốn gửi..."
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Gửi Tin Nhắn
                </button>
              </div>
            </form>
          </section>

          {/* Phần Thông Tin Liên Hệ Trực Tiếp */}
          <section className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Địa Chỉ Cửa Hàng
              </h3>
              <p className="text-gray-600 leading-relaxed">
                1106 Đường Phạm Thế Hiển, Phường 5, Quận 8, TP.HCM<br />
                Thành phố Hồ Chí Minh, Việt Nam
              </p>
              {/* Bạn có thể nhúng Google Maps vào đây */}
              <div className="mt-4 h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.89187184095!2d106.663985174882!3d10.742816289403958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e573afba3cd%3A0xc234f85f9f5d996d!2zMTEwNiDEkC4gUGjhuqFtIFRo4bq_IEhp4buDbiwgUGjGsOG7nW5nIDUsIFF14bqtbiA4LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1751488087550!5m2!1svi!2s"
                    className="w-full h-64"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade">
                 </iframe>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.155a11.034 11.034 0 005.516 5.516l1.155-2.308a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Điện Thoại
              </h3>
              <a href="tel:+84123456789" className="text-orange-600 hover:text-orange-700 transition-colors text-lg">
                (+84) 977859172
              </a>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email
              </h3>
              <a href="mailto:info@okamifood.com" className="text-orange-600 hover:text-orange-700 transition-colors text-lg">
                OkamiService@gmail.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Giờ Mở Cửa
              </h3>
              <ul className="text-gray-600 space-y-1">
                <li>Thứ 2 - Thứ 6: <span className="font-medium">10:00 - 22:00</span></li>
                <li>Thứ 7 - Chủ Nhật: <span className="font-medium">09:00 - 23:00</span></li>
                <li>Ngày lễ: <span className="font-medium">Theo thông báo</span></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;