import axiosInstance from '../utils/axiosInstance';

// Helper function to handle API responses
const handleResponse = (response) => {
  if (response.data) {
    return response.data;
  }
  return { success: false, message: 'Invalid response format' };
};

// Helper function to handle API errors
const handleError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || `HTTP ${status} Error`;
    
    if (status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Authentication required. Please login again.');
    } else if (status === 403) {
      throw new Error('Access denied. Insufficient permissions.');
    } else {
      throw new Error(message);
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

// General Dashboard APIs
export const getDashboardOverview = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/overview${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getDashboardOverview');
  }
};

export const getDashboardConfig = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/config');
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getDashboardConfig');
  }
};

export const getActivityFeed = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/activity${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getActivityFeed');
  }
};

export const getRealTimeMetrics = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/real-time');
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getRealTimeMetrics');
  }
};

export const exportDashboardData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/export${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'exportDashboardData');
  }
};

// Sales Dashboard APIs
export const getSalesDashboard = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/sales${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getSalesDashboard');
  }
};

export const getSalesPerformanceComparison = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/sales/performance${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getSalesPerformanceComparison');
  }
};

// Team Lead Dashboard APIs
export const getTeamLeadDashboard = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/team-lead${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getTeamLeadDashboard');
  }
};

export const approveBookingRequest = async (bookingData) => {
  try {
    setIsLoading(true);
    const response = await axios.get('/pending-booking-requests');
    
    if (response.data.success) {
      setPendingRequests(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    showError('Failed to fetch pending requests');
  } finally {
    setIsLoading(false);
  }
};

// Manager Dashboard APIs
export const getManagerDashboard = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/manager${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getManagerDashboard');
  }
};

export const getDetailedTeamReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/manager/team-report${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getDetailedTeamReport');
  }
};

// Analytics APIs deprecated in simplified SM view

// Admin Dashboard APIs
export const getAdminDashboard = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/dashboard/admin${queryParams ? `?${queryParams}` : ''}`;
    const response = await axiosInstance.get(url);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getAdminDashboard');
  }
};

export const getSystemHealth = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/admin/system-health');
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'getSystemHealth');
  }
};

// Test endpoint
export const testDashboardConnection = async () => {
  try {
    const response = await axiosInstance.get('/dashboard/test');
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'testDashboardConnection');
  }
};

// Debug function to check authentication status
export const debugAuth = () => {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('Debug Auth Status:', {
    hasAccessToken: !!token,
    hasRefreshToken: !!refreshToken,
    accessToken: token ? `${token.substring(0, 10)}...` : 'None',
    tokenLength: token ? token.length : 0
  });
  
  return {
    hasAccessToken: !!token,
    hasRefreshToken: !!refreshToken,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'None'
  };
};

export default {
  getDashboardOverview,
  getDashboardConfig,
  getActivityFeed,
  getRealTimeMetrics,
  exportDashboardData,
  getSalesDashboard,
  getSalesPerformanceComparison,
  getTeamLeadDashboard,
  approveBookingRequest,
  getManagerDashboard,
  getDetailedTeamReport,
  getAdminDashboard,
  getSystemHealth,
  testDashboardConnection,
  debugAuth
};