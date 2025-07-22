import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import api from "../api/axiosInstance";
import { ChangeCurrentPasswordCredentials, LoginCredentials, SetPasswordCredentials, SignUpCredentials, Tokens, VerifyAccountCredentials, VerifyPasswordCredentials } from "@/interfaces/authInterface";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { PartialUser, SurveyTag, UpdateAvatar, UpdateUser, User, User1, UserActivity } from "@/interfaces/userInterface";
import { jwtDecode } from "jwt-decode";
import { setTokens, setCurrentUser, setUserPreviewGroup, setUserAvatar, reset } from "./userSlice";
import { ResponseFailcode } from "@/enums/failcode.enum";
import { useAppSelector } from "../hook";
import { ToastAndroid } from "react-native";
import { setCurrentBlogDisliked, setCurrentBlogLiked, setCurrentBlogSaved } from "./blogSlice";
import { router } from "expo-router";

const initialState = {
    rememberedSignUpUser: "",
    isAccountCreated: false,
    isLoggedIn: false,
    isAccountVerified: false,
    isPasswordVerified: false,
    isUserChangeSaved: false,
    isCurrentPasswordIncorrect: false,
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

export const loginGoogle = createAsyncThunk(
    'auth/loginGoogle',
    async (data: { token: string }, thunkAPI) => {
        try {
            await SecureStore.setItemAsync('accessToken', data.token)

            const response = await api.post('auth/sign-in-gg');
            console.log(response)
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
    async (data: { email: string }, thunkAPI) => {
        try {
            await api.get(`auth/resend-account-otp?email=${data.email}`)
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const sendPasswordOTP = createAsyncThunk(
    'auth/send-password-otp', 
    async (data: { email: string }, thunkAPI) => {
        try {
            await api.get(`auth/forget-password?email=${data.email}`)
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const verifyAccountOTP = createAsyncThunk<APIResponse, VerifyAccountCredentials>(
    'auth/verify-account-otp',
    async (data: VerifyAccountCredentials, thunkAPI) => {
        try {
            const verify = await api.post('auth/verify-account-otp', data) as AxiosResponse
            
            return verify.data
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const verifyPasswordOTP = createAsyncThunk<APIResponse, VerifyPasswordCredentials>(
    'auth/verify-password-otp',
    async (data: VerifyPasswordCredentials, thunkAPI) => {
        try {
            const verify = await api.post('auth/verify-password-otp', data) as AxiosResponse
            
            return verify.data
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const setPassword = createAsyncThunk<APIResponse, SetPasswordCredentials>(
    'auth/change-password',
    async (data: SetPasswordCredentials, thunkAPI) => {
        try {
            // const token = await SecureStore.getItemAsync('passwordToken')
    
            const set = await api.post('auth/change-password', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }) as AxiosResponse
    
            return set.data
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const loadToken = createAsyncThunk(
    'auth/loadToken',
    async (_, thunkAPI) => {
        try {
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
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const getUserInfo = createAsyncThunk(
    'auth/userInfo',
    async (_, thunkAPI) => {
        try {
            let accessToken =  await SecureStore.getItemAsync('accessToken');
    
            if (accessToken) {
                const payload = jwtDecode(accessToken) as any
    
                const res = await api.get('/users/by-username?username=' + payload.username) as AxiosResponse
                console.log("User info response", res.data)
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
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)


export const getUserPreviewGroups = createAsyncThunk(
    'user/previewGroups',
    async (user_id: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/get-preview-group-by-user-id?userID=${user_id}`)
    
            if (res.data.success) {
                thunkAPI.dispatch(setUserPreviewGroup(res.data.data))
            }
            else {
                return thunkAPI.rejectWithValue(res.data.message)
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const getPartialUserInfo = createAsyncThunk(
    'user/getPartialUserInfo',
    async (user_id: string, thunkAPI) => {
        try {
            const res = await api.get(`users/partial-info-by-user-id?userID=${user_id}`)
            console.log(res.data)

            if (res.data.success) {
                return res.data.data.user as PartialUser
            }
            else {
                return null
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const getUserRelatedTags = createAsyncThunk(
    'user/getUserRelatedTags',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`tag/get-related-tags`)

            if (res.data.success) {
                return res.data.data.tagList as SurveyTag[]
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

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: User, thunkAPI) => {
        try {
            console.log("Updating user", userData)
            const inputData: UpdateUser = {
                userID: userData._id,
                firstname: userData.firstName ?? "",
                lastname: userData.lastName ?? "",
                phone: userData.phoneNumber ?? "",
                dob: userData.dateOfBirth ?? "",
                studentID: userData.profile.studentID ?? "",
                department: userData.profile.department ?? "",
                // program: userData.profile.program ?? "",
                graduationStatus: userData.profile.graduationStatus ?? "",
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
            console.log("Input data for update", inputData)
            const res = await api.post("users/update", inputData)
            
            if (res.data.success) {
                // thunkAPI.dispatch(setCurrentUser(res.data.data))
            }
            else {
                return thunkAPI.rejectWithValue(res.data.message)
            }
        }
        catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
)

export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (file: FormData, thunkAPI) => {
        try {
            const res = await api.post('users/update-avatar', file, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
    
            if (res.data.success) {
                thunkAPI.dispatch(setUserAvatar(file.get("avatar")["uri"]))
    
                ToastAndroid.showWithGravity("Avatar updated successfully", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
            }
            else {
                return thunkAPI.rejectWithValue(res.data.message)
            }
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
        }
    }
)

export const changeCurrentPassword = createAsyncThunk<void, ChangeCurrentPasswordCredentials>(
    'auth/changeCurrentPassword', 
    async (data: ChangeCurrentPasswordCredentials, thunkAPI) => {
        try {
            const res = await api.post("auth/change-current-password", data)

            if (res.data.success) {
                ToastAndroid.showWithGravity("Current password changed successfully", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
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

export const getUserActivity = createAsyncThunk(
    'auth/getUserActivity', 
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`users/get-activity-all`)

            if (res.data.success) {
                return res.data.data.activities as UserActivity[]
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

export const getUserBlogLikeActivities = createAsyncThunk(
    'auth/getUserLikeActivity', 
    async (blogId: string, thunkAPI) => {
        try {
            const res = await api.get(`users/get-activity-by-type-blog?type=Like&blogId=${blogId}`, {
                "noLoadingScreen": true
            })

            if (res.data.success) {
                if (res.data.data.activities.length > 0) {
                    thunkAPI.dispatch(setCurrentBlogLiked(true))
                    return true
                }
                else {
                    thunkAPI.dispatch(setCurrentBlogLiked(false))
                    return false
                }
            }
            else {
                thunkAPI.dispatch(setCurrentBlogSaved(false))
                return false
            }
        }
        catch (err: any) {
            thunkAPI.dispatch(setCurrentBlogSaved(false))
            return false
        }
    }   
)

export const getUserBlogDislikeActivities = createAsyncThunk(
    'auth/getUserDislikeActivity', 
    async (blogId: string, thunkAPI) => {
        try {
            const res = await api.get(`users/get-activity-by-type-blog?type=Dislike&blogId=${blogId}`, {
                "noLoadingScreen": true
            })

            if (res.data.success) {
                if (res.data.data.activities.length > 0) {
                    thunkAPI.dispatch(setCurrentBlogDisliked(true))
                    return true
                }
                else {
                    thunkAPI.dispatch(setCurrentBlogDisliked(false))
                    return false
                }
            }
            else {
                thunkAPI.dispatch(setCurrentBlogSaved(false))
                return false
            }
        }
        catch (err: any) {
            thunkAPI.dispatch(setCurrentBlogSaved(false))
            return false
        }
    }   
)

export const getUserBlogSaveActivities = createAsyncThunk(
    'auth/getUserSaveActivity', 
    async (blogId: string, thunkAPI) => {
        try {
            const res = await api.get(`users/get-activity-by-type-blog?type=Save&blogId=${blogId}`, {
                "noLoadingScreen": true
            })

            if (res.data.success) {
                if (res.data.data.activities.length > 0) {
                    thunkAPI.dispatch(setCurrentBlogSaved(true))
                    return true
                }
                else {
                    thunkAPI.dispatch(setCurrentBlogSaved(false))
                    return false
                }
            }
            else {
                thunkAPI.dispatch(setCurrentBlogSaved(false))
                return false
            }
        }
        catch (err: any) {
            thunkAPI.dispatch(setCurrentBlogSaved(false))
            return false
        }
    }   
)

export const logOut = createAsyncThunk(
    'auth/logOut',
    async (_, thunkAPI) => {
        try {
            const res = await api.post(`auth/revoke`)
            if (res.data.success) {
                thunkAPI.dispatch(reset())
                await SecureStore.deleteItemAsync("accessToken")
                await SecureStore.deleteItemAsync("refreshToken")
                console.log("dismissed to first screen")
                
                return true
            }
            
            return false
        }
        catch (err: any) {
            return thunkAPI.rejectWithValue(err.response)
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

        setLoggedIn(state, action) {
            state.isLoggedIn = action.payload
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

        setCurrentPasswordIncorrect(state, action) {
            state.isCurrentPasswordIncorrect = action.payload
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
            state.isCurrentPasswordIncorrect = false
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.isAccountVerified = true
            })
            .addCase(login.rejected, (state, action) => {
                console.log(action.payload)
                if (action.payload && (action.payload as APIResponse).message && ((action.payload as APIResponse).failcode !== ResponseFailcode.USER_NOT_FOUND && (action.payload as APIResponse).failcode !== ResponseFailcode.INVALID_CREDENTIALS)) {
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
            .addCase(loginGoogle.fulfilled, (state, action) => {
                state.isLoggedIn = true
                state.isAccountVerified = true
            })
            .addCase(loginGoogle.rejected, (state, action) => {
                console.log(action.payload)
                if (action.payload && (action.payload as APIResponse).message && ((action.payload as APIResponse).failcode !== ResponseFailcode.USER_NOT_FOUND && (action.payload as APIResponse).failcode !== ResponseFailcode.IDENTITY_NOT_MATCHED)) {
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
                // console.log(action.meta)
                console.log(action.error)
                state.isLoggedIn = false
                state.isAccountVerified = false
            })
            .addCase(getUserPreviewGroups.fulfilled, (state, action) => {
                
            })
            .addCase(getUserPreviewGroups.rejected, (state, action) => {

            })
            .addCase(getPartialUserInfo.fulfilled, (state, action) => {
                
            })
            .addCase(getPartialUserInfo.rejected, (state, action) => {

            })
            .addCase(updateUser.fulfilled, (state, action) => {
                ToastAndroid.showWithGravity("User info updated", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                console.log("User info updated")
            })
            .addCase(updateUser.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                ToastAndroid.showWithGravity("Avatar updated", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                console.log("Avatar updated")
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(changeCurrentPassword.fulfilled, (state, action) => {
                
            })
            .addCase(changeCurrentPassword.rejected, (state, action) => {
                if ((action.payload as any).data.failcode == ResponseFailcode.INVALID_CREDENTIALS) {
                    state.isCurrentPasswordIncorrect = true
                }
            })

    },
});

export const { setLoading, resetLoggedIn, resetAccountCreated, resetPasswordVerified, setCurrentPasswordIncorrect, setUserChangeSaved, resetChangedPassword, logout, setLoggedIn } = authSlice.actions;
export default authSlice.reducer;