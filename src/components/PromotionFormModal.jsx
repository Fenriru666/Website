import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';

function PromotionFormModal({ promotion, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        validity: '',
        promoCode: '',
        type: 'Giảm Giá',
        is_featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const isEditing = !!promotion;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                title: promotion.title || '',
                description: promotion.description || '',
                validity: promotion.validity || '',
                promoCode: promotion.promoCode || '',
                type: promotion.type || 'Giảm Giá',
                is_featured: !!promotion.is_featured
            });
            setImagePreview(promotion.imageUrl);
        } else {
            setFormData({ title: '', description: '', validity: '', promoCode: '', type: 'Giảm Giá', is_featured: false });
            setImagePreview('');
        }
    }, [promotion, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('validity', formData.validity);
        data.append('promoCode', formData.promoCode);
        data.append('type', formData.type);
        data.append('is_featured', formData.is_featured);
        if (imageFile) {
            data.append('imageUrl', imageFile);
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (isEditing) {
                await api.put(`/api/admin/promotions/${promotion.id}`, data, config);
                addNotification('Cập nhật khuyến mãi thành công!', 'success');
            } else {
                await api.post('/api/admin/promotions', data, config);
                addNotification('Thêm khuyến mãi mới thành công!', 'success');
            }
            onSuccess();
            onClose();
        } catch (error) {
            addNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Chỉnh Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi Mới'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thời hạn</label>
                        <input type="text" name="validity" value={formData.validity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Ví dụ: Đến hết 31/12/2025" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mã khuyến mãi (Nếu có)</label>
                        <input type="text" name="promoCode" value={formData.promoCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="Ví dụ: SALE50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại khuyến mãi</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            <option>Giảm Giá</option>
                            <option>Combo</option>
                            <option>Mua 1 Tặng 1</option>
                            <option>Sự kiện đặc biệt</option>
                            <option>Ưu đãi đặc biệt</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Hiển thị nổi bật ở trang chủ?</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                        <input type="file" name="imageUrl" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                        {imagePreview && <img src={imagePreview.startsWith('blob:') ? imagePreview : `http://localhost:5000${imagePreview}`} alt="Xem trước" className="mt-2 w-32 h-32 object-cover rounded" />}
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Hủy</button>
                        <button type="submit" disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-orange-300">
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PromotionFormModal;