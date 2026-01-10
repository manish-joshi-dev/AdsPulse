import React, { createContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const loadTokenFromStorage = () => {
    const storedToken = localStorage.getItem('adspulse_token');
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }
    return null;
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = loadTokenFromStorage();
      
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        setToken(storedToken);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem('adspulse_token');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem('adspulse_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem('adspulse_token', newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', { name, email, password });
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem('adspulse_token', newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adspulse_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
