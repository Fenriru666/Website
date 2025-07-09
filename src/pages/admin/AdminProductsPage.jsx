import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNotification } from '../../contexts/NotificationContext';
// THAY ĐỔI TẠI ĐÂY: Import đúng modal cho Sản phẩm
import ProductFormModal from '../../components/ProductFormModal';

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/menu');
            setProducts(response.data);
        } catch (error) {
            addNotification('Lỗi khi tải danh sách sản phẩm.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    const handleDelete = async (productId, productName) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa món ăn "${productName}"?`)) {
            try {
                const token = localStorage.getItem('token');
                await api.delete(`/api/admin/products/${productId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                addNotification('Xóa món ăn thành công!', 'success');
                fetchProducts();
            } catch (error) {
                addNotification(error.response?.data?.message || 'Lỗi khi xóa món ăn.', 'error');
            }
        }
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/150?text=No+Image';
        }
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    if (loading) return <div className="text-center py-10">Đang tải danh sách món ăn...</div>;

    return (
        <>
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quản Lý Món Ăn</h1>
                    <button onClick={handleOpenAddModal} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors">
                        Thêm Món Mới
                    </button>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Hình ảnh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên Món Ăn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Danh mục</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Giá</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.id}</td>
                                    <td className="px-6 py-4">
                                        <img src={getFullImageUrl(product.imageUrl)} alt={product.name} className="w-16 h-16 object-cover rounded"/>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">{Number(product.price).toLocaleString('vi-VN')} ₫</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* THAY ĐỔI TẠI ĐÂY: Sử dụng đúng component ProductFormModal */}
            {isModalOpen && (
                <ProductFormModal 
                    product={editingProduct}
                    onClose={handleCloseModal}
                    onSuccess={fetchProducts}
                />
            )}
        </>
    );
}

export default AdminProductsPage;