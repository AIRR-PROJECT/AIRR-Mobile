import BlogAuthor from "@/components/tabs/BlogAuthor";
import { User1 } from "./userInterface";

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
    CoverURL: string;
    Name: string;
    NumberOfMembers: number;
}
export interface UserBlogTag {
    _id: string;
    TagName: string;
}
export interface UserBlogAuthor {
    _id: string;
    AvatarURL: string;
    Username: string;
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
}

export interface BlogActionHistory{
    _id: string;
    Title: string;
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