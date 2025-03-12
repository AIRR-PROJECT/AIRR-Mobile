import { User } from "./userInterace";

export interface Blog {
    Title: string;
    Description: string;
    image: string;
    content: string;
    timestamp: string;
    blogAuthor: User;
    tags: string[];
}