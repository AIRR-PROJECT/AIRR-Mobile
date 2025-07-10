import BlogAuthor from "@/components/tabs/BlogAuthor";
import { User1 } from "./userInterface";
import { BlogStatus } from "@/enums/blog_properties.enum";

export interface AIBlog {
    _id: string;
    Title: string;
    Description: string;
}
export interface AIBlogDetail {
    _id: string;
    Title: string;
    Description: string;
    Sections: AIBlogSection[];
    Conclusion: string;
}
export interface AIBlogSection {
    Heading: string;
    Content: {
        SubHeading: string;
        Details: string;
        Source: string;
        Code: string;
    }[]
}

export interface UserBlogReaction {
    Likes: number;
    Dislikes: number;
    Comments: number;
}
export interface UserBlogGroup {
    _id: string;
    CoverURL: string;
    Name: string;
    NumberOfMembers: number;
    Description: string;
}
export interface UserBlogTag {
    _id: string;
    TagName: string;
}
export interface UserBlogAuthor {
    _id: string;
    AvatarURL: string;
    Username: string;
    Name: string
    CreateDate: string;
}
export interface UserBlog {
    _id: string;
    Title: string;
    Description: string;
    BackgroundURL: string;
    UserInteraction: string;
    IsSavedByUser: boolean;
    Reaction: UserBlogReaction;
    // content: string;
    // timestamp: string;
    Author: UserBlogAuthor;
    Tags: UserBlogTag[];
    Group: UserBlogGroup;
    ViewType: string
    UserGroupStatus: string
    Status: BlogStatus
}
export interface UserBlogDetail {
    _id: string;
    Title: string;
    Description: string;
    BackgroundURL: string;
    UserInteraction: string;
    Reaction: UserBlogReaction;
    Content: string;
    Author: UserBlogAuthor;
    Tags: UserBlogTag[];
    PendingTags: UserBlogTag[];
    IsSavedByUser: boolean
    Status: BlogStatus
    ViewType: string
    Group: UserBlogGroup;
    UserGroupStatus: string
}
export interface UserBlogDetailForUpdate {
    _id: string;
    Title: string;
    Description: string;
    BackgroundURL: string;
    Content: string;
    Author: UserBlogAuthor;
    Tags: UserBlogTag[];
    PendingTags: UserBlogTag[];
    Status: string
    ViewType: string
    Group: UserBlogGroup;
}

export interface UserBlogComment {
    _id: string;
    User: {
        _id: string;
        UserName: string
        AvatarURL: string
    }
    Content: string
    createdAt: Date
    updatedAt: Date
    ChildrenComments: UserBlogChildComment[]
}

export interface UserBlogChildComment {
    _id: string;
    User: {
        _id: string;
        UserName: string
        AvatarURL: string
    };
    Content: string;
    ReplyToComment: {
        _id: string;
        User: {
            _id: string;
            UserName: string
            AvatarURL: string
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface BlogActionHistory{
    _id: string;
    Title: string;
    CommentID: string | null
    BackgroundURL: string;
    Action: string;
    Timestamp: string;
}


export interface CreateBlogGroupDtoType {
    Name: string;
    _id: string;
}
export interface CreateBlogTagDTO {
    _id: string;
    TagName: string;
}
export interface CreateBlog {
    Group: CreateBlogGroupDtoType;
    Tags: CreateBlogTagDTO[];
    thumbnail: any;
    Title: string;
    Description: string;
    Content: string;
}
export interface CreateBlogResult {
    blogID: string
}

export interface PostComment {
    UserID: string;
    BlogID: string;
    Content: string;
    Method: string;
}

export interface ReplyToBlogComment {
    UserID: string;
    BlogID: string;
    Content: string;
    Method: string;
    ReplyToCommentID: string;
    RootCommentID: string
}

export interface EditComment {
    BlogID: string;
    Content: string
    CommentID: string
}

export interface DeleteComment {
    BlogID: string;
    CommentID: string
}

export interface CreateReportBlog {
    BlogID: string
    GroupID: string
    ReportType: string
    Details: string
}

export interface UpdateHideBlog {
    BlogID: string
    Action: string
}

export interface CreateBlogTag {
    _id: string
    TagName: string
    OperationType: string
}

export interface SearchBarBlog {
    _id: string;
    Title: string;
    Description: string;
    Owner: UserBlogAuthor;
}