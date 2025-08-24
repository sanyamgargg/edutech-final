import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      toast.success('Account created successfully! Please login.');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const sendOTP = async (email) => {
    try {
      await authAPI.sendOTP({ email });
      toast.success('OTP sent to your email!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authAPI.changePassword({ oldPassword, newPassword });
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    sendOTP,
    changePassword,
    isAuthenticated: !!token,
    isStudent: user?.accountType === 'Student',
    isInstructor: user?.accountType === 'Instructor',
    isAdmin: user?.accountType === 'Admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 