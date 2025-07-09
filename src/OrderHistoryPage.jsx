import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './contexts/AuthContext';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/orders/my-orders', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setOrders(response.data);
            } catch (err) {
                setError('Không thể tải lịch sử đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isLoggedIn, navigate]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-20 text-xl">Đang tải lịch sử đơn hàng...</div>;
    if (error) return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Lịch Sử Đơn Hàng</h1>
                {orders.length === 0 ? (
                    <div className="text-center bg-white p-8 rounded-lg shadow-md">
                        <p className="text-xl text-gray-600">Bạn chưa có đơn hàng nào.</p>
                        <Link to="/menu" className="mt-4 inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600">
                            Bắt đầu mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Link 
                                key={order.id} 
                                to={`/order-details/${order.id}`}
                                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">Mã đơn hàng: #{order.id}</p>
                                        <p className="text-sm text-gray-500">
                                            Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-orange-600">
                                            {Number(order.total_price).toLocaleString('vi-VN')} ₫
                                        </p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistoryPage;