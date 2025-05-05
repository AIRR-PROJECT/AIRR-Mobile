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
import { NotificationResponseData, RegisterNotifToken, UpdateSeenNotif } from "@/interfaces/notifInterface";

const initialState = {
    notifCount: 0
};

export const registerNotifToken = createAsyncThunk(
    'notif/registerToken',
    async (dto: RegisterNotifToken, thunkAPI) => {
        try {
            const res = await api.post(`notif/register-token`, dto) as AxiosResponse
            console.log(res)

            if (res.data.success) {

            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const getAllNotif = createAsyncThunk(
    'notif/getAll',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`notif/all`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.notifications as NotificationResponseData[]
            }
            else {
                return []
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const countUnseenNotif = createAsyncThunk(
    'notif/countUnseen',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`notif/count-unseen`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.notifications
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const updateSeenNotif = createAsyncThunk(
    'notif/updateSeen',
    async (dto: UpdateSeenNotif, thunkAPI) => {
        try {
            const res = await api.post(`notif/update-seen`, dto) as AxiosResponse
            console.log(res)

            if (res.data.success) {

            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

const notifSlice = createSlice({
    name: "notif",
    initialState,
    reducers: {
        reset(state) {
            
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotif.fulfilled, (state, action) => {

            })
            .addCase(getAllNotif.rejected, (state, action) => {
                
            })
            .addCase(countUnseenNotif.fulfilled, (state, action) => {
                state.notifCount = action.payload
            })
            .addCase(countUnseenNotif.rejected, (state, action) => {
                
            })
    }
});

export const { reset } = notifSlice.actions;
export default notifSlice.reducer;