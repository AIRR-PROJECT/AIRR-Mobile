import { User } from "./userInterace";

export interface AIBlog {
    Title: string;
    Description: string;
}

export interface UserBlog {
    Title: string;
    Description: string;
    image: string;
    content: string;
    timestamp: string;
    blogAuthor: User;
    tags: string[];
}