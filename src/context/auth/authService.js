import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER || 'http://localhost:8080';

// Add request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
        const { accessToken } = response.data.data.auth;
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Signup new user
export const signup = async (userData) => {
  try {
        
    const response = await axios.post('/auth/signup', userData);
    const { data } = response.data;
    
    // Store user data
    localStorage.setItem('userId', JSON.stringify(data.userId));
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('username',data.user.username);
    
    // Store auth tokens
    localStorage.setItem('accessToken', data.auth.accessToken);
    localStorage.setItem('refreshToken', data.auth.refreshToken);
    
    return data.user;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Signup failed. Please try again.');
  }
};

// Login and store tokens
export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    const { data } = response.data;
    
    // Store user data
    localStorage.setItem('userId', data.user.userId);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('username',data.user.username);
    
    // Store auth tokens
    localStorage.setItem('accessToken', data.auth.accessToken);
    localStorage.setItem('refreshToken', data.auth.refreshToken);
    
    return data.user;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};

// Get current user
export const getCurrentUser = () => {
  const username = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  return username ? { username, role } : null;
};

// Verify token validity
export const verifyToken = async () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) return null;

  try {
    const response = await axios.get('/auth/verify');
    
    if (response.status===200) {
      // Return user data in the same format as login 
      return {
        userId:localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role')
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Check if user has required role
export const hasRole = (requiredRole) => {
  const role = localStorage.getItem('role');
  return role === requiredRole;
};

// Check if user has any of the required roles
export const hasAnyRole = (requiredRoles) => {
  const role = localStorage.getItem('role');
  return requiredRoles.includes(role);
};