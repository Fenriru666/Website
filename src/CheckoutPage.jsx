import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { useNotification } from './contexts/NotificationContext';
import api from './api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { currentUser, isLoggedIn } = useAuth();
    const { cartItems, cartTotalPrice, clearCart } = useCart();
    const { addNotification } = useNotification();

    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        address: '',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            addNotification('Vui lòng đăng nhập để thanh toán.', 'error');
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            addNotification('Giỏ hàng của bạn đang trống để thanh toán.', 'info');
            navigate('/menu');
            return;
        }
        if (currentUser) {
            setCustomerInfo({
                fullName: currentUser.fullName || '',
                address: currentUser.address || '',
                phone: currentUser.phone || '',
            });
        }
    }, [isLoggedIn, currentUser, cartItems, navigate, addNotification]);

    const handleChange = (e) => {
        setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                customerInfo,
                cartItems,
                totalPrice: cartTotalPrice,
                paymentMethod,
            };
            
            const token = localStorage.getItem('token');
            const response = await api.post('/api/orders', orderData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (paymentMethod === 'bank_transfer') {
                addNotification('Đã tạo đơn hàng! Vui lòng hoàn tất thanh toán.', 'success');
                clearCart();
                navigate(`/payment/${response.data.orderId}`);
            } else {
                addNotification('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
                clearCart(); 
                navigate('/');
            }
            
        } catch (err) {
            addNotification(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-600">Thanh Toán Đơn Hàng</h1>
                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Phần thông tin giao hàng */}
                    <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                                <input type="text" name="fullName" value={customerInfo.fullName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input type="text" name="address" value={customerInfo.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input type="text" name="phone" value={customerInfo.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                        </div>
                    </div>
                    {/* Phần tóm tắt và thanh toán */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Phương thức thanh toán</h3>
                            <div className="space-y-3">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-orange-600"/>
                                    <span className="ml-3 font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</span>
                                </label>
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'}`}>
                                    <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-orange-600"/>
                                    <span className="ml-3 font-medium text-gray-700">Chuyển khoản ngân hàng</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md self-start">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-3">Tóm tắt đơn hàng</h2>
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="font-semibold">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                                        <span>{Number(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 space-y-2">
                                <div className="flex justify-between font-bold text-xl text-orange-600 border-t pt-2 mt-2">
                                    <span>Tổng cộng</span>
                                    <span>{Number(cartTotalPrice).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading || cartItems.length === 0} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400 relative">
                            {loading && (
                                <span className="absolute left-1/2 transform -translate-x-1/2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            )}
                            <span className={loading ? 'opacity-0' : 'opacity-100'}>Xác nhận và Đặt Hàng</span>
                        </button>
                    </div>
                </form>
                {loading && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <svg className="animate-spin h-10 w-10 text-orange-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-lg font-semibold text-gray-700">Đang xử lý đơn hàng...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;