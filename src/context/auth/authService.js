import axios from 'axios';

const API_URL = 'your_api_url';

// Login and store token
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  const { token, user } = response.data;
  
  // Store token and user data
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

// Logout
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Verify token validity
export const verifyToken = async () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;

  try {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.valid ? getCurrentUser() : null;
  } catch (error) {
    return null;
  }
};