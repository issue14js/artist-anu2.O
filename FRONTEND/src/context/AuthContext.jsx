import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL ;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios with credentials
  axios.defaults.withCredentials = true;

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`);
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (name, email, password, passwordConfirm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
        passwordConfirm,
      });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Signup failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/api/profile/update`, profileData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Profile update failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = userId ? `/profile/${userId}` : '/profile/current/me';
      const res = await axios.get(`${API_URL}${endpoint}`);
      return res.data.user;
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to fetch profile';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (avatar) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`${API_URL}/profile/avatar`, { avatar });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.error || 'Avatar upload failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async (search = '', specialization = '') => {
    try {
      const res = await axios.get(`${API_URL}/profile/users/all`, {
        params: { search, specialization }
      });
      return res.data.users;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      throw new Error('Failed to fetch users');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signup,
      login,
      logout,
      updateProfile,
      getProfile,
      uploadAvatar,
      getAllUsers,
      setError,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
