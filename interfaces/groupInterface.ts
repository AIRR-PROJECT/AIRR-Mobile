import { User1 } from "./userInterface";

export interface Group {
    _id: string,
    Name: string;
    Description: string;
    Owner: GroupOwner;
    NumberOfMembers: number;
    FieldName: string;
    CoverURL: string;
    Tags: GroupTag[];
    avatar: string;
    members: string[];
    timestamp: string;
}

export interface GroupOwner {
    _id: string,
    Username: string,
    AvatarURL: string
}

export interface GroupField {
    _id: string,
    FieldName: string
}

export interface GroupTag {
    _id: string;
    TagName: string
}

export interface PopularGroups {
    topList: Group[]
    fieldData: PopularGroupsByField[]
}

export interface PopularGroupsByField {
    _id: string;
    fieldName: string;
    groups: Group[]
}

export interface GroupDetailInfo {
    _id: string;
    Name: string;
    Description: string;
    CreatedBy: {
        _id: string;
        Username: string;
        AvatarURL: string;
    }
    NumberOfTag: number;
    NumberOfMembers: number;
    TotalNumberOfBlogsLikes: number;
    Field: {
        _id: string;
        FieldName: string;
    },
    CoverURL: string;
    Tags: GroupTag[]
    Role: string,
    isJoined: boolean
}

export interface SearchedField {
    _id: string;
    FieldName: string;
    DefaultTags: GroupTag[]
}

export interface SearchFieldResult {
    Fields: SearchedField[]
}

export interface GroupRule {
    _id: string;
    RuleName: string;
    RuleDescription: string;
}

export interface CreateGroupTag {
    TagName: string,
    FieldID: string,
    NumberOfBlogUse: number,
    IsDefaultTag: boolean
}

// export interface CreateGroup {
//     Name: string;
//     Description: string;
//     GroupField: 
// }