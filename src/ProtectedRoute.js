import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext2'; // Ensure this path is correct

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user, loading } = useAuth(); // Get loading state from context
  const location = useLocation();

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the protected component
  if (user) {
    return <Component {...rest} />;
  }

  // If the user is not authenticated, redirect to the login page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;