import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from './contexts/NotificationContext'; // 1. Import hook thông báo
import api from './api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification(); // 2. Lấy hàm addNotification từ context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addNotification('Mật khẩu xác nhận không khớp!', 'error'); // Hiển thị lỗi qua notification
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // 3. Thay thế alert() bằng thông báo thành công
      addNotification('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
      navigate('/login');

    } catch (err) {
      // 4. Hiển thị lỗi từ server qua notification
      const message = err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      addNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tạo Tài Khoản Mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
              đăng nhập nếu bạn đã có tài khoản
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Không cần hiển thị lỗi ở đây nữa vì đã có hệ thống notification toàn cục */}
          <div>
            <label htmlFor="full-name" className="sr-only">Họ và Tên</label>
            <input
              id="full-name"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm mb-2"
              placeholder="Họ và Tên"
            />
          </div>
          <div>
            <label htmlFor="email-address-register" className="sr-only">Địa chỉ Email</label>
            <input
              id="email-address-register"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm mb-2"
              placeholder="Địa chỉ Email"
            />
          </div>
          <div>
            <label htmlFor="password-register" className="sr-only">Mật khẩu</label>
            <input
              id="password-register"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm mb-2"
              placeholder="Mật khẩu"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">Xác nhận Mật khẩu</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận Mật khẩu"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-300 disabled:bg-teal-300"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;