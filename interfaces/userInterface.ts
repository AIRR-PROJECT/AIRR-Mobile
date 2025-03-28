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
    _id: string;
    email?: string;
    avatar_url: string;
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

export interface UpdateUser {
    "userID": string,
    "firstname": string,
    "lastname": string,
    "dob": string,
    "phone"?: string,
    "studentID": string,
    "department": string,
    "program": string,
    "entry_year": number
    "gpa": number,
    "facebook"?: string,
    "github"?: string,
    "linkedIn"?: string,
    "skills"?: [
        {
            "skill_name": string,
            "years": number,
            "proficiency": string
        }
    ] 
}

export interface UpdateAvatar {
    avatar: any
}