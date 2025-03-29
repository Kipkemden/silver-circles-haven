
import axios from 'axios';

const authInterceptor = axios.create();

authInterceptor.interceptors.request.use(
  async (config) => {
    const session = JSON.parse(sessionStorage.getItem('session') || 'null');
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInterceptor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement refresh token logic here
        return authInterceptor(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure
        sessionStorage.removeItem('session');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default authInterceptor;
