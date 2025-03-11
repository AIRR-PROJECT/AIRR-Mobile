import { ResponseFailcode } from '@/enums/failcode.enum';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getReasonPhrase } from 'http-status-codes';
import { Alert } from 'react-native';
import { useAppDispatch } from '../hook';
import { setTokens } from '../slices/userSlice';
import { Store } from '@reduxjs/toolkit';
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

let store: Store

export const injectStoreToAxiosInterceptor = (_store: Store) => {
  store = _store
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    }
})

// Attach access token to every request
api.interceptors.request.use(async (config) => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    // If already has a token in auth header, that is the refresh token => skip this
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    Promise.reject(error)
});

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

        if (error.response?.status === 401) {
            // Don't refresh token if the error is not related to access token's expiration
            if (error.response?.data.failcode === ResponseFailcode.ACCESS_EXPIRED || error.response?.data.failcode === ResponseFailcode.JWT_NOT_FOUND) {
                try {
                    const refreshToken = await SecureStore.getItemAsync('refreshToken');
                    
                    if (refreshToken) {
                        // Get new access token
                        const response = await axios.post(`${API_URL}/auth/refresh-auth`, undefined, {
                            headers: {
                                Authorization: "Bearer " + refreshToken
                            }
                        });
                        
                        if (response.status === 200) {
                            await SecureStore.setItemAsync('accessToken', response.data.data.tokens.access_token);
                            await SecureStore.setItemAsync('refreshToken', response.data.data.tokens.refresh_token);
                            store.dispatch(setTokens({
                              accessToken: response.data.data.tokens.access_token,
                              refreshToken: response.data.data.tokens.refresh_token
                            }))
                            return api.request(error.config)
                        }
                        else {
                            exception_status = response.status
                            if (response.status === 401 && response.data.failcode === ResponseFailcode.TOKEN_INVALID) {
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
                    if (error.status === 401 && error.response.data.failcode === ResponseFailcode.TOKEN_INVALID) {
                        exception_message = "Session expired. Please re-login"
                    }
                    else {
                        exception_message = error.response.data.message
                    }
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