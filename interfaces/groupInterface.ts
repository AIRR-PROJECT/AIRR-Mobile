import { User } from "./userInterace";

export interface Group {
    name: string;
    description: string;
    image: string;
    members: string[];
    timestamp: string;
    groupAdmin: User;
    tags: string[];
}

