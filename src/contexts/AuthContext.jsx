import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null; // Not a standard JWT
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding token payload:', e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (tokenVal, forcedUsername = null) => {
    let resolvedUsername = forcedUsername;
    let resolvedRole = null;
    let resolvedEmail = null;

    // 1. Try decoding standard JWT
    const claims = decodeToken(tokenVal);
    if (claims) {
      resolvedUsername = claims.sub || claims.username;
      resolvedRole = claims.role || claims.roles || claims.roleName;
      resolvedEmail = claims.email;
    } else if (tokenVal.startsWith('mock-jwt-token-for-')) {
      // 2. Extract from mock token format
      resolvedUsername = tokenVal.replace('mock-jwt-token-for-', '');
    } else if (!resolvedUsername) {
      // Last resort fallback
      resolvedUsername = 'user';
    }

    try {
      // Fetch users to populate full user object (role, balance, id, email, etc.)
      const response = await API.get('/users', { params: { _t: new Date().getTime() } });
      // In case response is wrapped in standard axios response structure
      const users = response.data || response;
      
      if (Array.isArray(users)) {
        const foundUser = users.find(
          (u) => u.username?.toLowerCase() === resolvedUsername?.toLowerCase()
        );
        if (foundUser) {
          const resolvedUser = {
            id: foundUser.id,
            username: foundUser.username,
            role: foundUser.roleName || resolvedRole || 'USER',
            email: foundUser.email || resolvedEmail,
            phone: foundUser.phone,
            address: foundUser.address,
            balance: foundUser.balance ?? 0.0,
          };
          setUser(resolvedUser);
          setToken(tokenVal);
          setLoading(false);
          return resolvedUser;
        }
      }
    } catch (error) {
      console.error('Failed to retrieve detailed profile from /users API:', error);
    }

    // Fallback: If API fails or user is not found in the list, set standard details
    const fallbackUser = {
      username: resolvedUsername,
      role: resolvedRole || (resolvedUsername.toLowerCase().includes('admin') ? 'ADMIN' : 'USER'),
      email: resolvedEmail || `${resolvedUsername}@example.com`,
      balance: 0.0,
    };
    setUser(fallbackUser);
    setToken(tokenVal);
    setLoading(false);
    return fallbackUser;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        await loadUserData(savedToken);
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (userData, tokenVal) => {
    localStorage.setItem('token', tokenVal);
    setToken(tokenVal);
    setLoading(true);
    // Fetch and resolve the full user profile details immediately and return it
    return await loadUserData(tokenVal, userData?.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    if (token) {
      await loadUserData(token, user?.username);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
