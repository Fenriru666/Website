import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItemCard from './components/MenuItemCard.jsx'; 
import PromotionCard from './components/PromotionCard.jsx';
import api from './api';

// --- PHẦN KHÔI PHỤC LẠI: ICON VÀ DỮ LIỆU CHO SIDEBAR ---
const NewDishesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/></svg>;
const BestSellerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>;
const TodaysSpecialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 9h.01"/><path d="m15 9-6 6"/><path d="M15 15h.01"/></svg>;
// ----------------------------------------------------

function Home() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredPromotions, setFeaturedPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- PHẦN KHÔI PHỤC LẠI: DỮ LIỆU VÀ LOGIC CHO SIDEBAR ---
  const quickLinks = [
    { name: 'Món Mới', icon: <NewDishesIcon />, path: '/menu' },
    { name: 'Bán Chạy', icon: <BestSellerIcon />, path: '/menu' },
    { name: 'Ưu Đãi Hôm Nay', icon: <TodaysSpecialIcon />, path: '/promotion' },
  ];
  
  const initialDuration = 45 * 60 + 10;
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };
  // ----------------------------------------------------

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, promosResponse] = await Promise.all([
          api.get('/api/menu/featured'),
          api.get('/api/promotions/featured')
        ]);
        setFeaturedItems(itemsResponse.data);
        setFeaturedPromotions(promosResponse.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedData();
  }, []);

  return (
    <div className="space-y-16 md:space-y-20">
      <section 
        className="relative bg-cover bg-center text-white py-20 md:py-32" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1170&q=80')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto text-center relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Chào mừng đến <span className="text-orange-400">Okami Food!</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Nơi hương vị tuyệt hảo gặp gỡ chất lượng đỉnh cao, mang đến những trải nghiệm ẩm thực khó quên.
          </p>
          <Link 
            to="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-10 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Xem Thực Đơn Ngay
          </Link>
        </div>
      </section>

      {/* --- KHÔI PHỤC LẠI CẤU TRÚC FLEXBOX VỚI 3 CỘT --- */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* === LEFT SIDEBAR === */}
        <aside className="hidden lg:block group sticky top-24 self-start bg-white/70 backdrop-blur-md rounded-lg shadow-sm p-2 transition-all duration-300 ease-in-out w-20 hover:w-60 z-10 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 px-2 flex items-center">
                <span className="w-7 h-7 mr-2 text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-7.5 5.25h7.5" /></svg>
                </span>
                <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 delay-100 whitespace-nowrap">Khám Phá Nhanh</span>
            </h2>
            <div className="flex flex-col space-y-2">
            {quickLinks.map(link => (
                <Link
                key={link.name}
                to={link.path}
                className="w-full px-2 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                >
                <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                    <span className="w-5 h-5">{link.icon}</span>
                </span>
                <span className="ml-2 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 delay-100 whitespace-nowrap">
                    {link.name}
                </span>
                </Link>
            ))}
            </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 space-y-16 md:space-y-20">
            {loading && <div className="text-center py-10 text-xl">Đang tải dữ liệu...</div>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}
            {!loading && !error && (
              <>
                <section>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Món Ăn Nổi Bật</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                    {featuredItems.map(item => <MenuItemCard key={item.id} item={item} />)}
                    </div>
                </section>
                <section className="bg-orange-50 py-16 md:py-20 rounded-lg">
                    <div className="px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Ưu Đãi Đặc Biệt</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
                        {featuredPromotions.map(promo => <PromotionCard key={promo.id} promotion={promo} />)}
                        </div>
                        <div className="text-center mt-12">
                            <Link to="/promotion" className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                            Xem Tất Cả Khuyến Mãi
                            </Link>
                        </div>
                    </div>
                </section>
              </>
            )}
             <section className="bg-gray-100 py-16 md:py-20 rounded-lg">
                <div className="px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Về Chúng Tôi</h2>
                    <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">Tại Okami Food, chúng tôi đam mê mang đến những bữa ăn ngon miệng, được chế biến từ nguyên liệu tươi sạch nhất.</p>
                    <Link to="/about" className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Tìm Hiểu Thêm &rarr;
                    </Link>
                </div>
            </section>
        </main>

        {/* === RIGHT SIDEBAR === */}
        <aside className="hidden lg:block lg:w-64 sticky top-24 self-start bg-white/70 backdrop-blur-md rounded-lg shadow-sm p-4 z-10">
            <div className="mb-6">
                <img 
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=60"
                    alt="Banner quảng cáo"
                    className="rounded-md shadow-lg object-cover"
                />
                <p className="text-center font-semibold text-gray-700 mt-2">
                    Trải nghiệm vị ngon cùng Okami!
                </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-md shadow">
                <h3 className="text-lg font-semibold text-orange-600 mb-2 text-center">
                    ⚡️ Deal Chớp Nhoáng!
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                    Burger Bò Phô Mai giảm ngay <span className="font-bold">20%</span> chỉ trong:
                </p>
                <div className="text-center text-xl font-bold text-red-500">
                  {timeLeft > 0 ? formatTime(timeLeft) : "Đã hết hạn!"}
                </div>
                <Link
                    to="/menu"
                    className={`mt-4 block text-center font-semibold py-2 px-4 rounded transition duration-300 ease-in-out ${timeLeft > 0 ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    onClick={(e) => timeLeft <= 0 && e.preventDefault()}
                >
                    {timeLeft > 0 ? "Đặt ngay" : "Xem Deal khác"}
                </Link>
            </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;