import { Blog } from "./blogInterface";
import { Group } from "./groupInterface";

export interface User {
    name: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    location: string;
    bio: string;
    socials: User[];
    groups: Group[];
    blogs: Blog[];
}