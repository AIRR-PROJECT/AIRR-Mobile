import { Blog } from "@/interfaces/blogInterface"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api/axiosInstance"

const initialState = {
    newestBlogs: null,
    scrollBlogs: null,
    page: -1
}

export const fetchFeed = createAsyncThunk(
    'feed/fetch',
    async (page: number, thunkAPI) => {
        try {
            // const res = await api.get(`blogs/preview-recommend-blogs?page=${page}`)
            // return res.data
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
            state.newestBlogs = null
            state.scrollBlogs = null
            state.page = -1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeed.fulfilled, (state, action) => {
                console.log(action.payload)
            })
            .addCase(fetchFeed.rejected, (state, action) => {
                console.log(action.error)
            })
    }
})

export const { reset } = feedSlice.actions
export default feedSlice.reducer