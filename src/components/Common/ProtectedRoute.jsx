import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UnauthorizedRedirect = () => {
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    alert("Access denied. You don't have permission to view this page.");
    setRedirect(true);
  }, []);
  
  if (redirect) return <Navigate to="/dashboard" replace />;
  return null;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const isAuthorized = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!isAuthorized) {
      return <UnauthorizedRedirect />;
    }
  }

  return children;
};

export default ProtectedRoute;
