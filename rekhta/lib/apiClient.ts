import axios from 'axios';

const API_PROXY = '/api/rekhta';

export const apiClient = axios.create({
  baseURL: API_PROXY,
  timeout: 10000,
});

// Add request interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
