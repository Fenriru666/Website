import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import Promotion from './Promotion.jsx';
import CartPage from './CartPage.jsx';
import UserProfilePage from './UserProfilePage.jsx';
import Menu from './Menu.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import EditProfilePage from './EditProfilePage.jsx';
import ChangePasswordPage from './ChangePasswordPage.jsx';
import NotificationContainer from './components/NotificationContainer.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import PromotionDetailPage from './PromotionDetailPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import OrderHistoryPage from './OrderHistoryPage.jsx';
import OrderDetailPage from './OrderDetailPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import MainLayout from './components/MainLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import CustomerRoute from './components/CustomerRoute.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import PaymentPage from './PaymentPage.jsx';

function App() {
  return (
    <> 
      <NotificationContainer />
      <ScrollToTop />
      
      <Routes>
        {/* === CÁC ROUTE CHO KHÁCH HÀNG VÀ TRANG CHUNG === */}
        <Route path="/" element={<MainLayout />}>
          {/* Các trang công khai */}
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:productId" element={<ProductDetailPage />} />
          <Route path="promotion" element={<Promotion />} />
          <Route path="promotion/:promoId" element={<PromotionDetailPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="cart" element={<CartPage />} />

          {/* Các trang yêu cầu đăng nhập với vai trò khách hàng */}
          <Route element={<CustomerRoute />}>
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="profile/change-password" element={<ChangePasswordPage />} />
            <Route path="order-history" element={<OrderHistoryPage />} />
            <Route path="order-details/:orderId" element={<OrderDetailPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/:orderId" element={<PaymentPage />} />
          </Route>
        </Route>

        {/* === CÁC ROUTE CHO TRANG QUẢN TRỊ VIÊN === */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="promotions" element={<AdminPromotionsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;