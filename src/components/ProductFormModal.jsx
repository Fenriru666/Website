import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNotification } from '../contexts/NotificationContext';

function ProductFormModal({ product, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Pizza',
        is_featured: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();

    const isEditing = !!product;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || 'Pizza',
                is_featured: !!product.is_featured
            });
            setImagePreview(product.imageUrl);
        } else {
            setFormData({ name: '', description: '', price: '', category: 'Pizza', is_featured: false });
            setImagePreview('');
        }
    }, [product, isEditing]);

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
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
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
                await api.put(`/api/admin/products/${product.id}`, data, config);
                addNotification('Cập nhật món ăn thành công!', 'success');
            } else {
                await api.post('/api/admin/products', data, config);
                addNotification('Thêm món ăn mới thành công!', 'success');
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
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên món ăn</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                            <option>Pizza</option>
                            <option>Burger</option>
                            <option>Salad</option>
                            <option>Mỳ Ý</option>
                            <option>Cơm</option>
                            <option>Gà Rán</option>
                            <option>Khai vị</option>
                            <option>Đồ uống</option>
                            <option>Tráng miệng</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Món ăn nổi bật?</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                        <input type="file" name="imageUrl" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                        {imagePreview && <img src={imagePreview} alt="Xem trước" className="mt-2 w-32 h-32 object-cover rounded" />}
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

export default ProductFormModal;