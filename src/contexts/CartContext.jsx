import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isLoggedIn } = useAuth();

    const fetchUserCart = useCallback(async () => {
        if (isLoggedIn) {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.get('/api/cart', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setCartItems(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải giỏ hàng từ server:", error);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserCart();
        } else {
            const localData = localStorage.getItem('cartItems');
            setCartItems(localData ? JSON.parse(localData) : []);
        }
    }, [isLoggedIn, fetchUserCart]);

    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoggedIn]);

    const addToCart = async (product) => {
        if (isLoggedIn) {
            try {
                await api.post('/api/cart', { productId: product.id, quantity: 1 }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                await fetchUserCart();
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng trên server:", error);
            }
        } else {
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === product.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevItems, { ...product, quantity: 1 }];
            });
        }
    };
    
    // HÀM MỚI ĐỂ CẬP NHẬT SỐ LƯỢNG
    const updateQuantity = async (productId, quantity) => {
        const newQuantity = Math.max(0, parseInt(quantity, 10)); // Đảm bảo số lượng không âm

        if (isLoggedIn) {
            try {
                // Nếu số lượng là 0, API sẽ tự động xóa
                await api.put('/api/cart/item', { productId, quantity: newQuantity }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                await fetchUserCart(); // Tải lại giỏ hàng để cập nhật
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng trên server:", error);
            }
        } else {
            // Xử lý cho khách
            if (newQuantity === 0) {
                setCartItems(prev => prev.filter(item => item.id !== productId));
            } else {
                setCartItems(prev => prev.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                ));
            }
        }
    };

    const clearCart = async () => {
        if (isLoggedIn) {
            try {
                await api.delete('/api/cart', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setCartItems([]);
            } catch (error) {
                console.error("Lỗi khi xóa giỏ hàng trên server:", error);
            }
        } else {
            setCartItems([]);
            localStorage.removeItem('cartItems');
        }
    };
    
    const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotalPrice = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

    const value = {
        cartItems,
        cartTotalItems,
        cartTotalPrice,
        loading,
        addToCart,
        updateQuantity, // Thêm hàm vào context
        clearCart,
        fetchUserCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};