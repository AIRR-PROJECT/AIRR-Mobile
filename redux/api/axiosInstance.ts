import { ResponseFailcode } from '@/enums/failcode.enum';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getReasonPhrase } from 'http-status-codes';
import { Alert } from 'react-native';
import { useAppDispatch } from '../hook';
import { setAuthData } from '../slices/authSlice';
import store from '../store';
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    }
});

// Attach access token to every request
api.interceptors.request.use(async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    // If already has a token in auth header, that is the refresh token => skip this
    if (accessToken && !config.headers.hasAuthorization()) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {Promise.reject(error)});

// Handle expired tokens automatically  x
api.interceptors.response.use(
    (response) => {
        return response
    }, 
    async (error) => {
        const originalRequest = error.config;
        const exception_data = error.response?.data
        let exception_status: number = error.status
        let exception_failcode: number
        let exception_message: string = exception_data.message

        console.log(exception_data)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Don't refresh token if the error is not related to access token's expiration
            if (error.response?.data.failcode === ResponseFailcode.ACCESS_EXPIRED || error.response?.data.failcode === ResponseFailcode.JWT_NOT_FOUND) {
                try {
                    const refreshToken = await SecureStore.getItemAsync('refreshToken');
                    
                    if (refreshToken) {
                        // Get new access token
                        const response = await api.post(`/auth/refresh-auth`, undefined, {
                            headers: {
                                Authorization: "Bearer " + refreshToken
                            }
                        });
                        
                        console.log(response)
                        if (response.status === 200) {
                            store.dispatch(setAuthData({
                                userAccessToken: response.data.access_token,
                                userRefreshToken: response.data.refresh_token
                            }))
                            return api(originalRequest);
                        }
                        else {
                            exception_status = response.status
                            if (response.status === 401) {
                                exception_message = "Session expired. Please re-login"
                            }
                            else {
                                exception_message = response.data.message
                            }
                        }
                    }
                    else {
                        exception_status = -1
                        exception_message = "Refresh token not found"
                    }
                }
                catch (error: any) {
                    exception_status = error.status
                    exception_message = error.response.data.message
                }
            }
        }
    
        // if (exception_data) {
        //     if ((exception_data as APIResponse).message) {
        //         Alert.alert("Error: " + error.status, (exception_data as APIResponse).message)
        //     }
        //     else {
        //         Alert.alert("Error" + error.status, exception_data as string)
        //     }
        // }
        // else {
        //     Alert.alert("Error" + error.status, getReasonPhrase(error.status))
        // }
        Alert.alert((exception_status != -1 ? "Error: " + exception_status : "Error"), exception_message)
        return Promise.reject(error);
    }
);

export default api;