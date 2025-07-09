import { SearchBarBlog, UserBlog } from "./blogInterface"
import { Group, SearchBarGroup } from "./groupInterface"

export interface SearchBarResult {
    searchGroups: Group[]
    searchBlogs: UserBlog[]
}