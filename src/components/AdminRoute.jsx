import React, { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

function AdminRoute() {
    const { currentUser, loading } = useAuth();
    const { addNotification } = useNotification();
    const notificationShownRef = useRef(false);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Đang kiểm tra quyền truy cập...</div>;
    }

    if (currentUser && currentUser.role === 'admin') {
        return <Outlet />;
    }
    
    if (!notificationShownRef.current) {
        addNotification('Bạn không có quyền truy cập trang này.', 'error');
        notificationShownRef.current = true;
    }
    
    return <Navigate to="/" />;
}

export default AdminRoute;