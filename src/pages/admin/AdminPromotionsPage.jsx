import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNotification } from '../../contexts/NotificationContext';
import PromotionFormModal from '../../components/PromotionFormModal'; // Import modal

function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/promotions');
            setPromotions(response.data);
        } catch (error) {
            addNotification('Lỗi khi tải danh sách khuyến mãi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleDelete = async (promoId, promoTitle) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${promoTitle}"?`)) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/api/admin/promotions/${promoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                addNotification('Xóa khuyến mãi thành công!', 'success');
                fetchPromotions();
            } catch (error) {
                addNotification('Lỗi khi xóa khuyến mãi.', 'error');
            }
        }
    };

    const handleOpenAddModal = () => {
        setEditingPromotion(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (promotion) => {
        setEditingPromotion(promotion);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPromotion(null);
    };

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://via.placeholder.com/150?text=No+Image';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `http://localhost:5000${imageUrl}`;
    };
    
    if (loading) return <p>Đang tải danh sách khuyến mãi...</p>;

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Quản Lý Khuyến Mãi</h1>
                    <button onClick={handleOpenAddModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Thêm Khuyến Mãi
                    </button>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Hình ảnh</th>
                                <th className="px-4 py-2 text-left">Tiêu đề</th>
                                <th className="px-4 py-2 text-left">Loại</th>
                                <th className="px-4 py-2 text-left">Mã Code</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {promotions.map(promo => (
                                <tr key={promo.id}>
                                    <td className="px-4 py-2">{promo.id}</td>
                                    <td className="px-4 py-2">
                                        <img src={getFullImageUrl(promo.imageUrl)} alt={promo.title} className="w-16 h-16 object-cover rounded"/>
                                    </td>
                                    <td className="px-4 py-2 font-medium">{promo.title}</td>
                                    <td className="px-4 py-2">{promo.type}</td>
                                    <td className="px-4 py-2">{promo.promoCode || 'Không có'}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => handleOpenEditModal(promo)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                                        <button onClick={() => handleDelete(promo.id, promo.title)} className="text-red-600 hover:text-red-900">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <PromotionFormModal 
                    promotion={editingPromotion}
                    onClose={handleCloseModal}
                    onSuccess={fetchPromotions}
                />
            )}
        </>
    );
}

export default AdminPromotionsPage;