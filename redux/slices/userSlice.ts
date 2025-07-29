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
import { GroupMembershipStage, GroupRole } from "@/enums/group.enum";

const initialState = {
    userAccessToken: "",
    userRefreshToken: "",
    user: null as unknown as User,
    isViewingOwnProfile: false,
    userAvatar: "",
    userCurrentPassword: "",
    userNewPassword: "",
    userActivity: null,
    userChange: null as unknown as User,
    userGroups: null,
    userCurrentGroupMembershipStage: GroupMembershipStage.NOT_JOINED,
    userCurrentGroupRole: null as unknown as GroupRole,
    userChangeValid: true,
    isRefreshingToken: false
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
            state.userAvatar = action.payload.user.avatarURL
        },

        setIsViewingOwnProfile(state, action) {
            state.isViewingOwnProfile = action.payload
        },

        setUserChange(state, action) {
            state.userChange = action.payload
        },

        setUserAvatar(state, action) {
            state.userAvatar = action.payload
        },

        setUserPreviewGroup(state, action) {
            state.userGroups = action.payload.groups
        },

        setCurrentPassword(state, action) {
            state.userCurrentPassword = action.payload
        },

        setNewPassword(state, action) {
            state.userNewPassword = action.payload
        },

        setUserMembershipStageInCurrentGroup(state, action) {
            state.userCurrentGroupMembershipStage = action.payload
        },

        setUserRoleInCurrentGroup(state, action) {
            state.userCurrentGroupRole = action.payload
        },

        setUserChangeValid(state, action) {
            state.userChangeValid = action.payload
        },
        
        resetPassword(state) {
            state.userCurrentPassword = ""
            state.userNewPassword = ""
        },

        setIsRefreshingToken(state, action) {
            state.isRefreshingToken = action.payload
        },

        reset(state) {
            state.userAccessToken = "";
            state.userRefreshToken = "";
            state.user = null as unknown as User
            state.userAvatar = ""
            state.userCurrentPassword = ""
            state.userNewPassword = ""
            state.userChange = null as unknown as User
            state.userGroups = null
            state.userCurrentGroupRole = null as unknown as GroupRole
            state.userChangeValid = true;
            state.isRefreshingToken = false
        },

    },
});

export const { reset, resetPassword, setCurrentUser, setIsViewingOwnProfile, setUserChange, setUserAvatar, setTokens, setUserPreviewGroup, setCurrentPassword, setNewPassword, setUserMembershipStageInCurrentGroup, setUserRoleInCurrentGroup, setUserChangeValid, setIsRefreshingToken } = userSlice.actions;
export default userSlice.reducer;