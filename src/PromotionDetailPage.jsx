import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';
import { useNotification } from './contexts/NotificationContext';

function PromotionDetailPage() {
  const { promoId } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return 'https://via.placeholder.com/600x300?text=Không+Có+Hình+Ảnh';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/promotions/${promoId}`);
        console.log('promotion.imageUrl:', response.data.imageUrl); // Debug
        setPromotion(response.data);
      } catch (err) {
        setError('Không tìm thấy chương trình khuyến mãi.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [promoId]);

  const handleCopyCode = () => {
    if (promotion && promotion.promoCode) {
      navigator.clipboard.writeText(promotion.promoCode);
      addNotification(`Đã sao chép mã: ${promotion.promoCode}`, 'success');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Đang tải chi tiết khuyến mãi...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-red-500 mb-4">{error}</p>
        <Link to="/promotion" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg">
          Xem các khuyến mãi khác
        </Link>
      </div>
    );
  }

  if (!promotion) return null;

  return (
    <div className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <img
            src={getFullImageUrl(promotion.imageUrl)}
            alt={promotion.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg mb-8"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x300?text=Không+Có+Hình+Ảnh';
            }}
          />
          <div className="bg-gray-50 p-8 rounded-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{promotion.title}</h1>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">{promotion.description}</p>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              {promotion.validity && (
                <div className="flex items-start">
                  <strong className="w-28 text-gray-700">Điều kiện:</strong>
                  <span className="flex-1 text-gray-600">{promotion.validity}</span>
                </div>
              )}
              {promotion.promoCode && (
                <div className="flex items-center">
                  <strong className="w-28 text-gray-700">Mã giảm giá:</strong>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-mono bg-orange-100 text-orange-700 px-4 py-1 rounded">
                      {promotion.promoCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      Sao chép
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <strong className="w-28 text-gray-700">Loại ưu đãi:</strong>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                  {promotion.type}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/menu"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
              >
                Áp dụng ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionDetailPage;