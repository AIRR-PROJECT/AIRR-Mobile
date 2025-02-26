import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axiosInstance";

const initialState = {
    userAccessToken: null,
    userRefreshToken: null,
    isLoading: true,
    error: null
};

// Async thunks 
export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        // Perform async operation here
        try {
            const response = await api.post(`${API_URL}/auth/login`, credentials);
            const { accessToken, refreshToken } = response.data;

            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);

            return { accessToken, refreshToken };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
       
    }
)

export const loadToken = createAsyncThunk(
    'auth/loadToken',
    async () => {
        // Perform async operation here
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');   
        return { accessToken, refreshToken }; 
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.userAccessToken = action.payload.userAccessToken;
        },

        setLoading(state, action) {
            state.isLoading = action.payload
        },

        logout(state) {
            state.userAccessToken = null;
            state.userRefreshToken = null;
            SecureStore.deleteItemAsync('accessToken');
            SecureStore.deleteItemAsync('refreshToken');
        },

    },
    extraReducers: (builder) => {
        
    },
});

export const { setAuthData, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;