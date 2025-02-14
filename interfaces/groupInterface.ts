import { User } from "./userInterace";

export interface Group {
    name: string;
    description: string;
    avatar: string;
    image: string;
    members: string[];
    numberOfMembers: number;
    timestamp: string;
    groupAdmin: User;
    tags: string[];
}

