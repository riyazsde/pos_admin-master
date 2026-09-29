// src/Routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/authStorage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length) {
    const user = getUser();
    if (user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/Dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;