import { User } from "./userInterace";

export interface Blog{
    title: string;
    description: string;
    image: string;
    content: string;
    timestamp: string;
    blogAuthor: User;
    tags: string[];
}
