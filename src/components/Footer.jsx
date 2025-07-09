import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon = ({ platform, children }) => (
  <a href="#" aria-label={platform} className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
    {children}
  </a>
);

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 pt-16 pb-8">
      {/* THAY ĐỔI Ở ĐÂY: Tăng padding ngang (px) để đẩy nội dung vào trong */}
      <div className="container mx-auto px-8 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold text-orange-600 mb-3">Okami Food</h3>
            <p className="text-gray-400 leading-relaxed">
              Mang đến những trải nghiệm ẩm thực tuyệt vời với nguyên liệu tươi ngon và công thức độc đáo.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-orange-400 transition-colors">Về Chúng Tôi</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Thực Đơn</Link></li>
              <li><Link to="/promotion" className="hover:text-orange-400 transition-colors">Khuyến Mãi</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Liên Hệ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Chính Sách</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-orange-400 transition-colors">Câu Hỏi Thường Gặp</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">Chính Sách Bảo Mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Giờ Mở Cửa</h4>
            <div className="text-sm text-gray-400 space-y-1">
                <p>Thứ 2 - Thứ 6:</p>
                <p className="font-semibold">10:00 - 22:00</p>
                <p className="mt-2">Thứ 7 - Chủ Nhật:</p>
                <p className="font-semibold">09:00 - 23:00</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Theo Dõi</h4>
            <div className="flex space-x-4 mb-4">
              <SocialIcon platform="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.692v-3.622h3.126V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"></path></svg>
              </SocialIcon>
              <SocialIcon platform="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.059 1.689.073 4.948.073 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </SocialIcon>
              <SocialIcon platform="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.21 0-.42-.015-.63.961-.689 1.796-1.555 2.457-2.549z"></path></svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Okami Food. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;