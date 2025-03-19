import { UserBlog } from "@/interfaces/blogInterface"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api/axiosInstance"
import { SurveyTags } from "@/interfaces/userInterace"
import { AxiosResponse } from "axios"

const initialState = {
    recommendedBlogs: null,
    userBlogs: null,
    recommendedPage: -1,
    userPage: -1
}

export const fetchRecommendedBlogs = createAsyncThunk(
    'feed/fetchRecommended',
    async (page: number, thunkAPI) => {
        console.log("test")
        try {
            const res = await api.get(`blogs/preview-recommend-blogs?page=${page}`)

            if (res.data.success) {
                return res.data.data
            }
            else {
                return thunkAPI.rejectWithValue(res.data.message)
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const fetchUserBlogs = createAsyncThunk(
    'feed/fetchUser',
    async (page: number, thunkAPI) => {
        try {
            const res = await api.get(`blogs/preview-user-blogs?page=${page}`)

            if (res.data.success) {
                return res.data.data
            }
            else {
                return thunkAPI.rejectWithValue(res.data.message)
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const saveTags = createAsyncThunk(
    'feed/saveTags',
    async (tags: SurveyTags[], thunkAPI) => {
        try {
            const res = await api.post(`users/update-survey`, tags) as AxiosResponse

            if (res.data.success) {
                return res.data.data
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

const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        reset(state, action) {
            state.recommendedBlogs = null
            state.userBlogs = null
            state.recommendedPage = -1
            state.userPage = -1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendedBlogs.fulfilled, (state, action) => {
                state.recommendedBlogs = action.payload.blogList.blogs
            })
            .addCase(fetchRecommendedBlogs.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.userBlogs = action.payload.blogList.blogs
            })
            .addCase(fetchUserBlogs.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(saveTags.fulfilled, (state, action) => {

            })
            .addCase(saveTags.rejected, (state, action) => {
                
            })
    }
})

export const { reset } = feedSlice.actions
export default feedSlice.reducer