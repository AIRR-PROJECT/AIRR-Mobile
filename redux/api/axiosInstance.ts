import { ResponseFailcode } from '@/enums/failcode.enum';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getReasonPhrase } from 'http-status-codes';
import { Alert, ToastAndroid } from 'react-native';
import { useAppDispatch } from '../hook';
import { reset, setTokens } from '../slices/userSlice';
import { Store } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import { hideLoading, showLoading } from '../slices/loadingSlice';
import { logout } from '../slices/authSlice';
import { AuthFailcodes } from '@/constants/AuthFailcodes';
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

let store: Store

export const injectStoreToAxiosInterceptor = (_store: Store) => {
  store = _store
}

let abortSignal: AbortController | undefined
export let abortRequest = () => {
    abortSignal?.abort()
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
    }
})

// Attach access token to every request
api.interceptors.request.use(async (config) => {
    // Create new abort signal to be used to cancel the request at any time (as long as it is still being processed)
    abortSignal = new AbortController()
    config.signal = abortSignal.signal
    
    // console.log(`noLoadingScrene: ${config["noLoadingScreen"]} - route: ${config.url}`)
    if (!config["noLoadingScreen"])
        store.dispatch(showLoading("Now sending request..."))

    const accessToken = store.getState().user.userAccessToken ?? await SecureStore.getItemAsync('accessToken');
    // const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im90dGVyLm9saXZlLjQ1OCIsInN1YiI6IjY3OGQwNmRlNjcyMjBlZTFjOWRlZDdkYiIsInJvbGUiOiJNZW1iZXIiLCJpYXQiOjE3NDE2OTg5NzQsImV4cCI6MTc0MTY5OTg3NH0.gfuXsPa2XR97yqYNNRZmn0R85MBSKPIK_L3L-yudDas"
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
        store.dispatch(hideLoading())

        abortSignal = undefined
        
        return response
    }, 
    async (error) => {
        const originalRequest = error.config;
        const exception_data = error.response?.data
        let exception_status: number = exception_data.status ?? ""
        let exception_failcode: number = exception_data.failcode ?? -1
        let exception_message: string = exception_data ? exception_data.message : error.message

        if (exception_data.status === 401) {
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
                            console.log("Tokens refreshed")
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
                            exception_failcode = response.data.failcode
                            if (response.status === 401 && 
                                (response.data.failcode === ResponseFailcode.TOKEN_INVALID || response.data.failcode === ResponseFailcode.ACCESS_EXPIRED)) {
                                
                                exception_message = "Session expired. Please re-login"

                                store.dispatch(reset())
                                await SecureStore.deleteItemAsync("accessToken")
                                await SecureStore.deleteItemAsync("refreshToken")
                                console.log("dismissed to first screen")

                                router.dismissTo("/auth")
                                try {
                                    router.reload()
                                }
                                catch {}
                                // if (router.canDismiss()){
                                //     console.log("Error")
                                // }
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
                    exception_failcode = error.response.data.failcode
                    if (error.status === 401 
                        && (error.response.data.failcode === ResponseFailcode.TOKEN_INVALID || error.response.data.failcode === ResponseFailcode.ACCESS_EXPIRED)) {
                        exception_message = "Session expired. Please re-login"

                        store.dispatch(reset())
                        await SecureStore.deleteItemAsync("accessToken")
                        await SecureStore.deleteItemAsync("refreshToken")
                        console.log("dismissed to first screen")

                        router.dismissTo("/auth")
                        try {
                            router.reload()
                        }
                        catch {}
                        // if (router.canDismiss()) {
                        //     console.log("Error")
                        //     router.dismissTo("/auth")
                        // }
                    }
                    else {
                        exception_message = error.response.data.message
                    }
                }
            }
        }
    
        store.dispatch(hideLoading())
        abortSignal = undefined
        if (!AuthFailcodes.includes(exception_failcode)) {
            ToastAndroid.show(`(${exception_status}) (${exception_failcode}) ${exception_message}`, ToastAndroid.LONG)
        }
        else {
            Alert.alert("Error:", exception_message)
        }
        return Promise.reject(error);
    }
);

export default api;