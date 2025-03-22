import { User1 } from "./userInterface";

export interface Group {
    name: string;
    description: string;
    avatar: string;
    image: string;
    members: string[];
    numberOfMembers: number;
    timestamp: string;
    groupAdmin: User1;
    tags: string[];
}

