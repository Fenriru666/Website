import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(item);
    addNotification(`${item.name} đã được thêm vào giỏ!`, 'info');
  };
  
  // Hàm để tạo đường dẫn hình ảnh hoàn chỉnh
  const getFullImageUrl = (imageUrl) => {
      if (!imageUrl) {
          return 'https://via.placeholder.com/300x200?text=No+Image';
      }
      if (imageUrl.startsWith('http')) {
          return imageUrl;
      }
      return `http://localhost:5000${imageUrl}`;
  };

  return (
    <Link to={`/menu/${item.id}`} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col group">
      <div className="overflow-hidden">
        <img 
          src={getFullImageUrl(item.imageUrl)}
          alt={item.name} 
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300" 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow"> 
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate" title={item.name}>{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{item.description}</p>
        <div className="mt-auto">
          <p className="text-lg font-bold text-orange-500 mb-3">
            {Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 text-sm rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 z-10 relative"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MenuItemCard;