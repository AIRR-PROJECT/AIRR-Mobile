import { EmptyContent } from "@/components/EmptyContent";
import NotificationsItem from "@/components/notifications/NotificationsItem";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import { NotificationType, RequestType } from "@/enums/notif_type.enum";
import {
  BlogInteractNotification,
  NotificationResponseData,
  OtherNotification,
  PermissionNotification,
} from "@/interfaces/notifInterface";
import { useAppDispatch } from "@/redux/hook";
import { decreaseNotifCount, getAllNotif } from "@/redux/slices/notifSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
// Helper to check if a date is today
const isToday = (date: Date) => {
  const input = new Date(date);
  const now = new Date();
  return (
    input.getDate() === now.getDate() &&
    input.getMonth() === now.getMonth() &&
    input.getFullYear() === now.getFullYear()
  );
};

export default function NotificationsLayout() {
  const dispatch = useAppDispatch();

  const refFields = useRef<FlatList>(null);
  const currentOffset = useRef(0);

  const [fetchedData, setFetchedData] = useState<NotificationResponseData[]>(
    []
  );
  const [sections, setSections] = useState<
    { title: string; data: NotificationResponseData[] }[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const tabs = [
    "All",
    NotificationType.INTERACTION,
    NotificationType.PERMISSION,
    NotificationType.OTHER,
  ];

  const handleMarkAsRead = (id: string) => {
    // Khoa: Call your API to mark the notification as read
    // For now, just log it
    console.log(`Notification with ID ${id} marked as read`);
  };

  const handleArrowPress = () => {
    refFields?.current?.scrollToOffset({
      offset: currentOffset.current + 300, // Adjust as needed
      animated: true,
    });
  };

  // Track scroll position without causing re-render
  const handleScroll = ({ nativeEvent }: any) => {
    const offsetX = nativeEvent.contentOffset.x;
    if (Math.abs(currentOffset.current - offsetX) > 10) {
      currentOffset.current = offsetX;
    }
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
    setIsFetching(true);
    dispatch(getAllNotif()).then((res) => {
      setFetchedData(res.payload as NotificationResponseData[]);

      setIsFetching(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setIsFetching(true);
    dispatch(getAllNotif()).then((res) => {
      setFetchedData(res.payload as NotificationResponseData[]);

      setSelectedTab(tabs[0])

      setIsFetching(false);
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  }, []);

  useEffect(() => {
    const data = fetchedData.filter((n) => n.type == selectedTab);

    const todayItems = data
      .filter((item) => isToday(item.time))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Descending

    const earlierItems = data
      .filter((item) => !isToday(item.time))
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()); // Descending

    // console.log(earlierItems)

    const sections = [];
    if (todayItems.length > 0)
      sections.push({ title: "Today", data: todayItems });
    if (earlierItems.length > 0)
      sections.push({ title: "Earlier", data: earlierItems });

    setSections(sections);
  }, [selectedTab, fetchedData]);

  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert(
            "Permission required",
            "Enable push notifications to stay updated."
          );
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const expoPushToken = tokenData.data;

        console.log("Expo Push Token:", expoPushToken);
        // 🔔 Optional: Send this token to your server to send notifications later.
      } else {
        Alert.alert(
          "Physical device required",
          "Push notifications require a real device."
        );
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    registerForPushNotificationsAsync();

    setIsFetching(true);
    dispatch(getAllNotif()).then((res) => {
      setFetchedData(res.payload as NotificationResponseData[]);
      setIsFetching(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* list tags */}
      <View style={styles.rowWrapper}>
        <FlatList
          data={tabs}
          ref={refFields}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabItem,
                selectedTab === item && styles.tabItemActive,
              ]}
              onPress={() => {
                setSelectedTab(item);
              }}
            >
              <Text
                style={{
                  color: selectedTab === item ? "#fff" : "#8A94AC",
                  fontWeight: "bold",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity onPress={handleArrowPress} activeOpacity={0.8}>
          <FontAwesome name="caret-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {isFetching ? (
        <FeedBlogPreviewSkeleton />
      ) : sections.length == 0 ? (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={["1"]}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <EmptyContent />}
          onEndReachedThreshold={0.5}
        >
        </FlatList>
      ) : (
        <SectionList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let notifData;

            switch (item.type) {
              case NotificationType.INTERACTION:
                notifData = item.data as BlogInteractNotification;
                return (
                  <NotificationsItem
                    id={item.id}
                    description={
                      notifData.message ??
                      `Reacted ${notifData.interact_type} to your blog`
                    }
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
                );
              case NotificationType.PERMISSION:
                notifData = item.data as PermissionNotification;

                let description;
                switch (notifData.request_type) {
                  case RequestType.REQUEST_JOIN_GROUP:
                    description = "Requested to join group";
                    break;
                  case RequestType.REQUEST_NEW_TAG:
                    description = "Requested to create a new tag";
                    break;
                  case RequestType.REQUEST_POST_BLOG:
                    description = "Requested to post a new blog";
                    break;
                  default:
                    description = "Requested to report a blog";
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
                );
              default:
                notifData = item.data as OtherNotification;
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
                );
            }
          }}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          // ListFooterComponent={() => (
          //   <TouchableOpacity
          //     style={styles.prevNotiContainer}
          //     activeOpacity={0.7}
          //   >
          //     <Text style={styles.prevNotiText}>See previous notifications</Text>
          //   </TouchableOpacity>
          // )}
          ListFooterComponentStyle={{ marginTop: 20 }}
        />
      )}
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
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabList: {
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  tabItemActive: {
    backgroundColor: "#363B47",
  },
  contentContainer: {
    padding: 20,
  },
  content: {
    color: "#fff",
    fontSize: 18,
  },
});
