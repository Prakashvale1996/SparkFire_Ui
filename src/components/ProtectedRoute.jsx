import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Please login to continue');
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    toast.error('Admin access required');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
