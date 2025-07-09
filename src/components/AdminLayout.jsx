import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

const adminLinks = [
    { to: '/admin/dashboard', label: 'Tổng quan' },
    { to: '/admin/products', label: 'Quản lý Món ăn' },
    { to: '/admin/orders', label: 'Quản lý Đơn hàng' },
    { to: '/admin/promotions', label: 'Quản lý Khuyến mãi' }
];

function AdminLayout() {
    const activeLinkClass = 'bg-orange-500 text-white';
    const inactiveLinkClass = 'text-gray-700 hover:bg-orange-100 hover:text-orange-600';
    
    const { logout } = useAuth();
    const { clearCart } = useCart();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        clearCart();
        addNotification('Bạn đã đăng xuất thành công!', 'info');
        navigate('/login');
    };

    return (
        // THAY ĐỔI TẠI ĐÂY:
        // 1. Đổi 'min-h-screen' thành 'h-screen' để chiều cao layout luôn bằng chiều cao màn hình.
        // 2. Thêm 'overflow-hidden' để ngăn cả trang bị cuộn.
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-orange-600 mb-6">Trang Quản Trị</h2>
                    <nav className="flex flex-col space-y-2">
                        {adminLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end
                                className={({ isActive }) => 
                                    `px-4 py-2 rounded-md transition-colors font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                {/* Phần tử này với mt-auto sẽ đẩy nút Đăng xuất xuống dưới cùng */}
                <div className="p-4 mt-auto">
                    <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 rounded-md transition-colors font-medium text-red-600 hover:bg-red-100"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>
            
            {/* THAY ĐỔI TẠI ĐÂY: Thêm 'overflow-y-auto' để chỉ vùng này được phép cuộn dọc */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;