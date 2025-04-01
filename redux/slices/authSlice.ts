import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axiosInstance";
import { LoginCredentials, SetPasswordCredentials, SignUpCredentials, Tokens, VerifyAccountCredentials, VerifyPasswordCredentials } from "@/interfaces/authInterface";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { UpdateAvatar, UpdateUser, User, User1 } from "@/interfaces/userInterface";
import { jwtDecode } from "jwt-decode";
import { setTokens, setCurrentUser, setUserPreviewGroup, setUserAvatar } from "./userSlice";
import { ResponseFailcode } from "@/enums/failcode.enum";
import { useAppSelector } from "../hook";
import { ToastAndroid } from "react-native";

const initialState = {
    rememberedSignUpUser: "",
    isAccountCreated: false,
    isLoggedIn: false,
    isAccountVerified: false,
    isPasswordVerified: false,
    isUserChangeSaved: false,
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

            if (access_token === undefined) {
                return thunkAPI.rejectWithValue("Access token must not be undefined")
            }
            if (refresh_token === undefined) {
                return thunkAPI.rejectWithValue("Refresh token must not be undefined")
            }

            await SecureStore.setItemAsync('accessToken', access_token)
            await SecureStore.setItemAsync('refreshToken', refresh_token)
            thunkAPI.dispatch(setTokens({
                accessToken: access_token,
                refreshToken: refresh_token
            }))
    
            return { 
                accessToken: access_token,
                refreshToken: refresh_token
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const setRememberedSignUpUser = createAsyncThunk(
    'auth/setRememberedSignUpUser',
    async (data: string, thunkAPI) => {
        try {
            await SecureStore.setItemAsync("rememberedSignUpUser", data)
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getRememberedSignUpUser = createAsyncThunk(
    'auth/getRememberedSignUpUser',
    async (_, thunkAPI) => {
        try {
            return await SecureStore.getItemAsync("rememberedSignUpUser")
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const signup = createAsyncThunk(
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
        const verify = await api.post('auth/verify-account-otp', data) as AxiosResponse
        
        return verify.data
    }
)

export const verifyPasswordOTP = createAsyncThunk<APIResponse, VerifyPasswordCredentials>(
    'auth/verify-password-otp',
    async (data: VerifyPasswordCredentials) => {
        const verify = await api.post('auth/verify-password-otp', data) as AxiosResponse
        
        return verify.data
    }
)

export const setPassword = createAsyncThunk<APIResponse, SetPasswordCredentials>(
    'auth/change-password',
    async (data: SetPasswordCredentials) => {
        // const token = await SecureStore.getItemAsync('passwordToken')

        const set = await api.post('auth/change-password', data, {
            headers: {
                Authorization: `Bearer ${token}`
              }
        }) as AxiosResponse

        return set.data
    }
)

export const loadToken = createAsyncThunk(
    'auth/loadToken',
    async (_, thunkAPI) => {
        // Perform async operation here
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        if (accessToken && refreshToken) {
            thunkAPI.dispatch(setTokens({ accessToken, refreshToken }))

            return { accessToken, refreshToken };
        }
        else {
            return thunkAPI.rejectWithValue(null)
        }
    }
)

export const getUserInfo = createAsyncThunk(
    'auth/userInfo',
    async (_, thunkAPI) => {
        let accessToken =  await SecureStore.getItemAsync('accessToken');

        if (accessToken) {
            const payload = jwtDecode(accessToken) as any

            const res = await api.get('/users/by-username?username=' + payload.username) as AxiosResponse

            if (res.data.success) {
                thunkAPI.dispatch(setCurrentUser(res.data.data))
                return res.data.data
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }

        return thunkAPI.rejectWithValue("No access token found")
    }
)


export const getUserPreviewGroups = createAsyncThunk(
    'user/previewGroups',
    async (user_id: string, thunkAPI) => {
        const res = await api.get(`groups/get-preview-group-by-user-id?userID=${user_id}`)

        if (res.data.success) {
            thunkAPI.dispatch(setUserPreviewGroup(res.data.data.groupList))
        }
        else {
            return thunkAPI.rejectWithValue(res.data.message)
        }
    }
)

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: User, thunkAPI) => {
        const inputData: UpdateUser = {
            userID: userData._id,
            firstname: userData.firstName ?? "",
            lastname: userData.lastName ?? "",
            phone: userData.phoneNumber?.toString() ?? "",
            dob: userData.dateOfBirth ?? "",
            studentID: userData.profile.studentID ?? "",
            department: userData.profile.department ?? "",
            program: userData.profile.program,
            entry_year: new Date().getFullYear() - userData.profile.year,
            gpa: userData.profile.gpa ?? 0
        }
        if (userData.profile.link.LinkedIn) {
            inputData.linkedIn = userData.profile.link.LinkedIn
        }
        if (userData.profile.link.Github) {
            inputData.github = userData.profile.link.Github
        }
        if (userData.profile.link.Facebook) {
            inputData.facebook = userData.profile.link.Facebook
        }

        const res = await api.post("users/update", inputData)
        
        if (res.data.success) {
            // thunkAPI.dispatch(setCurrentUser(res.data.data))
        }
        else {
            return thunkAPI.rejectWithValue(res.data.message)
        }
    }
)

export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (file: FormData, thunkAPI) => {
        const res = await api.post('users/update-avatar', file, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        console.log(res)

        if (res.data.success) {
            console.log("Result: " + res.data)
            // thunkAPI.dispatch(setUserAvatar(res.data.data))
        }
        else {
            return thunkAPI.rejectWithValue(res.data.message)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
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

        setUserChangeSaved(state, action) {
            state.isUserChangeSaved = action.payload
        },

        resetPasswordToken(state, _) {
            state.passwordVerifyToken = ""
        },

        logout(state) {
            state.passwordVerifyToken = ""
            SecureStore.deleteItemAsync('accessToken');
            SecureStore.deleteItemAsync('refreshToken');
            state.isLoggedIn = false
            state.isAccountVerified = false
            state.isPasswordVerified = false
            state.isAccountCreated = false
            state.changedPassword = false
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.isAccountVerified = true
            })
            .addCase(login.rejected, (state, action) => {
                if (action.payload && (action.payload as APIResponse).message && (action.payload as APIResponse).failcode !== ResponseFailcode.USER_NOT_FOUND) {
                    state.isLoggedIn = true
                }

                /* Handling this somewhere else */
                // if (action.payload) {
                //     if ((action.payload as APIResponse).message) {
                //         Alert.alert("Error", (action.payload as APIResponse).message)
    
                //         const payload = (action.payload as APIResponse)
                //         if (payload.failcode === ResponseFailcode.USER_UNVERIFIED) {
                //             state.isLoggedIn = true
                //         }
                //     }
                //     else {
                //         Alert.alert("Error", action.payload as string)
                //     }
                // }
                // else {
                //     const check_prefix = "Request failed with status code "
                //     if (action.error.message?.startsWith("Request failed with status code ")) {
                //         const code = action.error.message.slice(check_prefix.length)
                //         Alert.alert("Error", getReasonPhrase(code))
                //     }
                //     else {
                //         Alert.alert("Error", action.error.message)
                //     }
                // }
            })
            .addCase(setRememberedSignUpUser.rejected, (state, action) => {
                ToastAndroid.showWithGravity("Failed to save sign in username", ToastAndroid.LONG, ToastAndroid.BOTTOM)
            })
            .addCase(getRememberedSignUpUser.fulfilled, (state, action) => {
                state.rememberedSignUpUser = action.payload ?? ""
            })
            .addCase(getRememberedSignUpUser.rejected, (state, action) => {
                ToastAndroid.showWithGravity("Failed to get sign in username", ToastAndroid.LONG, ToastAndroid.BOTTOM)
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isAccountCreated = true
            })
            .addCase(signup.rejected, (state, action) => {
                /* Handling this somewhere else */
                // if (action.payload) {
                //     if ((action.payload as APIResponse).message) {
                //         Alert.alert("Error", (action.payload as APIResponse).message)
                //     }
                //     else {
                //         Alert.alert("Error", action.payload as string)
                //     }
                // }
                // else {
                //     const check_prefix = "Request failed with status code "
                //     if (action.error.message?.startsWith("Request failed with status code ")) {
                //         const code = action.error.message.slice(check_prefix.length)
                //         Alert.alert("Error", getReasonPhrase(code))
                //     }
                //     else {
                //         Alert.alert("Error", action.error.message)
                //     }
                // }
            })
            .addCase(verifyAccountOTP.fulfilled, (state, action) => {
                state.isAccountVerified = true
            })
            .addCase(verifyPasswordOTP.fulfilled, (state, action) => {
                state.isPasswordVerified = true
                token = action.payload.data.change_password_token
                SecureStore.setItemAsync('passwordToken', token)
            })
            .addCase(verifyPasswordOTP.rejected, (state, action) => {
                /* Handling this somewhere else */
                // if (action.payload) {
                //     if ((action.payload as APIResponse).message) {
                //         Alert.alert("Error", (action.payload as APIResponse).message)
                //     }
                //     else {
                //         Alert.alert("Error", action.payload as string)
                //     }
                // }
                // else {
                //     const check_prefix = "Request failed with status code "
                //     if (action.error.message?.startsWith("Request failed with status code ")) {
                //         const code = action.error.message.slice(check_prefix.length)
                //         Alert.alert("Error", getReasonPhrase(code))
                //     }
                //     else {
                //         Alert.alert("Error", action.error.message)
                //     }
                // }
            })
            .addCase(setPassword.fulfilled, (state, action) => {
                state.changedPassword = true
            })
            .addCase(setPassword.rejected, (state, action) => {
                /* Handling this somewhere else */
                // if (action.payload) {
                //     if ((action.payload as APIResponse).message) {
                //         Alert.alert("Error", (action.payload as APIResponse).message)
                //     }
                //     else {
                //         Alert.alert("Error", action.payload as string)
                //     }
                // }
                // else {
                //     const check_prefix = "Request failed with status code "
                //     if (action.error.message?.startsWith("Request failed with status code ")) {
                //         const code = action.error.message.slice(check_prefix.length)
                //         Alert.alert("Error", getReasonPhrase(code))
                //     }
                //     else {
                //         Alert.alert("Error", action.error.message)
                //     }
                // }
            })
            .addCase(loadToken.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.isAccountVerified = true
            })
            .addCase(loadToken.rejected, (state, action) => {
                console.log("Where tokens :<")
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                console.log("Success")
                // setCurrentUser(action.payload.user)
                // state.user = action.payload.user
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                // console.log(action)
                // setTokens(undefined)
                // state.userAccessToken = ""
                // state.userRefreshToken = ""
                console.log(action.error)
                state.isLoggedIn = false
                state.isAccountVerified = false
            })
            .addCase(getUserPreviewGroups.fulfilled, (state, action) => {
                
            })
            .addCase(getUserPreviewGroups.rejected, (state, action) => {

            })
            .addCase(updateUser.fulfilled, (state, action) => {
                
            })
            .addCase(updateUser.rejected, (state, action) => {

            })

    },
});

export const { setLoading, resetLoggedIn, resetAccountCreated, resetPasswordVerified, setUserChangeSaved, resetChangedPassword, logout } = authSlice.actions;
export default authSlice.reducer;