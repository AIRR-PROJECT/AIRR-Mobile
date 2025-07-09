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