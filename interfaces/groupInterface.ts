import { User1 } from "./userInterface";

export interface Group {
    GroupID: string,
    GroupName: string;
    description: string;
    avatar: string;
    GroupCoverURL: string;
    members: string[];
    TotalMembers: number;
    timestamp: string;
    groupAdmin: User1;
    tags: string[];
}

