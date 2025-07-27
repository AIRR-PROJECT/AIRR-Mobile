import { StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import { View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hook";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type RightHeaderProps = {
  avatar?: string;
};

export default function RightHeader({ avatar }: RightHeaderProps) {
  const route = useRouter();
  const { userAvatar } = useAppSelector((state) => state.user);
  const { notifCount } = useAppSelector((state) => state.notif);

  const handleAvatarPress = () => {
    route.push("/profile");
  };

  const handleNotificationPress = () => {
    route.push("/notifications");
  };

  return (
    <View style={styles.container}>
      {/* Feed Settings Button */}
      <TouchableOpacity
        style={styles.feed_settings_icon}
        onPress={() => route.push("/feed-setting")}
      >
        <Ionicons name="filter" size={18} color="#fff" />
      </TouchableOpacity>

      <Divider orientation="vertical" width={1} />

      {/* Notification Tracker */}
      <TouchableOpacity
        style={styles.notification_container}
        activeOpacity={0.7}
        onPress={handleNotificationPress}
      >
        <Ionicons name="notifications-circle" size={24} color="#B9FF66" />
        {notifCount > 0 && <Text style={styles.text}>{notifCount}</Text>}
      </TouchableOpacity>

      <Divider orientation="vertical" width={1} />

      {/* Avatar (Circle Container) */}
      <Pressable style={styles.avatar_container} onPress={handleAvatarPress}>
        <Image
          source={userAvatar ? { uri: userAvatar } : sample_avatar}
          style={styles.avatar}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  feed_settings_icon: {
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  notification_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 5,
  },
  avatar_container: {
    paddingLeft: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});