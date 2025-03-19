import { UserBlog } from "./blogInterface";
import { Group } from "./groupInterface";

export interface User1 {
    name: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    location: string;
    bio: string;
    socials: User1[];
    groups: Group[];
    blogs: UserBlog[];
}

/** Represents survey tags linked to a user */
export interface SurveyTags {
    _id: string;
    TagName: string;
}

export interface UserProfile {
    studentID: string;
    department: string
    program: string
    year: number;
    gpa: number;
    link: {
        Facebook: string,
        LinkedIn: string,
        Github: string
    };
}

export interface User {
    username: string;
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    isAuthenticatedWithGoogle?: boolean;
    phoneNumber?: number;
    joinDate?: Date;
    survey?: SurveyTags[];
    role?: string;
    profile?: any;
}