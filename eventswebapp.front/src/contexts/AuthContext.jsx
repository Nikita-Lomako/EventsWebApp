import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      // The role claim is in the 'role' property of the token
      const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
      return {
        id: decoded.nameid,
        email: decoded.email,
        roles: roles
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set up axios default headers with Bearer prefix
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const decodedUser = decodeToken(token);
      setUser(decodedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.isSuccess) {
        const { token } = response.data.result;
        // Store the raw token without Bearer prefix
        localStorage.setItem('token', token);
        // Add Bearer prefix when setting the Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
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
        confirmPassword: userData.confirmPassword
      });
      
      if (response.data.isSuccess) {
        return { 
          success: true, 
          message: 'Registration successful! Please login with your credentials.' 
        };
      } else {
        const errorMessage = response.data.errorMessages?.[0] || 'Registration failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errorMessages?.length > 0) {
        throw new Error(error.response.data.errorMessages[0]);
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
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
    isAdmin: user?.roles?.includes('admin') || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 