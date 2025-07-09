import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './contexts/CartContext';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.086 3.208.24a48.108 48.108 0 013.478.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09.993-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);


function CartPage() {
  const { cartItems, updateQuantity, clearCart, cartTotalPrice, cartTotalItems } = useCart();
  const navigate = useNavigate();

  const getFullImageUrl = (imageUrl) => {
      if (!imageUrl) return 'https://via.placeholder.com/100x100?text=No+Image';
      if (imageUrl.startsWith('http')) return imageUrl;
      return `http://localhost:5000${imageUrl}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ Hàng Của Bạn</h1>
        <p className="text-xl text-gray-500 mb-8">Giỏ hàng hiện đang trống.</p>
        <Link
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Bắt đầu mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Giỏ Hàng Của Bạn ({cartTotalItems} sản phẩm)
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={getFullImageUrl(item.imageUrl)} 
                  alt={item.name} 
                  className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Giá: {Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </p>
                </div>
                <div className="flex items-center space-x-2 my-2 sm:my-0">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    aria-label="Giảm số lượng"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-12 text-center border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                    min="1"
                  />
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>
                <p className="font-semibold text-orange-600 w-28 text-center sm:text-right">
                  {(Number(item.price) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 space-y-4 self-start sticky top-24">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">Tổng Cộng</h2>
            <div className="flex justify-between text-gray-700">
              <span>Tạm tính ({cartTotalItems} sản phẩm):</span>
              <span>{Number(cartTotalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-800">
              <span>Thành tiền:</span>
              <span>{Number(cartTotalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <button 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300"
              onClick={() => navigate('/checkout')}
            >
              Tiến Hành Thanh Toán
            </button>
            <button 
              onClick={clearCart}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300 mt-2"
            >
              Xóa Toàn Bộ Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;