import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import ClientLayout from './components/client/ClientLayout';
import AdminLayout from './components/AdminLayout';

// Client Pages
import Home from './pages/client/Home';
import AuctionList from './pages/client/AuctionList';
import AuctionDetail from './pages/client/AuctionDetail';
import Profile from './pages/client/Profile';
import Watchlists from './pages/client/Watchlists';
import SellerRegistration from './pages/client/SellerRegistration';
import ManageAuctions from './pages/seller/ManageAuctions';
import Auth from './pages/client/Auth';
import ForgotPassword from './pages/client/ForgotPassword';
import ResetPassword from './pages/client/ResetPassword';
import Unauthorized from './pages/client/Unauthorized';
import News from './pages/client/News';
import Articles from './pages/client/Articles';
import ArticleDetail from './pages/client/ArticleDetail';
import Reviews from './pages/client/Reviews';
import PaymentResult from './pages/client/PaymentResult';
import AboutUs from './pages/client/AboutUs';
import Terms from './pages/client/Terms';
import FAQ from './pages/client/FAQ';
import Contact from './pages/client/Contact';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import UserManage from './pages/admin/UserManage';
import RoleManage from './pages/admin/RoleManage';
import CategoryManage from './pages/admin/CategoryManage';
import LocationManage from './pages/admin/LocationManage';
import AuctionManage from './pages/admin/AuctionManage';
import AuctionImageManage from './pages/admin/AuctionImageManage';
import AuctionDepositManage from './pages/admin/AuctionDepositManage';
import AuctionRegistrationManage from './pages/admin/AuctionRegistrationManage';
import BidManage from './pages/admin/BidManage';
import OrderManage from './pages/admin/OrderManage';
import TransactionManage from './pages/admin/TransactionManage';
import ReviewManage from './pages/admin/ReviewManage';
import NewsManage from './pages/admin/NewsManage';
import NotificationManage from './pages/admin/NotificationManage';
import ContactManage from './pages/admin/ContactManage';
import WatchlistManage from './pages/admin/WatchlistManage';
import AuditLogManage from './pages/admin/AuditLogManage';
import ArticleManage from './pages/admin/ArticleManage';
import AdminSettings from './pages/admin/AdminSettings';

// Auth & Security
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Utilities
import ScrollToTop from './components/ScrollToTop';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          
          {/* Client Portal Flow */}
          <Route path="/" element={<ClientLayout />}>
            {/* Nhóm Public */}
            <Route index element={<Home />} />
            <Route path="auctions" element={<AuctionList />} />
            <Route path="auction/:id" element={<AuctionDetail />} />
            <Route path="news" element={<News />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:id" element={<ArticleDetail />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="terms" element={<Terms />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
            <Route path="auth" element={<Auth />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Nhóm Chỉ người dùng có tài khoản */}
            <Route 
              path="profile" 
              element={
                <ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="watchlists" 
              element={
                <ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']}>
                  <Watchlists />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="register-seller" 
              element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <SellerRegistration />
                </ProtectedRoute>
              } 
            />

            {/* --- SELLER ROUTES --- */}
            <Route 
              path="seller/my-auctions" 
              element={
                <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                  <ManageAuctions />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Admin Portal Flow */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManage />} />
            <Route path="roles" element={<RoleManage />} />
            <Route path="categories" element={<CategoryManage />} />
            <Route path="locations" element={<LocationManage />} />
            <Route path="auctions" element={<AuctionManage />} />
            <Route path="auction-images" element={<AuctionImageManage />} />
            <Route path="auction-deposits" element={<AuctionDepositManage />} />
            <Route path="auction-registrations" element={<AuctionRegistrationManage />} />
            <Route path="bids" element={<BidManage />} />
            <Route path="orders" element={<OrderManage />} />
            <Route path="transactions" element={<TransactionManage />} />
            <Route path="reviews" element={<ReviewManage />} />
            <Route path="news" element={<NewsManage />} />
            <Route path="articles" element={<ArticleManage />} />
            <Route path="notifications" element={<NotificationManage />} />
            <Route path="contacts" element={<ContactManage />} />
            <Route path="watchlists" element={<WatchlistManage />} />
            <Route path="audit-logs" element={<AuditLogManage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
