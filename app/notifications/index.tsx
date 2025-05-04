import NotificationsItem from "@/components/notifications/NotificationsItem";
import { StyleSheet, View, SectionList, Text } from "react-native";

enum NotificationType {
  REACTION = "REACTION",
  COMMENT = "COMMENT",
  MENTION = "MENTION",
  FOLLOW = "FOLLOW",
}

const mockFollower = {
  firstName: "John",
  lastName: "Doe",
  _id: "123456789",
  avatarURL: "https://picsum.photos/200",
  description: "Started following you",
};
const mockReaction = {
  firstName: "Jane",
  lastName: "Smith",
  _id: "987654321",
  avatarURL: "https://picsum.photos/200",
  description: "Liked your post",
  blogImage: "https://picsum.photos/300",
};
const mockData = [
  {
    ...mockFollower,
    type: NotificationType.FOLLOW,
    isRead: false,
    date: Date.now() / 1000,
  },
  {
    ...mockFollower,
    type: NotificationType.FOLLOW,
    isRead: true,
    date: Date.now() / 1000,
  },
  {
    ...mockReaction,
    type: NotificationType.REACTION,
    isRead: false,
    date: Date.now() / 1000,
  },
  {
    ...mockReaction,
    type: NotificationType.REACTION,
    isRead: true,
    date: Date.now() / 1000 - 100000,
  },
  {
    ...mockFollower,
    type: NotificationType.FOLLOW,
    isRead: true,
    date: Date.now() / 1000 - 500000,
  },
  {
    ...mockFollower,
    type: NotificationType.FOLLOW,
    isRead: false,
    date: Date.now() / 1000 - 420000,
  },
];

// Helper to check if a date is today
const isToday = (timestamp: number) => {
  const input = new Date(timestamp * 1000);
  const now = new Date();
  return (
    input.getDate() === now.getDate() &&
    input.getMonth() === now.getMonth() &&
    input.getFullYear() === now.getFullYear()
  );
};

export default function NotificationsLayout() {
  const handleMarkAsRead = (id: string) => {
    // Khoa: Call your API to mark the notification as read
    // For now, just log it
    console.log(`Notification with ID ${id} marked as read`);
  };

  const todayItems = mockData
    .filter((item) => isToday(item.date))
    .sort((a, b) => b.date - a.date); // Descending

  const earlierItems = mockData
    .filter((item) => !isToday(item.date))
    .sort((a, b) => b.date - a.date); // Descending

  const sections = [];
  if (todayItems.length > 0)
    sections.push({ title: "Today", data: todayItems });
  if (earlierItems.length > 0)
    sections.push({ title: "Earlier", data: earlierItems });

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationsItem
            id={item._id}
            description={item.description}
            date={item.date}
            isRead={item.isRead}
            from={{
              _id: item._id,
              firstName: item.firstName,
              lastName: item.lastName,
              avatarURL: item.avatarURL,
            }}
            type={item.type}
            onMarkAsRead={handleMarkAsRead}
            blogImage={item.blogImage ?? null}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
});
