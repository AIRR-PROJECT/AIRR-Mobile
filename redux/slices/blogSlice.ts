import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../api/axiosInstance"
import { AxiosResponse } from "axios"
import { AIBlogDetail, CreateBlog, CreateReportBlog, PostComment, ReplyToBlogComment, CreateBlogTag, UpdateHideBlog, UserBlog, UserBlogComment, UserBlogDetail, UserBlogDetailForUpdate } from "@/interfaces/blogInterface"
import { ResponseFailcode } from "@/enums/failcode.enum"

const initialState = {
    currentAIBlog: null as unknown as AIBlogDetail,
    currentUserBlog: null as unknown as UserBlogDetail,
    currentBlogComments: null as unknown as UserBlogComment[],
    isCurrentBlogLiked: false,
    isCurrentBlogDisliked: false,
    isCurrentBlogSaved: false,
    commentAdded: false,
    createBlogCurrentTags: [] as string[],
    createBlogRequestedTags: [] as CreateBlogTag[]
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
            console.log(res.data)

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

export const getUserBlogDetailForUpdate = createAsyncThunk<UserBlogDetailForUpdate, string>(
    "blog/getUserBlogDetailForUpdate",
    async (blog_id: string, thunkAPI) => {
        try {
            const res = await api.get(`blogs/user-blog-detail-for-update?blogId=${blog_id}`) as AxiosResponse
            console.log(res.data)
            if (res.data.success) {
                return res.data.data.blogDetail as UserBlogDetailForUpdate
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

export const likeBlog = createAsyncThunk(
    'blog/likeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "Like",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const dislikeBlog = createAsyncThunk(
    'blog/dislikeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "Dislike",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const removeLikeBlog = createAsyncThunk(
    'blog/removeLikeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "RemoveLike",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const removeDislikeBlog = createAsyncThunk(
    'blog/removeDislikeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "RemoveDislike",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
            }
            else {
                return thunkAPI.rejectWithValue(res.data)
            }
        }
        catch (error: any) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    } 
)

export const likeToDislikeBlog = createAsyncThunk(
    'blog/likeToDislikeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "LikeToDislike",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const dislikeToLikeBlog = createAsyncThunk(
    'blog/dislikeToLikeBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "DislikeToLike",
                        createdAt: new Date().toDateString()
                    }
                ],
                saveBlogEntries: []
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const saveBlog = createAsyncThunk(
    'blog/saveBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [],
                saveBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "Save",
                        createdAt: new Date().toDateString()
                    }
                ]
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const unsaveBlog = createAsyncThunk(
    'blog/unsaveBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const dto = {
                reactBlogEntries: [],
                saveBlogEntries: [
                    {
                        BlogID: blogId,
                        Action: "Unsave",
                        createdAt: new Date().toDateString()
                    }
                ]
            }
            const res = await api.post(`blogs/react-blogs`, dto) as AxiosResponse

            if (res.data.success) {
                
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

export const createBlog = createAsyncThunk(
    'blog/createBlog',
    async (data: FormData, thunkAPI) => {
        try {
            const res = await api.post(`blogs/create-blog`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }) as AxiosResponse

            if (res.data.success) {
                return true
            }
            else {
                return false
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const updateBlog = createAsyncThunk(
    'blog/updateBlog',
    async (data: FormData, thunkAPI) => {
        try {
            const res = await api.post(`blogs/update-blog`, data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }) as AxiosResponse

            if (res.data.success) {
                return true
            }
            else {
                return false
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const commentOnBlog = createAsyncThunk(
    'blog/commentOnBlog',
    async (data: PostComment, thunkAPI) => {
        try {
            const res = await api.post(`blogs/post-reply-comment`, data) as AxiosResponse

            if (res.data.success) {
                return true
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

export const replyToBlogComment = createAsyncThunk(
    'blog/replyToBlogComment',
    async (data: ReplyToBlogComment, thunkAPI) => {
        try {
            const res = await api.post(`blogs/post-reply-comment`, data) as AxiosResponse

            if (res.data.success) {
                return true
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

export const deleteBlog = createAsyncThunk(
    'blog/deleteBlog',
    async (blogId: string, thunkAPI) => {
        try {
            const res = await api.delete(`blogs/delete-blog?blogId=${blogId}`) as AxiosResponse

            if (res.data.success) {
                return true
            }
            else {
                return false
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const createReportBlog = createAsyncThunk(
    'blog/createReportBlog',
    async (data: CreateReportBlog, thunkAPI) => {
        try {
            const res = await api.post(`blogs/create-report`, data) as AxiosResponse

            if (res.data.success) {
                return true
            }
            else {
                return false
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const updateHideBlog = createAsyncThunk(
    'blog/updateHideBlog',
    async (data: UpdateHideBlog, thunkAPI) => {
        try {
            const res = await api.post(`blogs/update-hide-blog`, data) as AxiosResponse

            if (res.data.success) {
                return true
            }
            else {
                return false
            }
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const searchTagCreateBlog = createAsyncThunk(
    'blog/searchTagCreateBlog',
    async (data: { keyword: string, fieldID: string, groupID: string }, thunkAPI) => {
        try {
            const res = await api.get(`tag/search-tag-create-blog?keyword=${data.keyword}&fieldID=${data.fieldID}&groupID=${data.groupID}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.tagList as CreateBlogTag[]
            }
            else {
                return []
            }
        }
        catch (error: any) {
            if (error.response.data.failcode == ResponseFailcode.TAG_NOT_FOUND) {
                return []
            }
            
            return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setCurrentBlogLiked(state, action) {
            state.isCurrentBlogLiked = action.payload
        },

        setCurrentBlogDisliked(state, action) {
            state.isCurrentBlogDisliked = action.payload
        },

        setCurrentBlogSaved(state, action) {
            state.isCurrentBlogSaved = action.payload
        },

        setCommentAdded(state, action) {
            state.commentAdded = action.payload
        },

        setCreateBlogCurrentTags(state, action) {
            state.createBlogCurrentTags = action.payload as string[]
        },

        setCreateBlogRequestedTags(state, action) {
            state.createBlogRequestedTags = action.payload as CreateBlogTag[]
        },

        reset(state) {
            state.currentAIBlog = null as unknown as AIBlogDetail
            state.currentUserBlog = null as unknown as UserBlogDetail
            state.currentBlogComments = null as unknown as UserBlogComment[]
            state.isCurrentBlogLiked = false
            state.isCurrentBlogDisliked = false
            state.isCurrentBlogSaved = false
            state.commentAdded = false
            state.createBlogCurrentTags = [] as string[],
            state.createBlogRequestedTags = [] as CreateBlogTag[]
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
            .addCase(likeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogLiked = true
            })
            .addCase(likeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(dislikeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogDisliked = true
            })
            .addCase(dislikeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(removeLikeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogLiked = false
            })
            .addCase(removeLikeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(removeDislikeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogDisliked = false
            })
            .addCase(removeDislikeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(likeToDislikeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogLiked = false
                state.isCurrentBlogDisliked = true
            })
            .addCase(likeToDislikeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(dislikeToLikeBlog.fulfilled, (state, action) => {
                state.isCurrentBlogLiked = true
                state.isCurrentBlogDisliked = false
            })
            .addCase(dislikeToLikeBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(saveBlog.fulfilled, (state, action) => {
                console.log("Saved blog")
                state.isCurrentBlogSaved = true
            })
            .addCase(saveBlog.rejected, (state, action) => {
                console.log(action.error)
            })
            .addCase(unsaveBlog.fulfilled, (state, action) => {
                console.log("Unsaved blog")
                state.isCurrentBlogSaved = false
            })
            .addCase(unsaveBlog.rejected, (state, action) => {
                console.log(action.error)
            })
    }
})

export const { reset, setCurrentBlogLiked, setCurrentBlogDisliked, setCurrentBlogSaved, setCommentAdded, setCreateBlogCurrentTags, setCreateBlogRequestedTags } = blogSlice.actions
export default blogSlice.reducer