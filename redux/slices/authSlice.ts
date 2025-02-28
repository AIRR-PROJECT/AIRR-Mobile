import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axiosInstance";
import { LoginCredentials, SetPasswordCredentials, SignUpCredentials, Tokens, VerifyAccountCredentials, VerifyPasswordCredentials } from "@/interfaces/authInterface";
import { Alert } from "react-native";
import axios, { AxiosRequestConfig } from "axios";
import { User, UserInfo } from "@/interfaces/userInterace";
import { ResponseFailcode } from "@/enums/failcode.enum";

const initialState = {
    userAccessToken: "",
    userRefreshToken: "",
    isAccountCreated: false,
    isLoggedIn: false,
    isAccountVerified: false,
    isPasswordVerified: false,
    passwordVerifyToken: "",
    changedPassword: false,
    isLoading: true,
    error: null
};

let token = ""

// Async thunks 
export const login = createAsyncThunk<Tokens, LoginCredentials>(
    'auth/login',
    async (data: LoginCredentials, thunkAPI) => {
        try {
            // Perform async operation here
            let loginData = {
                email: data.email,
                password: data.password
            }
            // const response = await axios.request(
            //     config
            // )
            const response = await api.post('auth/sign-in', loginData);
            const { access_token, refresh_token } = response.data.data;
            
            // await SecureStore.setItemAsync('accessToken', accessToken);
            // await SecureStore.setItemAsync('refreshToken', refreshToken);

            if (access_token === undefined) {
                return thunkAPI.rejectWithValue("Access token must not be undefined")
            }
            if (refresh_token === undefined) {
                return thunkAPI.rejectWithValue("Refresh token must not be undefined")
            }
    
            return { 
                accessToken: access_token,
                refreshToken: refresh_token
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const signup = createAsyncThunk<UserInfo, SignUpCredentials>(
    'auth/sign-up',
    async (data: SignUpCredentials, thunkAPI) => {
        try {
            // Perform async operation here
            let signUpData = {
                username: data.username,
                email: data.email,
                password: data.password
            }
            let config: AxiosRequestConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'auth/create',
                data : signUpData
            };
            // const response = await axios.request(
            //     config
            // )
            const response = await api.request(config);
            const { 
                username, 
                id, 
                email, 
                firstName, 
                lastName, 
                dateOfBirth, 
                isAuthenticatedWithGoogle, 
                phoneNumber,
                joinDate,
                survey,
                role,
                profile    
            } = response.data;
    
            // await SecureStore.setItemAsync('accessToken', accessToken);
            // await SecureStore.setItemAsync('refreshToken', refreshToken);
    
            return { 
                username: username,
                id: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                isAuthenticatedWithGoogle: isAuthenticatedWithGoogle,
                phoneNumber: phoneNumber,
                joinDate: joinDate,
                survey: survey,
                role: role,
                profile: profile
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const sendAccountOTP = createAsyncThunk(
    'auth/send-account-otp', 
    async (data: { email: string }) => {
        await api.get(`auth/resend-account-otp?email=${data.email}`)
    }
)

export const sendPasswordOTP = createAsyncThunk(
    'auth/send-password-otp', 
    async (data: { email: string }) => {
        await api.get(`auth/forget-password?email=${data.email}`)
    }
)

export const verifyAccountOTP = createAsyncThunk<APIResponse, VerifyAccountCredentials>(
    'auth/verify-account-otp',
    async (data: VerifyAccountCredentials) => {
        const verify = await api.post('auth/verify-account-otp', data) as APIResponse
        
        return verify
    }
)

export const verifyPasswordOTP = createAsyncThunk<APIResponse, VerifyPasswordCredentials>(
    'auth/verify-password-otp',
    async (data: VerifyPasswordCredentials) => {
        const verify = await api.post('auth/verify-password-otp', data) as APIResponse
        
        return verify
    }
)

export const setPassword = createAsyncThunk<APIResponse, SetPasswordCredentials>(
    'auth/change-password',
    async (data: SetPasswordCredentials) => {
        // const token = await SecureStore.getItemAsync('passwordToken')
        console.log(token)

        const set = await api.post('auth/change-password', data, {
            headers: {
                Authorization: `Bearer ${token}`
              }
        }) as APIResponse

        return set
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
            state.userRefreshToken = action.payload.userRefreshToken;
            state.isLoggedIn = true
            state.isAccountVerified = true
        },

        setLoading(state, action) {
            state.isLoading = action.payload
        },

        resetLoggedIn(state, _) {
            state.isLoggedIn = false
        },

        resetAccountCreated(state, _) {
            state.isAccountCreated = false
        },
        
        resetPasswordVerified(state, _) {
            state.isPasswordVerified = false
        },

        resetChangedPassword(state, _) {
            state.changedPassword = false
        },

        resetPasswordToken(state, _) {
            state.passwordVerifyToken = ""
        },

        logout(state) {
            state.userAccessToken = "";
            state.userRefreshToken = "";
            SecureStore.deleteItemAsync('accessToken');
            SecureStore.deleteItemAsync('refreshToken');
            state.isLoggedIn = false
            state.isAccountVerified = false
            state.isPasswordVerified = false
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                const accessToken = action.payload.accessToken
                const refreshToken = action.payload.refreshToken

                state.userAccessToken = accessToken
                state.userRefreshToken = refreshToken
                SecureStore.setItemAsync('accessToken', accessToken)
                SecureStore.setItemAsync('refreshToken', refreshToken)
                state.isLoggedIn = true
                state.isAccountVerified = true
            })
            .addCase(login.rejected, (state, action) => {
                if ((action.payload as APIResponse).message) {
                    Alert.alert("Error", (action.payload as APIResponse).message)

                    const payload = (action.payload as APIResponse)
                    if (payload.failcode === ResponseFailcode.USER_UNVERIFIED) {
                        state.isLoggedIn = true
                    }
                }
                else if (action.payload) {
                    Alert.alert("Error", action.payload as string)
                }
                else {
                    Alert.alert("Error", action.error.message)
                }
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isAccountCreated = true
            })
            .addCase(signup.rejected, (state, action) => {
                if ((action.payload as APIResponse).message) {
                    Alert.alert("Error", (action.payload as APIResponse).message)
                }
                else if (action.payload) {
                    Alert.alert("Error", action.payload as string)
                }
                else {
                    Alert.alert("Error", action.error.message)
                }
            })
            .addCase(verifyAccountOTP.fulfilled, (state, action) => {
                state.isAccountVerified = true
            })
            .addCase(verifyPasswordOTP.fulfilled, (state, action) => {
                state.isPasswordVerified = true
                token = action.payload.data.data.change_password_token
                SecureStore.setItemAsync('passwordToken', action.payload.data.data.change_password_token)
            })
            .addCase(verifyPasswordOTP.rejected, (state, action) => {
                console.log(action.payload !== undefined)
                if ((action.payload as APIResponse).message) {
                    Alert.alert("Error", (action.payload as APIResponse).message)
                }
                else if (action.payload !== undefined) {
                    Alert.alert("Error", action.payload as string)
                }
                
                Alert.alert("Error", action.error.message)
                if (action.error) {
                    console.log("test")
                    // Alert.alert("Error", action.error.message)
                }
            })
            .addCase(setPassword.fulfilled, (state, action) => {
                state.changedPassword = true
            })
            .addCase(setPassword.rejected, (state, action) => {
                if ((action.payload as APIResponse).message) {
                    Alert.alert("Error", (action.payload as APIResponse).message)
                }
                else if (action.payload) {
                    Alert.alert("Error", action.payload as string)
                }
                else {
                    console.log("test")
                    Alert.alert("Error", action.error.message)
                }
            })
    },
});

export const { setAuthData, setLoading, resetLoggedIn, resetAccountCreated, resetPasswordVerified, resetChangedPassword, logout } = authSlice.actions;
export default authSlice.reducer;