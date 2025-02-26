import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
const API_URL = process.env.BACKEND_URL;

const api = axios.create({
    baseURL: API_URL,
});

// Attach access token to every request
api.interceptors.request.use(async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Handle expired tokens automatically  x
api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try{
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                
                if (refreshToken) {
                    // Get new access token
                    const response = await api.post(`${API_URL}/auth/refresh`, { refreshToken });
                    if (response.status === 200) {
                        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
                        return api(originalRequest);
                    }
                }
                else {
                    throw new Error('No refresh token found');
                }
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default api;