// src/Routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';
import { hasRoutePermission } from './routePermissions';

const ProtectedRoute = ({ children, allowedRoles, requiredPermission }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length) {
    if (user && !allowedRoles.includes(user.role)) {
      return <Navigate to="/Dashboard" replace />;
    }
  }

  if (requiredPermission && !hasRoutePermission(user, requiredPermission)) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;