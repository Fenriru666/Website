// src/ChangePasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function ChangePasswordPage() {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Mật khẩu mới không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.put('/api/profile/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess('Đổi mật khẩu thành công! Bạn sẽ được chuyển về trang hồ sơ sau 3 giây.');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                navigate('/profile');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-lg">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Đổi Mật Khẩu</h1>
                    
                    {error && <div className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</div>}
                    {success && <div className="text-green-700 bg-green-100 p-3 rounded-md text-center">{success}</div>}
                    
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Quay Lại
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? 'Đang xử lý...' : 'Xác Nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordPage;