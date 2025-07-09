import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from './api';

function PaymentPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!orderId) return;
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // THAY ĐỔI: Gọi API tĩnh, không cần gửi orderId
                const [orderRes, paymentRes] = await Promise.all([
                    api.get(`/api/orders/${orderId}`, config),
                    api.get(`/api/payment-info`, config) // Bỏ orderId khỏi đây
                ]);
                
                setOrder(orderRes.data);
                setPaymentInfo(paymentRes.data);

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu thanh toán:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderId]);

    if (loading) {
        return <div className="text-center py-20 text-xl">Đang tải thông tin thanh toán...</div>;
    }

    if (!order || !paymentInfo) {
        return <div className="text-center py-20 text-xl text-red-500">Không thể tải thông tin đơn hàng.</div>;
    }

    const qrValue = paymentInfo.qrInfo;

    return (
        <div className="bg-gray-100 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Hoàn tất thanh toán</h1>
                    <p className="text-gray-600 mb-6">Vui lòng quét mã QR hoặc chuyển khoản với nội dung bên dưới để hoàn tất đơn hàng của bạn.</p>

                    <div className="my-6">
                        <QRCodeSVG
                            value={qrValue}
                            size={200}
                            level="H"
                            includeMargin={true}
                            className="mx-auto"
                        />
                    </div>

                    <div className="text-left bg-gray-50 p-4 rounded-lg border space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ngân hàng:</span>
                            <span className="font-semibold text-gray-900">{paymentInfo.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Chủ tài khoản:</span>
                            <span className="font-semibold text-gray-900">{paymentInfo.accountName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Số tài khoản:</span>
                            <span className="font-semibold text-gray-900">{paymentInfo.accountNumber}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                            <span className="font-bold">Số tiền:</span>
                            <span className="font-bold text-xl">{Number(order.total_price).toLocaleString('vi-VN')} ₫</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-500">Nội dung*:</span>
                            <span className="font-semibold text-red-600">{`OKAMI ${orderId}`}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-left">*Vui lòng nhập đúng nội dung chuyển khoản để đơn hàng được xác nhận nhanh nhất.</p>
                    
                    <div className="mt-8">
                        <Link to="/order-history" className="w-full inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition">
                            Tôi đã thanh toán, xem lịch sử đơn hàng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;