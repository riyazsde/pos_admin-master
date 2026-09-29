// src/Routes/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';

const PublicRoute = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
};

export default PublicRoute;