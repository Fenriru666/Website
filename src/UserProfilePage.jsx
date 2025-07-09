// src/UserProfilePage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const OrderHistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a3.001 3.001 0 00-3 0M21.75 6.75h-.007v.008H21.75V6.75zm-.375 0a3.001 3.001 0 013 0M6.75 6.75H4.5m15 0H17.25m-10.5 0h3M6.75 12H4.5m15 0H17.25m-10.5 0h3M6.75 17.25H4.5m15 0H17.25m-10.5 0h3M4.125 18a.875.875 0 100-1.75.875.875 0 000 1.75zM4.125 12a.875.875 0 100-1.75.875.875 0 000 1.75zM4.125 6a.875.875 0 100-1.75.875.875 0 000 1.75z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>;

function UserProfilePage() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const InfoRow = ({ label, value }) => (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'Chưa cập nhật'}</dd>
        </div>
    );
    
    if (!currentUser) {
        return <div className="text-center py-20 text-xl">Đang tải thông tin người dùng...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-8 md:mb-10 text-center">
                    <img 
                        src={currentUser.avatarUrl ? `http://localhost:5000${currentUser.avatarUrl}` : 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg'}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                    />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Thông Tin Tài Khoản
                    </h1>
                </header>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-3xl mx-auto">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-1">
                            Xin chào, {currentUser.fullName}! 
                        </h3>
                        <p className="max-w-2xl text-sm text-gray-500 mb-5">
                            Đây là thông tin cá nhân và các tùy chọn tài khoản của bạn.
                        </p>
                        
                        <dl className="divide-y divide-gray-200">
                            <InfoRow label="Họ và Tên" value={currentUser.fullName} />
                            <InfoRow label="Địa chỉ Email" value={currentUser.email} />
                            <InfoRow label="Số điện thoại" value={currentUser.phone} />
                            <InfoRow label="Địa chỉ" value={currentUser.address} />
                            <InfoRow label="Ngày tham gia" value={new Date(currentUser.joinDate).toLocaleDateString('vi-VN')} />
                        </dl>
                    </div>
                    <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-3 sm:space-y-0 flex-wrap gap-2">
                            <Link to="/profile/edit" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <EditIcon /> Chỉnh Sửa Thông Tin
                            </Link>
                            <Link to="/profile/change-password" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <KeyIcon /> Đổi Mật Khẩu
                            </Link>
                            <Link to="/order-history" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                                <OrderHistoryIcon /> Lịch Sử Đơn Hàng
                            </Link>
                            <button onClick={handleLogout} type="button" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
                                <LogoutIcon /> Đăng Xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;