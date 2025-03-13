import BlogAuthor from "@/components/tabs/BlogAuthor";
import { User } from "./userInterace";

export interface AIBlog {
    _id: string;
    Title: string;
    Description: string;
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
    Reaction: UserBlogReaction;
    // content: string;
    // timestamp: string;
    Author: UserBlogAuthor;
    Tags: UserBlogTag[];
    Group: UserBlogGroup;
}