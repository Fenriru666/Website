import React, { useState, useEffect } from 'react';
import api from './api';
import MenuItemCard from './components/MenuItemCard.jsx';

// --- CÁC ICON SVG (GIỮ NGUYÊN KHÔNG ĐỔI) ---
const CategoryHeaderIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" /></svg>);
const AllIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v6H4V4z M14 4h6v6h-6V4z M4 14h6v6H4v-6z M14 14h6v6h-6v-6z" /></svg>);
const PizzaIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pizza w-full h-full"><path d="m12 21-1-1" /><path d="m13.75 18.25-1.25 1.42" /><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" /><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7" /><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z" /></svg>);
const BurgerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hamburger w-full h-full"><path d="M12 16H4a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4h-4.25" /><path d="M5 12a2 2 0 0 1-2-2 9 7 0 0 1 18 0 2 2 0 0 1-2 2" /><path d="M5 16a2 2 0 0 0-2 2 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 2 2 0 0 0-2-2q0 0 0 0" /><path d="m6.67 12 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" /></svg>);
const FriedChickenIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drumstick"><path d="M14.23 7.77 18.5 3.5a2.12 2.12 0 1 1 3 3l-4.27 4.23a2.12 2.12 0 0 1-3 0Z"/><path d="m12.03 10-9-9 4.24-4.24a2.12 2.12 0 0 1 3 0L21.5 8.5"/><path d="M12.03 10a5.18 5.18 0 0 1-5.18-5.18h-1.4a6.58 6.58 0 0 0 6.58 6.58Z"/></svg>);
const PastaIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-soup w-full h-full"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" /><path d="M7 21h10" /><path d="M19.5 12 22 6" /><path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62" /><path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62" /><path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62" /></svg>);
const DrinkIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cup-soda w-full h-full"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" /><path d="M5 8h14" /><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" /><path d="m12 8 1-6h2" /></svg>);
const RiceIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wheat w-full h-full"><path d="M2 22 16 8" /><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" /><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" /><path d="M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /><path d="M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /><path d="M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z" /></svg>);
const AppetizerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-full h-full"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>);
const DessertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cake-slice"><path d="M2 12a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H2Z"/><path d="M14 12V3.41a1 1 0 0 0-.55-.89l-5-2.5a1 1 0 0 0-1.09.22l-5 5A1 1 0 0 0 3 7.52V12"/><path d="M18.4 12H21a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2.6"/><path d="M8 16v-4"/></svg>);
const DefaultIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.330-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>);


function Menu() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // THAY ĐỔI Ở ĐÂY: Định nghĩa một danh sách các danh mục chính để hiển thị
  const categories = [
    'Tất cả', 
    'Pizza', 
    'Burger', 
    'Gà Rán', 
    'Mỳ Ý', 
    'Cơm', 
    'Khai vị', 
    'Đồ uống', 
    'Tráng miệng'
  ];
  
  const categoryIconMap = {
    'tất cả': <AllIcon />,
    'pizza': <PizzaIcon />,
    'burger': <BurgerIcon />,
    'gà rán': <FriedChickenIcon />,
    'mỳ ý': <PastaIcon />,
    'đồ uống': <DrinkIcon />,
    'cơm': <RiceIcon />,
    'khai vị': <AppetizerIcon />,
    'tráng miệng': <DessertIcon />,
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/menu');
        setFoodItems(response.data);
        setError(null);  
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thực đơn:", err);
        setError("Không thể tải dữ liệu thực đơn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  const filteredItems = selectedCategory === 'Tất cả'
      ? foodItems
      : foodItems.filter(item => item.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Thực Đơn <span className="text-orange-500">Okami Food</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
            <div className="sticky top-24 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="w-6 h-6 mr-2"><CategoryHeaderIcon/></span> Danh Mục
                </h2>
                <div className="space-y-2">
                    {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full px-4 py-2.5 rounded-lg text-base font-medium transition-colors duration-200 flex items-center text-left ${
                        selectedCategory === category
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                        }`}
                    >
                        <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center mr-3">
                            <span className="w-5 h-5">
                                {categoryIconMap[category.toLowerCase()] || <DefaultIcon />}
                            </span>
                        </span>
                        <span>{category}</span>
                    </button>
                    ))}
                </div>
            </div>
        </aside>

        <main className="flex-1">
          {loading && <div className="text-center text-xl">Đang tải thực đơn...</div>}
          {error && <div className="text-center text-xl text-red-500">{error}</div>}
          {!loading && !error && (
            filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg py-10">
                Không tìm thấy món ăn nào phù hợp với lựa chọn của bạn.
              </p>
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default Menu;