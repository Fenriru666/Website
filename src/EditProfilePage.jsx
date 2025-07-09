import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import api from './api';

function EditProfilePage() {
    const { currentUser, updateUser, isLoggedIn } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
             navigate('/login');
        } else if (currentUser) {
            setFormData({
                fullName: currentUser.fullName || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
            });
            setAvatarPreview(currentUser.avatarUrl ? `http://localhost:5000${currentUser.avatarUrl}` : '');
        }
    }, [currentUser, isLoggedIn, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Sử dụng FormData để gửi cả dữ liệu văn bản và tệp
        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        if (avatarFile) {
            data.append('avatar', avatarFile);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/api/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Cập nhật thông tin người dùng trong context và localStorage
            updateUser(response.data.user);
            addNotification('Cập nhật thông tin thành công!', 'success');
            navigate('/profile'); // Quay về trang profile

        } catch (err) {
            const message = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            addNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl space-y-6">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Chỉnh Sửa Thông Tin</h1>
                    
                    <div className="flex flex-col items-center space-y-4">
                        <img 
                            src={avatarPreview || 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg'}
                            alt="Xem trước avatar" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                        />
                        <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md">
                            Thay đổi ảnh
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"></textarea>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300">
                            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfilePage;