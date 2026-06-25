import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HasRole = ({ requiredRoles, children }) => {
  const { user } = useAuth();

  // Hide if no user or user role is not in the required roles array
  if (!user || !user.role || !requiredRoles.includes(user.role)) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
};

export default HasRole;
