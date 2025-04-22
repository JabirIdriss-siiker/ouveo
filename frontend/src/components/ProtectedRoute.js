import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.user.role;

    if (!allowedRoles.includes(userRole)) {
      // Redirect based on role
      switch (userRole) {
        case 'artisan':
          return <Navigate to="/artisan/dashboard" replace />;
        case 'secretary':
          return <Navigate to="/secretary/dashboard" replace />;
        case 'admin':
          return <Navigate to="/admin" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }

    return children;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;