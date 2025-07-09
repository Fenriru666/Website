// src/components/Notification.jsx
import React, { useEffect, forwardRef } from 'react'; // 1. Import forwardRef
import { useNotification } from '../contexts/NotificationContext';

const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// 2. Bọc component trong forwardRef
const Notification = forwardRef(({ id, message, type }, ref) => {
    const { removeNotification } = useNotification();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, removeNotification]);

    const notificationStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const notificationIcons = {
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
    };

    return (
        // 3. Gắn ref nhận được vào phần tử DOM chính
        <div ref={ref} className={`relative flex items-center p-4 mb-4 text-white rounded-lg shadow-lg ${notificationStyles[type] || 'bg-gray-500'}`}>
            <div className="flex-shrink-0">
                {notificationIcons[type] || <InfoIcon />}
            </div>
            <div className="ml-3 text-sm font-medium">
                {message}
            </div>
            <button
                onClick={() => removeNotification(id)}
                className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Đóng"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
});

export default Notification;