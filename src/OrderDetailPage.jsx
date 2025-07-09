import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './contexts/AuthContext';
import { useNotification } from './contexts/NotificationContext';
import OrderStatusTracker from './OrderStatusTracker';
import ConfirmationModal from './components/ConfirmationModal';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const prevStatus = usePrevious(order?.status);

  const statusDisplayMap = {
    'Awaiting Payment': 'Chờ thanh toán',
    'Pending': 'Chờ xác nhận',
    'Preparing': 'Đang chuẩn bị',
    'Shipped': 'Đang giao hàng',
    'Completed': 'Đã giao thành công',
    'Cancelled': 'Đã hủy'
  };

  useEffect(() => {
    if (prevStatus && prevStatus !== 'Cancelled' && order?.status === 'Cancelled') {
      addNotification('Đơn hàng đã được hủy thành công!', 'success');
    }
  }, [order?.status, prevStatus, addNotification]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Order Detail Response:', response.data); // Debug
        setOrder(response.data);
      } catch (err) {
        setError('Không thể tải chi tiết đơn hàng.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, isLoggedIn, navigate]);

  const confirmCancelOrder = async () => {
    setIsModalOpen(false);
    setIsCancelling(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setOrder(prevOrder => ({ ...prevOrder, status: 'Cancelled' }));
    } catch (err) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng.';
      addNotification(message, 'error');
    } finally {
      setIsCancelling(false);
    }
  };
  
  const handlePrint = () => {
    console.log('Printing order:', order); // Debug
    window.print();
  };

  const getFullImageUrl = (imageUrl) => {
    console.log('Processing imageUrl:', imageUrl); // Debug
    if (!imageUrl) {
      return 'https://via.placeholder.com/200x200?text=Không+Có+Hình+Ảnh';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl}`;
  };

  if (loading) return <div className="text-center py-20 text-xl">Đang tải chi tiết đơn hàng...</div>;
  if (error) return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;
  if (!order) return null;

  const canCancelOrder = ['Pending', 'Awaiting Payment'].includes(order.status);

  return (
    <div className="bg-gray-100 py-12 print:bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <header className="flex justify-between items-start pb-6 border-b">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Okami Food</h1>
              <p className="text-gray-500">Hóa đơn chi tiết</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">Đơn hàng #{order.id}</h2>
              <p className="text-gray-500">Ngày: {new Date(order.order_date).toLocaleDateString('vi-VN')}</p>
              <p className="text-gray-500">Trạng thái: <span className="font-semibold">{statusDisplayMap[order.status] || order.status}</span></p>
            </div>
          </header>

          {order.payment_method === 'bank_transfer' && order.status === 'Awaiting Payment' && (
            <section className="my-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Đơn hàng này đang chờ thanh toán.
                  </p>
                  <p className="mt-2 text-sm md:mt-0 md:ml-6">
                    <Link 
                      to={`/payment/${order.id}`}
                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                    >
                      Hoàn tất thanh toán ngay <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          )}
          
          <section className="my-8 border-b pb-8 print-visible">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Theo dõi đơn hàng</h3>
            <OrderStatusTracker currentStatus={order.status} />
          </section>

          <main className="grid md:grid-cols-2 gap-8 my-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khách hàng:</h3>
              <p>{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p className="text-gray-600">{order.customer_address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin thanh toán:</h3>
              <p>Phương thức: 
                {order.payment_method === 'bank_transfer' && ' Chuyển khoản ngân hàng'}
                {order.payment_method === 'momo' && ' Ví điện tử Momo'}
                {order.payment_method === 'cod' && ' Thanh toán khi nhận hàng (COD)'}
              </p>
              <p className="font-bold">Tổng cộng: {Number(order.total_price).toLocaleString('vi-VN')} ₫</p>
            </div>
          </main>

          <section>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={getFullImageUrl(item.productImageUrl)}
                              alt={item.productName}
                              onError={(e) => {
                                console.error('Image load error for item:', item.productName, e);
                                e.target.src = 'https://via.placeholder.com/200x200?text=Không+Có+Hình+Ảnh';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(item.price).toLocaleString('vi-VN')} ₫</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{Number(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">Tổng cộng</td>
                    <td className="px-6 py-3 text-right text-lg font-bold text-gray-900">{Number(order.total_price).toLocaleString('vi-VN')} ₫</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-center gap-4 no-print">
          {canCancelOrder && (
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isCancelling ? 'Đang xử lý...' : 'Hủy Đơn Hàng'}
            </button>
          )}
          <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            In Hóa Đơn
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancelOrder}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy vĩnh viễn đơn hàng này không? Hành động này không thể hoàn tác."
      />
    </div>
  );
}

export default OrderDetailPage;