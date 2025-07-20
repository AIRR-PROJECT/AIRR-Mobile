import { AIBlog, RecentPopularBlog, SearchBarBlog, UserBlog } from "./blogInterface"
import { Group, RecentPopularGroup, SearchBarGroup } from "./groupInterface"

export interface SearchBarResult {
    searchGroups: Group[]
    searchBlogs: UserBlog[]
}

export interface RecentPopularBlogAndGroup {
    AIBlog: AIBlog,
    popularBlog: RecentPopularBlog,
    popularGroup: RecentPopularGroup
}