import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNotification } from '../../contexts/NotificationContext';

function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotification();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await api.get('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            addNotification('Lỗi khi tải danh sách đơn hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            addNotification('Cập nhật trạng thái thành công!', 'success');
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            addNotification('Lỗi khi cập nhật trạng thái.', 'error');
        }
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            // THÊM MỚI: Thêm màu cho trạng thái chờ thanh toán
            case 'Awaiting Payment': return 'bg-gray-200 text-gray-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-indigo-100 text-indigo-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Quản Lý Đơn Hàng</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐH</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Phương thức</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-4 py-3 font-medium">#{order.id}</td>
                                <td className="px-4 py-3">{order.customer_name}</td>
                                <td className="px-4 py-3">{new Date(order.order_date).toLocaleString('vi-VN')}</td>
                                <td className="px-4 py-3 text-right font-semibold">{Number(order.total_price).toLocaleString('vi-VN')} ₫</td>
                                <td className="px-4 py-3 text-center text-sm">
                                    {order.payment_method === 'bank_transfer' ? (
                                        <span className="font-semibold text-blue-600">Chuyển khoản</span>
                                    ) : (
                                        <span className="font-semibold text-green-600">COD</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`p-1 border rounded-md text-sm ${getStatusClass(order.status)}`}
                                    >
                                        {/* THÊM MỚI: Thêm lựa chọn 'Awaiting Payment' */}
                                        <option value="Awaiting Payment">Chờ thanh toán</option>
                                        <option value="Pending">Chờ xác nhận</option>
                                        <option value="Preparing">Đang chuẩn bị</option>
                                        <option value="Shipped">Đang giao</option>
                                        <option value="Completed">Hoàn thành</option>
                                        <option value="Cancelled">Đã hủy</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrdersPage;