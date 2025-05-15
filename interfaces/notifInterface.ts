import { InteractType, NotificationType, RequestType } from "@/enums/notif_type.enum";

export interface RegisterNotifToken {
    token: string;
}

export interface UpdateSeenNotif {
    notif_id: string;
}

export interface BlogInteractNotification {
    blog_id: string
    comment_id?: string
    interact_type: InteractType
    message: string
    title: string
    blog_owner: RequestOwner
}

export interface RequestOwner {
    _id: string
    AvatarURL: string;
    Name?: string;
    Username: string;
    CreateDate: string;
}

export interface PermissionNotification {
    blog_id?: string
    group_id: string
    report_id?: string
    request_tag_id?: string
    request_permission_id?: string
    request_type: RequestType
    message: string
    title: string
    request_owner: RequestOwner
}

export interface OtherNotification {
    message: string
    title: string
    request_owner: RequestOwner
}

export interface NotificationResponseData {
    id: string
    data: BlogInteractNotification | PermissionNotification | OtherNotification
    type: NotificationType
    seen: boolean
    time: Date
}