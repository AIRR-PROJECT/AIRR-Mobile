import { ResponseFailcode } from '@/enums/failcode.enum';
import axios, { HttpStatusCode } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getReasonPhrase } from 'http-status-codes';
import { Alert, ToastAndroid } from 'react-native';
import { useAppDispatch } from '../hook';
import { reset, setIsRefreshingToken, setTokens } from '../slices/userSlice';
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
let abortTimeout: NodeJS.Timeout | undefined
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
  if (abortSignal === undefined || abortSignal?.signal.aborted)
    abortSignal = new AbortController();
  config.signal = abortSignal.signal;

  if (!config["noLoadingScreen"])
    store.dispatch(showLoading("Now sending request..."));

  // Use in-memory cache to avoid repeated SecureStore reads
  // FIX access token by using a cache
  let accessToken = store.getState().user.userAccessToken ?? await SecureStore.getItemAsync("accessToken");
//   console.log(`Current access token: ${accessToken}`)
//   console.log(`Current request url: ${config.url}`)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Abort timeout
  abortTimeout = setTimeout(() => {
    console.log(`Aborted: ${config.url}`)
    abortSignal?.abort()
  }, 20000)

  return config;
}, (error) => Promise.reject(error));

let isRefreshing = false
let justRefreshed = false
// Handle expired tokens automatically  x
api.interceptors.response.use(
    (response) => {
        // Stop abort timeout
        clearTimeout(abortTimeout)
        abortTimeout = undefined

        // console.log(`url: ${response.request.responseURL}`)
        // console.log(`success`)
        store.dispatch(hideLoading())
        abortSignal = undefined

        return response
    }, 
    async (error) => {
        // Stop abort timeout
        clearTimeout(abortTimeout)
        abortTimeout = undefined

        // On abort
        if (error.name && error.name == "CanceledError") {
            store.dispatch(hideLoading())
            abortSignal = undefined

            Alert.alert("Error", "The request took too long and was aborted.")

            return Promise.reject(error);
        }

        const originalRequest = error.config;
        const exception_data = error.response?.data
        let exception_status: number = exception_data.status ?? error.response.status ?? ""
        let exception_failcode: number = exception_data.failcode ?? -1
        let exception_message: string = exception_data ? exception_data.message : error.message

        if (exception_status === HttpStatusCode.Unauthorized) {
            // Don't refresh token if the error is not related to access token's expiration
            if (error.response?.data.failcode === ResponseFailcode.ACCESS_EXPIRED || error.response?.data.failcode === ResponseFailcode.JWT_NOT_FOUND) {
                try {
                    const refreshToken = store.getState().user.userRefreshToken ?? await SecureStore.getItemAsync('refreshToken');
                    const isRefreshingToken = store.getState().user.isRefreshingToken

                    if (refreshToken) {
                        isRefreshing = true

                        // Get new access token
                        const response = await axios.post(`${API_URL}/auth/refresh-auth`, undefined, {
                            headers: {
                                Authorization: "Bearer " + refreshToken
                            }
                        });
                        
                        if (response.status === 200) {
                            console.log("Tokens refreshed: ")
                            console.log(response.data.data)
                            await SecureStore.setItemAsync('accessToken', response.data.data.tokens.access_token);
                            await SecureStore.setItemAsync('refreshToken', response.data.data.tokens.refresh_token);
                            store.dispatch(setTokens({
                              accessToken: response.data.data.tokens.access_token,
                              refreshToken: response.data.data.tokens.refresh_token
                            }))
                            justRefreshed = true
                            isRefreshing = false
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
                                console.log("dismissed to first screen (1)")

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

                        store.dispatch(reset())
                        await SecureStore.deleteItemAsync("accessToken")
                        await SecureStore.deleteItemAsync("refreshToken")
                        console.log("dismissed to first screen (1)")

                        router.dismissTo("/auth")
                        try {
                            router.reload()
                        }
                        catch {}
                    }
                }
                catch (error: any) {
                    // console.log("After refreshing")
                    // console.log(error.response)
                    exception_status = error.status
                    exception_failcode = error.response.data.failcode
                    if (error.status === 401 
                        && ((error.response.data.failcode === ResponseFailcode.TOKEN_INVALID && !justRefreshed && !isRefreshing) || error.response.data.failcode === ResponseFailcode.ACCESS_EXPIRED)) {
                        exception_message = "Session expired. Please re-login"

                        store.dispatch(reset())
                        await SecureStore.deleteItemAsync("accessToken")
                        await SecureStore.deleteItemAsync("refreshToken")
                        console.log("dismissed to first screen (2)")

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
                    else if (error.response.data.failcode === ResponseFailcode.TOKEN_INVALID && (justRefreshed || isRefreshing)) {
                        console.log("trying again")
                        return api.request(error.config)
                    }
                    else {
                        exception_message = error.response.data.message
                    }
                }
            }
        }
    
        store.dispatch(hideLoading())
        abortSignal = undefined
        if (!justRefreshed && !isRefreshing) {
            if (!AuthFailcodes.includes(exception_failcode)) {
                if (exception_status == -1) {
                    ToastAndroid.show(`(${exception_failcode}) ${exception_message}`, ToastAndroid.LONG)
                }
                else if (exception_failcode == -1) {
                    ToastAndroid.show(`(${exception_status}) ${exception_message}`, ToastAndroid.LONG)
                }
                else {
                    ToastAndroid.show(`(${exception_failcode}) (${exception_status}) ${exception_message}`, ToastAndroid.LONG)
                }
            }
            else {
                Alert.alert("Error:", exception_message)
            }
        }
        return Promise.reject(error);
    }
);

export default api;