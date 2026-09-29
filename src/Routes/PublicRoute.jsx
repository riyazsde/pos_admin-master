// src/Routes/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authStorage';

const PublicRoute = ({ children }) => {
  // If user has a valid token (localStorage OR sessionStorage) → send to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/Dashboard" replace />;
  }

  return children;
};

export default PublicRoute;