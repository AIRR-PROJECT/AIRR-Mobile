import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axiosInstance";
import { LoginCredentials, SetPasswordCredentials, SignUpCredentials, Tokens, VerifyAccountCredentials, VerifyPasswordCredentials } from "@/interfaces/authInterface";
import { Alert } from "react-native";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "@/interfaces/userInterface";
import { ResponseFailcode } from "@/enums/failcode.enum";
import { getReasonPhrase } from 'http-status-codes'
import jwt from 'expo-jwt'
import { jwtDecode } from "jwt-decode";

const initialState = {
    loading: false
};

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        showLoading(state) {
            state.loading = true
        },

        hideLoading(state) {
            state.loading = false
        },

        reset(state) {
            state.loading = false
        },

    },
});

export const { showLoading, hideLoading, reset } = loadingSlice.actions;
export default loadingSlice.reducer;