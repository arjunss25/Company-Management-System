import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { isAuthenticated, userRole, loading } = useAuth();

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    userRole,
    loading,
    allowedRoles,
  }); // Debug log

  if (loading) {
    // You might want to show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login'); // Debug log
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.log('Unauthorized role, redirecting'); // Debug log
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
