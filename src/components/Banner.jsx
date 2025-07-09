// src/components/Banner.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-r-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Ưu Đãi Đặc Biệt!</h3>
      <img
        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=60"
        alt="Banner Quảng Cáo Pizza"
        className="w-full h-auto rounded-md mb-3 shadow-md"
      />
      <p className="text-sm text-gray-800 mb-4">
        Giảm giá <strong>30%</strong> cho tất cả các loại Pizza vào mỗi cuối tuần. Đừng bỏ lỡ!
      </p>
      <Link
        to="/promotion"
        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Xem Ngay
      </Link>
    </div>
  );
}

export default Banner;