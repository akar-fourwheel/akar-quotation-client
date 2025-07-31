import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER + '/api/v1',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;