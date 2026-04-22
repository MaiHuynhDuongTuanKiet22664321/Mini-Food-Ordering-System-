import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import FoodList from './components/FoodList';
import Cart from './components/Cart';
import Order from './components/Order';
import AdminDashboard from './components/admin/AdminDashboard';
import DashboardOverview from './components/admin/DashboardOverview';
import FoodManagement from './components/admin/FoodManagement';
import UserManagement from './components/admin/UserManagement';
import NotificationsManagement from './components/admin/NotificationsManagement';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
    return <Navigate to="/" />;
  }
  
  return children;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      {isLogin ? (
        <Login onToggleRegister={() => setIsLogin(false)} />
      ) : (
        <Register onToggleLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={<FoodList />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="food" element={<FoodManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="notifications" element={<NotificationsManagement />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
