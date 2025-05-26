import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { AxiosResponse } from "axios";
import { CreateGroupTag, Group, GroupDetailInfo, GroupField, GroupTag, PendingBlogRequest, PendingMemberRequest, PendingTagRequest, PopularGroups, PopularGroupsByField, SearchFieldResult } from "@/interfaces/groupInterface";
import { UserBlog } from "@/interfaces/blogInterface";

const initialState = {
    popularFields: null as any as GroupField[],
    popularGroupsHorizontal: null as any as Group[],
    popularGroupsVertical: null as any as PopularGroupsByField[],
    createGroupSubmitted: false,
    groupBlogsSearchText: "",
    groupTagsSearchText: "",
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
                return res.data.data as PopularGroups
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

export const getPreviewGroups = createAsyncThunk(
    'group/getPreviewGroups',
    async (keyword: string, thunkAPI) => {
        try {
            let searchQuery = keyword ? `?keyword=${keyword}` : ""
            const res = await api.get(`groups/preview-groups${searchQuery}`) as AxiosResponse

            if (res.data.success) {
                console.log(res.data.data)
                return res.data.data.groups as Group[]
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

export const getFieldDetail = createAsyncThunk(
    'group/getFieldDetail',
    async (fieldID: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/fields-detail?fieldID=${fieldID}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.detail.groups as Group[]
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

export const getGroupBlogsByID = createAsyncThunk(
    'group/getGroupBlogsByID',
    async (data: {groupID: string, userID: string, page: number}, thunkAPI) => {
        try {
            const res = await api.get(`groups/group-blogs-by-id?groupID=${data.groupID}&page=${data.page}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data.blogs as UserBlog[]
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

export const getGroupTagsByID = createAsyncThunk(
    'group/getGroupTagsByID',
    async (data: {groupID: string}, thunkAPI) => {
        try {
            const res = await api.get(`groups/group-tags-by-id?groupID=${data.groupID}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as GroupTag[]
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

export const getGroupInfo = createAsyncThunk(
    'group/getGroupInfo',
    async (data: {groupID: string}, thunkAPI) => {
        try {
            const res = await api.get(`groups/groups-infos?groupID=${data.groupID}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as GroupDetailInfo
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

export const searchGroups = createAsyncThunk(
   'group/searchGroups',
   async (keyword: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/search-groups?keyword=${keyword}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as SearchFieldResult
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

export const searchFields = createAsyncThunk(
   'group/searchFields',
   async (keyword: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/search-fields?keyword=${keyword}`) as AxiosResponse

            if (res.data.success) {
                return res.data.data as SearchFieldResult
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

export const createGroup = createAsyncThunk(
    'group/createGroup',
    async (data: FormData, thunkAPI) => {
        try {
            const res = await api.post(`groups/create-group`, data, {
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

export const requestJoinGroup = createAsyncThunk(
    'group/requestJoin',
    async (data: { groupID: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/joinGroup`, data) as AxiosResponse

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

export const createTag = createAsyncThunk(
    'group/createTag',
    async (data: CreateGroupTag, thunkAPI) => {
        try {
            const res = await api.post(`tag/create-tag`, data) as AxiosResponse
            console.log(res)

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

export const getPendingMemberList = createAsyncThunk(
    'group/getPendingMemberList',
    async (groupID: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/getPendingMemberList?groupID=${groupID}`) as AxiosResponse

            if (res.data.success) {
                console.log(res.data.data.success)
                return res.data.data.success as PendingMemberRequest[]
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

export const approveMember = createAsyncThunk(
    'group/approveMember',
    async (data: { groupID: string, userIDToApprove: string }, thunkAPI) => {
        try {
            const a = {
                "groupID": "67849113607148a07c1d94a3",
                "userIDToApprove": "67cbe57957107366685af45d"
            }
            console.log(data)

            const res = await api.post(`groups/approveMember`, data) as AxiosResponse

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

export const rejectMember = createAsyncThunk(
    'group/rejectMember',
    async (data: { groupID: string; userIDToReject: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/rejectMember`, data) as AxiosResponse

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

export const getPendingBlogList = createAsyncThunk(
    'group/getPendingBlogList',
    async (groupID: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/getPendingBlogList?groupID=${groupID}`) as AxiosResponse

            if (res.data.success) {
                console.log(res.data.data.success)
                return res.data.data.success as PendingBlogRequest[]
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

export const approveBlog = createAsyncThunk(
    'group/approveBlog',
    async (data: { groupID: string; blogIDToApprove: string; blogOwnerID: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/approveBlog`, data) as AxiosResponse

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

export const rejectBlog = createAsyncThunk(
    'group/rejectBlog',
    async (data: { groupID: string; blogIDToReject: string; blogOwnerID: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/rejectBlog`, data) as AxiosResponse

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

export const getPendingTagList = createAsyncThunk(
    'group/getPendingTagList',
    async (groupID: string, thunkAPI) => {
        try {
            const res = await api.get(`groups/getPendingTagList?groupID=${groupID}`) as AxiosResponse

            if (res.data.success) {
                console.log(res.data.data.success)
                return res.data.data.success as PendingTagRequest[]
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

export const approveTag = createAsyncThunk(
    'group/approveTag',
    async (data: { groupID: string; tagIDToApprove: string; blogIDsContainTag: string[]; fieldID: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/approveTag`, data) as AxiosResponse

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

export const rejectTag = createAsyncThunk(
    'group/rejectTag',
    async (data: { groupID: string; tagIDToReject: string; blogIDsContainTag: string[]; fieldID: string }, thunkAPI) => {
        try {
            const res = await api.post(`groups/rejectTag`, data) as AxiosResponse

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

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        setGroupBlogsSearchText(state, action) {
            state.groupBlogsSearchText = action.payload
        },
        
        setGroupTagsSearchText(state, action) {
            state.groupTagsSearchText = action.payload
        },

        setCreateGroupSubmitted(state, action) {
            state.createGroupSubmitted = action.payload
        },

        reset(state) {
            state.popularFields = null as any as GroupField[]
            state.popularGroupsHorizontal = null as any as Group[]
            state.popularGroupsVertical = null as any as PopularGroupsByField[]
            state.createGroupSubmitted = false
            state.groupBlogsSearchText = ""
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
                state.popularGroupsHorizontal = action.payload.topList
                state.popularGroupsVertical = action.payload.fieldData
            })
            .addCase(getPopularGroups.rejected, (state, action) => {
                console.log(action.error)
            }) 
            .addCase(requestJoinGroup.fulfilled, (state, action) => {
                
            })
            .addCase(requestJoinGroup.rejected, (state, action) => {
                console.log(action.error)
            }) 
    }

});

export const { setGroupBlogsSearchText, setGroupTagsSearchText, setCreateGroupSubmitted, reset } = groupSlice.actions;
export default groupSlice.reducer;