import axios from 'axios';
import siteConfig from '@/config/config.json';
const API_URL = siteConfig.api.invokeUrl;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
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

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshResponse = await api.post('/auth/refresh-token');
                const { accessToken } = refreshResponse.data;
                localStorage.setItem('accessToken', accessToken);
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(error.config);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;