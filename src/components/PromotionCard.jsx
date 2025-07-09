import React from 'react';
import { Link } from 'react-router-dom';

function PromotionCard({ promotion }) {

  // Hàm để tạo đường dẫn hình ảnh hoàn chỉnh
  const getFullImageUrl = (imageUrl) => {
      if (!imageUrl) {
          return 'https://via.placeholder.com/400x200?text=Promotion';
      }
      if (imageUrl.startsWith('http')) {
          return imageUrl;
      }
      return `http://localhost:5000${imageUrl}`;
  };

  return (
    <Link 
      to={`/promotion/${promotion.id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105"
    >
      <img
        // SỬA LỖI Ở ĐÂY: Sử dụng hàm getFullImageUrl
        src={getFullImageUrl(promotion.imageUrl)}
        alt={promotion.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
          {promotion.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-3">
          {promotion.description}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100 space-y-1">
          {promotion.validity && (
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Hạn:</span> {promotion.validity}
            </p>
          )}
          {promotion.promoCode && (
            <p className="text-xs text-red-600 font-semibold">
              Mã: {promotion.promoCode}
            </p>
          )}        
        </div>
      </div>
    </Link>
  );
}

export default PromotionCard;