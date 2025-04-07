import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api/axiosInstance"
import { AxiosResponse } from "axios"
import { AIBlogDetail, UserBlog, UserBlogComment, UserBlogDetail } from "@/interfaces/blogInterface"

const initialState = {
    currentAIBlog: null as unknown as AIBlogDetail,
    currentUserBlog: null as unknown as UserBlogDetail,
    currentBlogComments: null as unknown as UserBlogComment[]
}

export const getAIBlogDetail = createAsyncThunk<AIBlogDetail, string>(
    "blog/getAIBlogDetail",
    async (blog_id: string, thunkAPI) => {
        try {
            const res = await api.get(`blogs/AI-blog-detail?blogId=${blog_id}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.blogDetail as AIBlogDetail
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

export const getUserBlogDetail = createAsyncThunk<UserBlogDetail, string>(
    "blog/getUserBlogDetail",
    async (blog_id: string, thunkAPI) => {
        try {
            const res = await api.get(`blogs/user-blog-detail?blogId=${blog_id}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.blogDetail as UserBlogDetail
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

export const getBlogComment = createAsyncThunk<UserBlogComment[], string>(
    "blog/getBlogComment",
    async (blog_id: string, thunkAPI) => {
        try {
            const res = await api.get(`blogs/comment-by-blogId?blogId=${blog_id}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.blogComment as UserBlogComment[]
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

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        reset(state, action) {
            state.currentUserBlog = null as unknown as UserBlogDetail
            state.currentBlogComments = null as unknown as UserBlogComment[]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAIBlogDetail.fulfilled, (state, action) => {
                state.currentAIBlog = action.payload
            })
            .addCase(getAIBlogDetail.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(getUserBlogDetail.fulfilled, (state, action) => {
                state.currentUserBlog = action.payload
            })
            .addCase(getUserBlogDetail.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(getBlogComment.fulfilled, (state, action) => {
                state.currentBlogComments = action.payload
            })
            .addCase(getBlogComment.rejected, (state, action) => {
                console.log(action.error)
            })
    }
})

export const { reset } = blogSlice.actions
export default blogSlice.reducer