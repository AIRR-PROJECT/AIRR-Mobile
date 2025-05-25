import NotificationsItem from "@/components/notifications/NotificationsItem";
import { NotificationType, RequestType } from "@/enums/notif_type.enum";
import { BlogInteractNotification, NotificationResponseData, OtherNotification, PermissionNotification } from "@/interfaces/notifInterface";
import { useAppDispatch } from "@/redux/hook";
import { decreaseNotifCount, getAllNotif } from "@/redux/slices/notifSlice";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  Text,
  TouchableOpacity,
} from "react-native";

// enum NotificationType {
//   REACTION = "REACTION",
//   COMMENT = "COMMENT",
//   MENTION = "MENTION",
//   FOLLOW = "FOLLOW",
// }

// const mockFollower = {
//   firstName: "John",
//   lastName: "Doe",
//   _id: "123456789",
//   avatarURL: "https://picsum.photos/200",
//   description: "Started following you",
// };
// const mockReaction = {
//   firstName: "Jane",
//   lastName: "Smith",
//   _id: "987654321",
//   avatarURL: "https://picsum.photos/200",
//   description: "Liked your post",
//   blogImage: "https://picsum.photos/300",
// };
// const mockComment = {
//   firstName: "Alice",
//   lastName: "Johnson",
//   _id: "456789123",
//   avatarURL: "https://picsum.photos/200",
//   description: "Commented on your post",
//   blogImage: "https://picsum.photos/300",
// };
// const mockData = [
//   {
//     ...mockFollower,
//     type: NotificationType.FOLLOW,
//     isRead: false,
//     date: Date.now() / 1000, // Change to ISO or Unix timestamp, which ever you prefer, if
//     // if ISO, change the function in NotificationsItem to handle ISO date
//   },
//   {
//     ...mockFollower,
//     type: NotificationType.FOLLOW,
//     isRead: true,
//     date: Date.now() / 1000,
//   },
//   {
//     ...mockReaction,
//     type: NotificationType.REACTION,
//     isRead: false,
//     date: Date.now() / 1000,
//   },
//   {
//     ...mockReaction,
//     type: NotificationType.REACTION,
//     isRead: true,
//     date: Date.now() / 1000 - 100000,
//   },
//   {
//     ...mockFollower,
//     type: NotificationType.FOLLOW,
//     isRead: true,
//     date: Date.now() / 1000 - 500000,
//   },
//   {
//     ...mockFollower,
//     type: NotificationType.FOLLOW,
//     isRead: false,
//     date: Date.now() / 1000 - 420000,
//   },
//   {
//     ...mockComment,
//     type: NotificationType.COMMENT,
//     isRead: false,
//     date: Date.now() / 1000 - 1000000,
//   },
//   {
//     ...mockComment,
//     type: NotificationType.COMMENT,
//     isRead: true,
//     date: Date.now() / 1000 - 2000000,
//   },
// ];

// Helper to check if a date is today
const isToday = (date: Date) => {
  const input = new Date(date)
  const now = new Date();
  return input.getDate() === now.getDate() &&
    input.getMonth() === now.getMonth() &&
    input.getFullYear() === now.getFullYear()
};

const descriptionFromType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.INTERACTION:
      return "Liked your blog"
    case NotificationType.PERMISSION:
      return "Gave you permission"
    case NotificationType.OTHER:
      return "Sent you a notification"
  }

  return ""
}

export default function NotificationsLayout() {
  const dispatch = useAppDispatch()

  const [sections, setSections] = useState<{ title: string; data: NotificationResponseData[]; }[]>([])

  const handleMarkAsRead = (id: string) => {
    // Khoa: Call your API to mark the notification as read
    // For now, just log it
    console.log(`Notification with ID ${id} marked as read`);
  };

  // const todayItems = mockData
  //   .filter((item) => isToday(item.date))
  //   .sort((a, b) => b.date - a.date); // Descending

  // const earlierItems = mockData
  //   .filter((item) => !isToday(item.date))
  //   .sort((a, b) => b.date - a.date); // Descending

  // const sections = [];
  // if (todayItems.length > 0)
  //   sections.push({ title: "Today", data: todayItems });
  // if (earlierItems.length > 0)
  //   sections.push({ title: "Earlier", data: earlierItems });

  useEffect(() => {
    dispatch(getAllNotif()).then((res) => {
      const data = res.payload as NotificationResponseData[]

      const todayItems = data
        .filter((item) => isToday(item.time))
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Descending
    
      const earlierItems = data
        .filter((item) => !isToday(item.time))
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Descending

      console.log(earlierItems)

      const sections = [];
      if (todayItems.length > 0)
        sections.push({ title: "Today", data: todayItems });
      if (earlierItems.length > 0)
        sections.push({ title: "Earlier", data: earlierItems });

      setSections(sections)
    })
  }, [])

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let notifData

          switch (item.type) {
            case NotificationType.INTERACTION:
              notifData = item.data as BlogInteractNotification
              return (
                <NotificationsItem
                  id={item.id}
                  description={notifData.message ?? `Reacted ${notifData.interact_type} to your blog`}
                  date={item.time}
                  isRead={item.seen}
                  from={{
                    _id: notifData.blog_owner._id,
                    username: notifData.blog_owner.Username,
                    avatarURL: notifData.blog_owner.AvatarURL,
                  }}
                  type={item.type}
                  data={item.data}
                  onMarkAsRead={handleMarkAsRead}
                  // blogImage={item.blogImage ?? null}
                />
              )
            case NotificationType.PERMISSION:
              notifData = item.data as PermissionNotification

              let description
              switch (notifData.request_type) {
                case RequestType.REQUEST_JOIN_GROUP:
                  description = "Requested to join group"
                  break;
                case RequestType.REQUEST_NEW_TAG:
                  description = "Requested to create a new tag"
                  break;
                case RequestType.REQUEST_POST_BLOG:
                  description = "Requested to post a new blog"
                  break;
                default:
                  description = "Requested to report a blog"
                  break;
              }

              return (
                <NotificationsItem
                  id={item.id}
                  description={notifData.message ?? description}
                  date={item.time}
                  isRead={item.seen}
                  from={{
                    _id: notifData.request_owner._id,
                    username: notifData.request_owner.Username,
                    avatarURL: notifData.request_owner.AvatarURL,
                  }}
                  type={item.type}
                  data={item.data}
                  onMarkAsRead={handleMarkAsRead}
                  // blogImage={item.blogImage ?? null}
                />
              )
            default:
              notifData = item.data as OtherNotification
              return (
                <NotificationsItem
                  id={item.id}
                  description={notifData.message ?? "Sent you a notification"}
                  date={item.time}
                  isRead={item.seen}
                  from={{
                    _id: notifData.request_owner._id,
                    username: notifData.request_owner.Username,
                    avatarURL: notifData.request_owner.AvatarURL,
                  }}
                  type={item.type}
                  data={item.data}
                  onMarkAsRead={handleMarkAsRead}
                  // blogImage={item.blogImage ?? null}
                />
              )
          }
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.prevNotiContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.prevNotiText}>See previous notifications</Text>
          </TouchableOpacity>
        )}
        ListFooterComponentStyle={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 10,
  },
  prevNotiContainer: {
    backgroundColor: "#2E3B40",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  prevNotiText: {
    color: "#fff",
    fontSize: 16,
  },
});
