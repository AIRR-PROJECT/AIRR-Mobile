import { ResponseFailcode } from '@/enums/failcode.enum';
import axios, { AxiosRequestConfig, HttpStatusCode } from 'axios';
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

let store: Store;

export const injectStoreToAxiosInterceptor = (_store: Store) => {
  store = _store;
};

// Extend AxiosRequestConfig to allow custom fields
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _abortController?: AbortController;
  _abortTimeout?: NodeJS.Timeout;
  _retry?: boolean;
}

export const abortRequest = (config: CustomAxiosRequestConfig) => {
  config._abortController?.abort();
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Queue for failed requests during token refresh
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: any;
}> = [];

let isRefreshing = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      resolve(api.request(config));
    }
  });
  
  failedQueue = [];
};

// Centralized logout function to ensure consistent cleanup
const performLogout = async (message: string = "Session expired. Please re-login") => {
  try {
    // Always hide loading first
    store.dispatch(hideLoading());
    
    // Reset flags
    isRefreshing = false;
    store.dispatch(setIsRefreshingToken(false));
    
    // Clear failed queue
    processQueue(new Error(message), null);
    
    // Clear Redux state
    store.dispatch(reset());
    store.dispatch(logout());
    
    // Clear secure storage
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } catch (deleteError) {
      console.error('Error deleting tokens:', deleteError);
    }
    
    // Navigate to auth
    try {
      router.dismissTo("/auth");
      // Add a small delay before reload to avoid timing conflicts
      setTimeout(() => {
        try {
          router.reload();
        } catch (reloadError) {
          console.error('Router reload failed:', reloadError);
          // Reload failure is not critical - user can manually refresh
        }
      }, 100);
    } catch (routerError) {
      console.error('Router dismissTo failed:', routerError);
      // Fallback navigation
      try {
        router.replace("/auth");
      } catch (replaceError) {
        console.error('Router replace also failed:', replaceError);
      }
    }
  } catch (logoutError) {
    console.error('Error during logout:', logoutError);
    // Ensure loading is hidden even if logout fails
    store.dispatch(hideLoading());
  }
};

// Attach access token to every request
api.interceptors.request.use(async (config: CustomAxiosRequestConfig) => {
  // Log every outgoing request
  console.log(
    `[API REQUEST] ${config.method?.toUpperCase() || "GET"} ${config.baseURL}${config.url}`,
    config
  );

  const controller = new AbortController();
  config.signal = controller.signal;
  config._abortController = controller; // Attach for later use

  if (!config["noLoadingScreen"])
    store.dispatch(showLoading("Now sending request..."));

  // Use in-memory cache to avoid repeated SecureStore reads
  let accessToken = store.getState().user.userAccessToken ?? await SecureStore.getItemAsync("accessToken");

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // Abort timeout
  config._abortTimeout = setTimeout(() => {
    console.log(`Aborted: ${config.url}`);
    config._abortController?.abort();
  }, 20000); // 20 seconds timeout

  return config;
}, (error) => Promise.reject(error));

// Handle expired tokens automatically
api.interceptors.response.use(
  (response) => {
    // Stop abort timeout
    const config = response.config as CustomAxiosRequestConfig;
    if (config._abortTimeout) clearTimeout(config._abortTimeout);

    if (!config["noLoadingScreen"]) {
      store.dispatch(hideLoading());
    }
    return response;
  },
  async (error) => {
    const config = (error.config || {}) as CustomAxiosRequestConfig;
    if (config._abortTimeout) clearTimeout(config._abortTimeout);

    // On abort
    if (error.name && error.name === "CanceledError") {
      if (!config["noLoadingScreen"]) {
        store.dispatch(hideLoading());
      }
      Alert.alert("Error", "Request timed out.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const exception_data = error.response?.data;
    let exception_status: number = exception_data?.status ?? error.response?.status ?? -1;
    let exception_failcode: number = exception_data?.failcode ?? -1;
    let exception_message: string = exception_data ? exception_data.message : error.message;

    // Handle token refresh logic
    if (exception_status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
      // Don't refresh token if the error is not related to access token's expiration
      if (
        error.response?.data?.failcode === ResponseFailcode.ACCESS_EXPIRED ||
        error.response?.data?.failcode === ResponseFailcode.JWT_NOT_FOUND
      ) {
        
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        store.dispatch(setIsRefreshingToken(true));

        try {
          const refreshToken =
            store.getState().user.userRefreshToken ??
            await SecureStore.getItemAsync('refreshToken');

          if (!refreshToken) {
            console.error('No refresh token available');
            await performLogout("Session expired. Please re-login");
            return Promise.reject(new Error('No refresh token available'));
          }

          // Create a separate axios instance for refresh to avoid interceptor loops
          const refreshResponse = await axios.post(
            `${API_URL}/auth/refresh-auth`,
            undefined,
            {
              headers: {
                Authorization: "Bearer " + refreshToken,
              },
              timeout: 10000, // 10 second timeout for refresh
            }
          );

          if (refreshResponse.status === 200 && refreshResponse.data?.data?.tokens) {
            const newAccessToken = refreshResponse.data.data.tokens.access_token;
            const newRefreshToken = refreshResponse.data.data.tokens.refresh_token;
            
            if (!newAccessToken || !newRefreshToken) {
              throw new Error('Invalid token response structure');
            }
            
            // Store new tokens
            await SecureStore.setItemAsync('accessToken', newAccessToken);
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            
            store.dispatch(
              setTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              })
            );

            // Update the original request with new token
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Process queued requests
            processQueue(null, newAccessToken);
            
            // Reset flags
            isRefreshing = false;
            store.dispatch(setIsRefreshingToken(false));
            
            return api.request(originalRequest);
          } else {
            throw new Error(`Token refresh failed with status: ${refreshResponse.status}`);
          }
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError);
          
          // Determine if this is a network error or auth error
          const isNetworkError = !refreshError.response;
          const isAuthError = refreshError.response?.status === 401;
          
          if (isAuthError || refreshError.response?.data?.failcode === ResponseFailcode.TOKEN_INVALID) {
            // Refresh token is invalid - logout
            await performLogout("Session expired. Please re-login");
          } else if (isNetworkError) {
            // Network error - don't logout, just fail the request
            isRefreshing = false;
            store.dispatch(setIsRefreshingToken(false));
            store.dispatch(hideLoading());
            processQueue(refreshError, null);
          } else {
            // Other error - logout to be safe
            await performLogout("Authentication error. Please re-login");
          }
          
          return Promise.reject(refreshError);
        }
      }
    }

    // Hide loading screen for non-refresh errors
    if (!config["noLoadingScreen"]) {
      store.dispatch(hideLoading());
    }

    // Show error messages only if not currently refreshing tokens
    if (!isRefreshing) {
      if (!AuthFailcodes.includes(exception_failcode)) {
        let errorMessage = '';
        if (exception_status === -1) {
          errorMessage = `(${exception_failcode}) ${exception_message}`;
        } else if (exception_failcode === -1) {
          errorMessage = `(${exception_status}) ${exception_message}`;
        } else {
          errorMessage = `(${exception_failcode}) (${exception_status}) ${exception_message}`;
        }
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      } else {
        Alert.alert("Error", exception_message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;