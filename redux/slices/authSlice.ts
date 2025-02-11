import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isLoading } from "expo-font";

// Async thunks 
export const login = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        // Perform async operation here
        return data;
    }
)

const initialState = {
    userId: null,
    userAccessToken: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData(state, action) {
            state.userId = action.payload.userId;
            state.userAccessToken = action.payload.userAccessToken;
        },

        setLoading(state, action) {
            state.isLoading = action.payload
        },

        logout(state) {
            state.userId = null;
            state.userAccessToken = null;
        },

    },
});

export const { setAuthData, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;