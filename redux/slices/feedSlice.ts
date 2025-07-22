import { UserBlog } from "@/interfaces/blogInterface"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api/axiosInstance"
import { AxiosResponse } from "axios"
import { SurveyTag } from "@/interfaces/userInterface"
import { RecentPopularBlogAndGroup, SearchBarResult } from "@/interfaces/feedInterface"

const initialState = {
    recommendedBlogs: null,
    userBlogs: null,
    recommendedPage: -1,
    userPage: -1
}

export const fetchRecommendedBlogs = createAsyncThunk(
    'feed/fetchRecommended',
    async (page: number, thunkAPI) => {
        try {
            const res = await api.get(`blogs/preview-recommend-blogs?page=${page}`, {
                "noLoadingScreen": true
            })

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
            const res = await api.get(`blogs/preview-user-blogs?page=${page}`, {
                "noLoadingScreen": true
            })

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

export const fetchPersonalBlogs = createAsyncThunk(
    'feed/fetchPersonal',
    async (page: number, thunkAPI) => {
        try {
            const res = await api.get(`blogs/preview-personal-blogs?page=${page}`)

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

export const fetchOtherPersonalBlogs = createAsyncThunk(
    'feed/fetchOtherPersonal',
    async (data: { otherUserID: string, page: number, }, thunkAPI) => {
        try {
            const res = await api.get(`blogs/preview-other-personal-blogs?otherUserID=${data.otherUserID}&page=${data.page}`)

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
    async (tags: {tags: SurveyTag[]}, thunkAPI) => {
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

export const searchTags = createAsyncThunk(
    'feed/searchTags',
    async (keyword: string, thunkAPI) => {
        try {
            const res = await api.get(`tag/search-tag?keyword=${keyword}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.tagList as SurveyTag[]
            }
            else {
                return []
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const searchFromSearchBar = createAsyncThunk(
    'feed/searchFromSearchBar',
    async (keyword: string, thunkAPI) => {
        try {
            const res = await api.get(`util/search-keyword?keyword=${keyword}`) as AxiosResponse

            if (res.data.success) {
                console.log(res.data.data)
                return res.data.data as SearchBarResult
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

export const getRecentPopularBlogAndGroup = createAsyncThunk(
    'feed/getRecentPopularBlogAndGroup',
    async (_, thunkAPI) => {
        try {
            const res = await api.get(`util/get-recent-popular-blog-and-group`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as RecentPopularBlogAndGroup
            }
            else {
                return {
                    AIBlog: undefined,
                    popularBlog: undefined,
                    popularGroup: undefined
                }
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