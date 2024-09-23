// ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext2'; // Ensure this path is correct

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return Component;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute; // Ensure default export