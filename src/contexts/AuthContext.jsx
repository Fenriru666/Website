import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                setCurrentUser(JSON.parse(user));
            }
        } catch (error) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        const guestCart = localStorage.getItem('cartItems');
        if (guestCart && JSON.parse(guestCart).length > 0) {
            try {
                await api.post('/api/cart/merge', 
                    { cartItems: JSON.parse(guestCart) },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                localStorage.removeItem('cartItems');
            } catch (error) {
                console.error("Lỗi khi hợp nhất giỏ hàng:", error);
            }
        }
        
        // Cập nhật currentUser sau khi đã hợp nhất để trigger useEffect trong CartContext
        setCurrentUser(userData);
    };
    
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems'); 
        setCurrentUser(null);
    };

    const updateUser = (updatedUserData) => {
        setCurrentUser(updatedUserData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
    };
    
    const isLoggedIn = !!currentUser;

    const value = { isLoggedIn, currentUser, login, logout, updateUser };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};