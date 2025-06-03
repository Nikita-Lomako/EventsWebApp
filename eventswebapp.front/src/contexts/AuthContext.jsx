import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'https://localhost:7154';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext(null);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set up axios default headers with Bearer prefix
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Since we don't have a /api/me endpoint, we'll just set loading to false
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.isSuccess) {
        const { token, user } = response.data.result;
        // Store the raw token without Bearer prefix
        localStorage.setItem('token', token);
        // Add Bearer prefix when setting the Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return { success: true };
      } else {
        throw new Error(response.data.errorMessages?.[0] || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/register', {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
      });
      if (response.data.isSuccess) {
        return { 
          success: true, 
          message: 'Registration successful! Please login with your credentials.' 
        };
      } else {
        throw new Error(response.data.errorMessages?.[0] || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 