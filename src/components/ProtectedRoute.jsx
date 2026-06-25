import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, token, loading } = useAuth();

  // Show a premium visual loading state while validating token
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-md"></div>
        <p className="mt-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest animate-pulse">
          Đang xác thực bảo mật...
        </p>
      </div>
    );
  }

  // Not authenticated
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Role validation
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`User with role '${user.role}' is not authorized to access this route. Allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
