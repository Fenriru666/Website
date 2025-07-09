import React, { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function CustomerRoute() {
    const { currentUser, loading } = useAuth();
    const { addNotification } = useNotification();
    const notificationShownRef = useRef(false);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Đang kiểm tra...</div>;
    }

    if (!currentUser) {
        if (!notificationShownRef.current) {
            addNotification('Vui lòng đăng nhập để tiếp tục.', 'error');
            notificationShownRef.current = true;
        }
        return <Navigate to="/login" />;
    }

    if (currentUser.role === 'customer') {
        return <Outlet />;
    }

    if (!notificationShownRef.current) {
        addNotification('Quản trị viên không thể truy cập trang này.', 'info');
        notificationShownRef.current = true;
    }
    
    return <Navigate to="/admin/products" />;
}

export default CustomerRoute;