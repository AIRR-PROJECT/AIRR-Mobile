import { User } from "@/interfaces/userInterface";
import { useRouter } from "expo-router";
// enum NotificationType {
//   REACTION = "REACTION",
//   COMMENT = "COMMENT",
//   MENTION = "MENTION",
//   FOLLOW = "FOLLOW",
// }
type NotificationItemProps = {
  id: string;
  description: string;
  date: Date;
  isRead: boolean;
  from: Pick<User, "_id" | "username" | "avatarURL">;
  type: NotificationType;
  blogImage?: string;
  data: BlogInteractNotification | PermissionNotification | OtherNotification,
  onMarkAsRead: (id: string) => void;
};

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { formatUnixDate } from "@/utils/dateConvert";
import { InteractType, NotificationType, RequestType } from "@/enums/notif_type.enum";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { decreaseNotifCount, updateSeenNotif } from "@/redux/slices/notifSlice";
import { BlogInteractNotification, PermissionNotification, OtherNotification } from "@/interfaces/notifInterface";
import { formatDistance } from "date-fns";
// based on type of notification, handle move to different screen
// if notification is user like the blog, move to the post screen
// if notification is user comment on the blog, move to the blog screen
// if notification is user mention you in the comment, move to the post screen
// if notification is user mention you in the post, move to the post screen

// if notification is user follow you, move to the user profile screen

export default function NotificationsItem({
  id,
  description,
  date,
  isRead,
  from,
  type,
  blogImage,
  data,
  onMarkAsRead,
}: NotificationItemProps) {
  const route = useRouter();
  const dispatch = useAppDispatch()

  const [seen, setSeen] = useState(isRead)

  const handlePress = () => {
    if (!seen) {
      dispatch(updateSeenNotif({
        notif_id: id
      })).then((res) => {
        if (res.payload) {
          onMarkAsRead(id);
          setSeen(true)

          dispatch(decreaseNotifCount())
        }
      })
    }

    switch (type) {
      case NotificationType.PERMISSION:
        const permissionData = data as PermissionNotification
        
        switch (permissionData.request_type) {
          case RequestType.REQUEST_REPORT_BLOG:
            // TODO: route to report page  
            break;
          case RequestType.REQUEST_POST_BLOG:
            route.push(`/group/approvals/blogs?groupID=${permissionData.group_id}&blogID=${permissionData.blog_id}`)

            break;
          case RequestType.REQUEST_JOIN_GROUP:
            route.push(`/group/approvals/members?groupID=${permissionData.group_id}&memberID=${permissionData.request_owner._id}`)

            break;
          case RequestType.REQUEST_NEW_TAG:
            route.push(`/group/approvals/tags?groupID=${permissionData.group_id}&tagID=${permissionData.request_tag_id}`)

            break;
        }
        break;
      case NotificationType.INTERACTION:
        const interactionData = data as BlogInteractNotification

        if (interactionData.interact_type === InteractType.Comment) {
          route.push(`/blog?userBlogId=${interactionData.blog_id}&userBlogCommentId=${interactionData.comment_id}`)
        }
        else {
          route.push(`/blog?userBlogId=${interactionData.blog_id}`)
        }
        break;
      default:
        const otherData = data as OtherNotification
        route.push(`/profile?userID=${otherData.request_owner._id}`)

        break
    }
  };
  const handleFollow = () => {
    if (!seen) {
      dispatch(updateSeenNotif({
        notif_id: id
      })).then((res) => {
        if (res.payload) {
          onMarkAsRead(id);
          setSeen(true)
        }
      })
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          { backgroundColor: seen ? "#fff" : "#000" },
        ]}
      >
        {/* Image from user noti */}
        <Image
          source={from.avatarURL}
          style={styles.avatar}
          contentFit="cover"
          transition={1000}
          placeholder="blur"
          placeholderContentFit="cover"
        />
        <View style={styles.innerContainer}>
          <View>
            <Text style={[styles.name, { color: seen ? "#000" : "#fff" }]}>
              {/* {from.firstName} {from.lastName} */}
              {from.username}
            </Text>
            <View style={styles.rowContainer}>
              <Text
                style={[
                  styles.description,
                  { color: seen ? "#000" : "#fff" },
                ]}
              >
                {description}.
                <Text
                  style={[
                    styles.date,
                    { color: seen ? "#9E9E9E" : "#9E9E9E" },
                  ]}
                >
                  {" "}
                  {new Date(date).toDateString()}
                </Text>
              </Text>
            </View>
            <Text
              style={[styles.date, { color: isRead ? "#9E9E9E" : "#9E9E9E" }]}
            >
              {formatDistance(new Date(date), new Date(), {
                addSuffix: true,
                includeSeconds: true,
              })}
            </Text>
          </View>

          <View style={{ marginLeft: 4 }}>
            {/* {type === NotificationType.OTHER && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Follow</Text>
                </TouchableOpacity>
              </View>
            )} */}
            {type !== NotificationType.OTHER && (
              <View>
                <Image
                  source={blogImage}
                  style={styles.blogImage}
                  contentFit="cover"
                  transition={1000}
                  placeholder="blur"
                  placeholderContentFit="cover"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
  },
  date: {
    fontSize: 12,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 14,
    color: "#1E1E1E",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 10,
  },
  blogImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  buttonContainer: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
});
