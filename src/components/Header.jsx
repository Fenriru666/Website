import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const CartIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg> );
const HamburgerIcon = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg> );
const CloseIcon = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg> );

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { cartTotalItems, clearCart } = useCart(); 
    const { isLoggedIn, currentUser, logout } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userMenuRef]);

    const handleLogout = () => {
        setIsUserMenuOpen(false);
        logout();
        clearCart();
        addNotification('Bạn đã đăng xuất thành công!', 'info');
        navigate('/login');
    };
    
    const activeDesktopLinkClass = 'text-orange-500 font-semibold border-b-2 border-orange-500';
    const inactiveDesktopLinkClass = 'text-gray-700 hover:text-orange-500 border-b-2 border-transparent transition-colors duration-300';
    
    const navLinks = [
        { path: "/home", label: "Trang Chủ" },
        { path: "/menu", label: "Thực Đơn" },
        { path: "/promotion", label: "Khuyến Mãi" },
        { path: "/about", label: "Giới Thiệu" },
        { path: "/contact", label: "Liên Hệ" },
    ];

    return (
        <>
            {/* <div className="w-full bg-gray-200">
                <Link to="/promotion" aria-label="Xem các chương trình khuyến mãi">
                    <img
                        src="https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?auto=format&fit=crop&w=1280&h=100&q=80"
                        alt="Khuyến mãi đặc biệt"
                        className="w-full h-20 object-cover"
                    />
                </Link>
            </div> */}
            
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-8 sm:px-12 lg:px-20 py-3 flex justify-between items-center">
                    
                    <Link to="/" className="text-3xl md:text-4xl font-bold text-orange-600">Okami Food</Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <nav className="flex space-x-6 text-base font-medium">
                            {navLinks.map(link => (
                                <NavLink key={link.path} to={link.path} className={({ isActive }) => isActive ? activeDesktopLinkClass : inactiveDesktopLinkClass}>
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="h-6 w-px bg-gray-200"></div>

                        <div className="flex items-center space-x-4">
                            <Link to="/cart" className="relative text-gray-700 hover:text-orange-500">
                                <CartIcon />
                                {cartTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartTotalItems}</span>}
                            </Link>
                            
                            {isLoggedIn && currentUser ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="focus:outline-none">
                                        <img
                                            src={currentUser.avatarUrl ? `http://localhost:5000${currentUser.avatarUrl}` : 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg'}
                                            alt="User Avatar"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 hover:border-orange-500 transition-all"
                                        />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                            <div className="px-4 py-3 border-b">
                                                <p className="font-semibold text-gray-900 truncate" title={currentUser.fullName}>{currentUser.fullName}</p>
                                                <p className="text-xs text-gray-500 truncate" title={currentUser.email}>{currentUser.email}</p>
                                            </div>
                                            
                                            {/* THAY ĐỔI Ở ĐÂY: Hiển thị link tùy theo vai trò (role) */}
                                            {currentUser.role === 'admin' ? (
                                                <Link to="/admin/products" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Trang Quản Lý</Link>
                                            ) : (
                                                <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Hồ sơ của bạn</Link>
                                            )}
                                            
                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium">Đăng xuất</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Đăng Nhập</Link>
                                    <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">Đăng Ký</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="p-2 text-gray-500">
                            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        {/* ... (Phần menu mobile giữ nguyên logic tương tự) */}
                    </div>
                )}
            </header>
        </>
    );
}

export default Header;