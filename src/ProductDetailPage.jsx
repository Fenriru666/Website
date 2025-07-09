import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';
import { useCart } from './contexts/CartContext';
import { useNotification } from './contexts/NotificationContext';

// --- Icon cho nút thêm vào giỏ hàng ---
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

function ProductDetailPage() {
    // Lấy ID sản phẩm từ URL
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy các hàm cần thiết từ context
    const { addToCart } = useCart();
    const { addNotification } = useNotification();

    // 1. Fetch dữ liệu sản phẩm từ API khi component được tải
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Gọi API để lấy chi tiết món ăn dựa trên productId
                const response = await api.get(`/api/menu/${productId}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", err);
                setError('Không tìm thấy món ăn bạn yêu cầu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]); // Chạy lại hiệu ứng này mỗi khi productId thay đổi

    // 2. Hàm xử lý khi người dùng nhấn nút "Thêm vào giỏ"
    const handleAddToCart = () => {
        if (product) {
            addToCart(product); // Gọi hàm từ CartContext
            addNotification(`${product.name} đã được thêm vào giỏ!`, 'success'); // Hiển thị thông báo
        }
    };

    // Hàm để tạo đường dẫn ảnh hoàn chỉnh
    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return 'https://via.placeholder.com/800x600?text=Okami+Food';
        }
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        // Sử dụng URL của backend từ `api.js` để tạo đường dẫn tuyệt đối
        return `http://localhost:5000${imageUrl}`;
    };


    // --- Giao diện (UI) ---
    if (loading) {
        return <div className="text-center py-20 text-xl">Đang tải chi tiết món ăn...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-2xl text-red-500 mb-4">{error}</p>
                <Link to="/menu" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg">
                    Quay lại Thực đơn
                </Link>
            </div>
        );
    }
    
    // Khi không có lỗi và không loading nhưng không có sản phẩm
    if (!product) return null;

    // 3. Render chi tiết sản phẩm
    return (
        <div className="bg-white py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                    {/* Cột hình ảnh */}
                    <div>
                        <img 
                            src={getFullImageUrl(product.imageUrl)} 
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-lg shadow-xl"
                        />
                    </div>

                    {/* Cột thông tin sản phẩm */}
                    <div className="flex flex-col justify-center">
                        <span className="bg-orange-100 text-orange-800 text-sm font-medium mb-3 px-2.5 py-0.5 rounded-full self-start">
                            {product.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-4xl font-bold text-orange-600">
                                {Number(product.price).toLocaleString('vi-VN')} ₫
                            </span>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={handleAddToCart}
                                className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                            >
                                <PlusIcon />
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;