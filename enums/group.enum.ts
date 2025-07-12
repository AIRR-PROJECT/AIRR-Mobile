export enum GroupRole {
    Member = 'Member',
    Admin = 'Admin',
    Owner = 'Owner',
    Guest = 'Guest',
}

export enum GroupMembershipStage {
    NOT_JOINED = 'NOT_JOINED',
    REQUESTED = 'REQUESTED',
    JOINED = 'JOINED',
    BANNED = 'BANNED'
}

/*
    Not Member = Unjoin / Pending
    Member = Active 
    Admin = Active
    Owner = Active
*/
export enum GroupRoleCheck {
    MEMBER = "Member",
    NOT_MEMBER = "Not Member",
    ADMIN = "Admin",
    OWNER = "Owner"
}

export enum GroupReportType {
    Clickbait = 'Clickbait',
    Inappropriate_Content = 'Inappropriate Content',
    Copyright_Violation = 'Copyright Violation',
    Sensitive_Content = 'Sensitive Content',
    Off_topic = 'Off-topic',
    Other = 'Other'
}