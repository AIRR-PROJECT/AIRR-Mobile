import { SearchBarBlog } from "./blogInterface"
import { SearchBarGroup } from "./groupInterface"

export interface SearchBarResult {
    searchGroups: SearchBarGroup[]
    searchBlogs: SearchBarBlog[]
}