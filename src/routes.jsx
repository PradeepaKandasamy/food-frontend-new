import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Game from './pages/Game';
import Seller from './pages/Seller';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Payment from './pages/Payment';
import Help from './pages/Help';
import DeliveryLogin from './pages/delivery/DeliveryLogin';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element={<Login />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/help" element={<Help />} />
      <Route path="/chat" element={<Help tab="chat" />} />
      <Route path="/faq" element={<Help tab="faq" />} />
      <Route path="/guides" element={<Help tab="guides" />} />
      
      {/* Role Based Routes */}
      <Route 
        path="/seller" 
        element={
          <ProtectedRoute role="seller">
            <Seller />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user-dashboard" 
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/delivery" 
        element={
          <ProtectedRoute role="delivery">
            <DeliveryDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
