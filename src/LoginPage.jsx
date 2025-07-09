import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import api from './api';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addNotification } = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/login', formData);
            const { user, token } = response.data;

            await login(user, token);
            
            addNotification(`Chào mừng quay trở lại, ${user.fullName}!`, 'success');
            
            // THAY ĐỔI Ở ĐÂY: Kiểm tra vai trò và chuyển hướng tương ứng
            if (user.role === 'admin') {
                navigate('/admin/dashboard'); // Chuyển hướng admin đến trang tổng quan
            } else {
                navigate('/'); // Chuyển hướng người dùng thường về trang chủ
            }

        } catch (err) {
            const message = err.response?.data?.message || 'Không thể kết nối đến server.';
            addNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Đăng Nhập Tài Khoản
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hoặc{' '}
                        <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                            đăng ký tài khoản mới
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Địa chỉ Email</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Địa chỉ Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Mật khẩu"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-300 disabled:bg-orange-300"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;