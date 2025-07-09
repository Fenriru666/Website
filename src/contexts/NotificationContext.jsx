// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // DEBUG: Sử dụng useEffect để theo dõi state 'notifications'
    useEffect(() => {
        console.log('[DEBUG] Bước 2: Trạng thái notifications đã thay đổi:', notifications);
    }, [notifications]);

    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter(n => n.id !== id));
    }, []);

    const value = { addNotification, removeNotification, notifications };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};