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

/** Represents survey tags linked to a user */
export interface SurveyTags {
    id: string;
    TagName: string;
}

export interface UserInfo {
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