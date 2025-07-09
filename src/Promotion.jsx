import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // THÊM MỚI
import PromotionCard from './components/PromotionCard.jsx';
import api from './api';

// --- CÁC ICON SVG CHO BỘ LỌC (GIỮ NGUYÊN) ---
const PromoHeaderIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3m0 0c0 1.657 1.343 3 3 3s3-1.343 3-3m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const AllPromoIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg> );
const DiscountIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-percent-icon lucide-ticket-percent"><path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 9h.01"/><path d="m15 9-6 6"/><path d="M15 15h.01"/></svg> );
const ComboIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-check-icon lucide-ticket-check"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="m9 12 2 2 4-4"/></svg> );
const GiftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-percent-icon lucide-badge-percent"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m15 9-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/></svg> );
const EventIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-diamond-percent-icon lucide-diamond-percent"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"/><path d="M9.2 9.2h.01"/><path d="m14.5 9.5-5 5"/><path d="M14.7 14.8h.01"/></svg> );
const SpecialDiscountIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent-icon lucide-percent"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> );
const DefaultPromoIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg> );
// ----------------------------------------------------

function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromoType, setSelectedPromoType] = useState('Tất Cả');
  const location = useLocation(); // THÊM MỚI

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/promotions');
        setPromotions(response.data);
      } catch (err) {
        setError("Không thể tải được danh sách khuyến mãi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, [location.pathname]); // THAY ĐỔI: Thêm location.pathname vào đây

  const promoTypes = ['Tất Cả', ...new Set(promotions.map(p => p.type))];
  const filteredPromotions = selectedPromoType === 'Tất Cả' ? promotions : promotions.filter(promo => promo.type === selectedPromoType);
  const promoTypeIconMap = { 'tất cả': <AllPromoIcon />, 'giảm giá': <DiscountIcon />, 'combo': <ComboIcon />, 'mua 1 tặng 1': <GiftIcon />, 'sự kiện đặc biệt': <EventIcon />, 'ưu đãi đặc biệt': <SpecialDiscountIcon /> };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-100 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 mb-4">
            Ưu Đãi Ngập Tràn Tại Okami Food!
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            Đừng bỏ lỡ những chương trình khuyến mãi hấp dẫn nhất từ chúng tôi. Cơ hội thưởng thức món ngon với giá cực hời!
          </p>
        </header>

        <div className="flex flex-row gap-6">
          <aside className="group sticky top-24 self-start bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-2 transition-all duration-300 ease-in-out w-20 hover:w-56 z-10 overflow-hidden">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 px-2 flex items-center">
              <span className="w-8 h-8 mr-2 text-orange-500">
                <PromoHeaderIcon />
              </span>
              <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 delay-100 whitespace-nowrap">
                Khuyến mãi
              </span>
            </h2>
            <div className="flex flex-col space-y-2">
              {promoTypes.map(type => {
                const keyLower = type.toLowerCase();
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedPromoType(type)}
                    className={`w-full px-2 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex items-center ${
                        selectedPromoType === type ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <span className="w-5 h-5">
                        {promoTypeIconMap[keyLower] || <DefaultPromoIcon />}
                      </span>
                    </span>
                    <span className="ml-2 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-200 delay-100 whitespace-nowrap">
                      {type}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="flex-1">
            {loading && <p className="text-center text-gray-600 text-xl">Đang tải khuyến mãi...</p>}
            {error && <p className="text-center text-red-600 text-xl">{error}</p>}
            {!loading && !error && (
              filteredPromotions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredPromotions.map(promo => (
                    <PromotionCard key={promo.id} promotion={promo} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-xl">
                  Hiện tại chưa có chương trình khuyến mãi nào phù hợp.
                </p>
              )
            )}
          </main>

          <aside className="hidden xl:block xl:w-64 sticky top-24 self-start bg-white/80 backdrop-blur-md rounded-lg shadow-sm p-4 z-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Mẹo săn Deal</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Theo dõi chúng tôi trên mạng xã hội để không bỏ lỡ ưu đãi!</p>
              <p className="text-sm text-gray-600">Đăng ký nhận email để biết khuyến mãi sớm nhất.</p>
              <div className="aspect-w-16 aspect-h-9 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=60"
                  alt="Discount banner"
                  className="rounded-md object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Promotion;