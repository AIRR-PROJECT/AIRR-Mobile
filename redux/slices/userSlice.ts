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
    userAccessToken: "",
    userRefreshToken: "",
    user: null,
    userChange: null,
    userGroups: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setTokens(state, action) {
            state.userAccessToken = action.payload.accessToken
            state.userRefreshToken = action.payload.refreshToken
        },

        setCurrentUser(state, action) {
            state.user = action.payload.user
            state.userChange = action.payload.user
        },

        setUserChange(state, action) {
            state.userChange = action.payload
        },

        setUserPreviewGroup(state, action) {
            state.userGroups = action.payload.groups
        },

        reset(state) {
            state.userAccessToken = "";
            state.userRefreshToken = "";
            state.user = null
            state.userChange = null
            state.userGroups = null
        },

    },
});

export const { reset, setCurrentUser, setUserChange, setTokens, setUserPreviewGroup } = userSlice.actions;
export default userSlice.reducer;