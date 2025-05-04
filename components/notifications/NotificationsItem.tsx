import { User } from "@/interfaces/userInterface";
import { useRouter } from "expo-router";
enum NotificationType {
  REACTION = "REACTION",
  COMMENT = "COMMENT",
  MENTION = "MENTION",
  FOLLOW = "FOLLOW",
}
type NotificationItemProps = {
  id: string;
  description: string;
  date: number;
  isRead: boolean;
  from: Pick<User, "_id" | "firstName" | "lastName" | "avatarURL">;
  type: NotificationType;
  blogImage?: string;
  onMarkAsRead: (id: string) => void;
};

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { formatUnixDateAmPm } from "@/utils/dateConvert";
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
  onMarkAsRead,
}: NotificationItemProps) {
  const route = useRouter();
  const handlePress = () => {
    if (!isRead) {
      onMarkAsRead(id);
      isRead = true;
    }
    if (type === NotificationType.FOLLOW) {
      // navigate to user profile screen
      // route.push(`/profile/${from._id}`);
    } else {
      // navigate to blog screen
      // route.push(`/blog/${id}`);
    }
  };
  const handleFollow = () => {
    if (!isRead) {
      onMarkAsRead(id);
      isRead = true;
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        style={[
          styles.container,
          { backgroundColor: isRead ? "#fff" : "#000" },
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
            <Text style={[styles.name, { color: isRead ? "#000" : "#fff" }]}>
              {from.firstName} {from.lastName}
            </Text>
            <View style={styles.rowContainer}>
              <Text
                style={[
                  styles.description,
                  { color: isRead ? "#000" : "#fff" },
                ]}
              >
                {description}.
                <Text
                  style={[
                    styles.date,
                    { color: isRead ? "#9E9E9E" : "#9E9E9E" },
                  ]}
                >
                  {" "}
                  {formatUnixDateAmPm(date)}
                </Text>
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: 4 }}>
            {type === NotificationType.FOLLOW && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                  <Text style={styles.buttonText}>Follow</Text>
                </TouchableOpacity>
              </View>
            )}
            {type !== NotificationType.FOLLOW && (
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
    padding: 20,
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
