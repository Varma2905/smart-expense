import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smart_expense_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smart_expense_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await authService.getMe();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('smart_expense_user', JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('[AuthContext] Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      const { token: jwtToken, ...userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('smart_expense_token', jwtToken);
      localStorage.setItem('smart_expense_user', JSON.stringify(userData));
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    if (response.success && response.data) {
      const { token: jwtToken, ...userData } = response.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('smart_expense_token', jwtToken);
      localStorage.setItem('smart_expense_user', JSON.stringify(userData));
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const updateUserState = (updatedUserData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedUserData };
      localStorage.setItem('smart_expense_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smart_expense_token');
    localStorage.removeItem('smart_expense_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUserState,
      }}
    >
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
