import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PrivateRoute = ({ userType }) => {
  const { isLoggedIn, user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status on component mount
    if (!isLoggedIn) {
      checkAuth();
    }
  }, [isLoggedIn, checkAuth]);

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific user type(s) required, check user has correct type
  if (userType) {
    const allowedTypes = Array.isArray(userType) ? userType : [userType];
    if (!allowedTypes.includes(user?.userType)) {
      // Redirect to appropriate dashboard based on user type
      if (user?.userType === 'Tenant') {
        return <Navigate to="/tenant/dashboard" replace />;
      } else if (user?.userType === 'Admin' || user?.userType === 'Landlord') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  // Render child routes
  return <Outlet />;
};

export default PrivateRoute;
