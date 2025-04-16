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
import { Group, GroupField, PopularGroups } from "@/interfaces/groupInterface";

const initialState = {
    popularFields: null as any as GroupField[],
    popularGroups: null as any as PopularGroups[]
};

export const getGroupPopularFields = createAsyncThunk(
    'group/getGroupPopularFields',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`groups/popular-fields`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.fields as GroupField[]
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const getPopularGroups = createAsyncThunk(
    'group/getPopularGroups',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`groups/popular-groups`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as PopularGroups[]
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        reset(state) {
            state.popularFields = null as any as GroupField[]
            state.popularGroups = null as any as PopularGroups[]
        },
    
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGroupPopularFields.fulfilled, (state, action) => {
                state.popularFields = action.payload
            })
            .addCase(getGroupPopularFields.rejected, (state, action) => {
                console.log(action.error)
            }) 
            .addCase(getPopularGroups.fulfilled, (state, action) => {
                state.popularGroups = action.payload
            })
            .addCase(getPopularGroups.rejected, (state, action) => {
                console.log(action.error)
            }) 
    }

});

export const { reset } = groupSlice.actions;
export default groupSlice.reducer;