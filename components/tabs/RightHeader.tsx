import { StyleSheet, Text, TouchableOpacity, Pressable } from "react-native";
import { View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hook";
import { memo, useCallback } from "react";

const sample_avatar = require("@/assets/images/sample-avatar.png");

type RightHeaderProps = {
  avatar?: string;
};

function RightHeader({ avatar }: RightHeaderProps) {
  const router = useRouter();
  const { userAvatar } = useAppSelector((state) => state.user);
  const { notifCount } = useAppSelector((state) => state.notif);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleAvatarPress = useCallback(() => {
    console.log("Avatar pressed");
    router.push("/profile");
  }, [router]);

  const handleNotificationPress = useCallback(() => {
    console.log("Notification pressed");
    router.push("/notifications");
  }, [router]);

  const handleFeedSettingsPress = useCallback(() => {
    router.push("/feed-setting");
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Feed Settings Button */}
      <TouchableOpacity
        style={styles.feed_settings_icon}
        activeOpacity={0.7}
        onPressOut={handleFeedSettingsPress}
      >
        <Ionicons name="filter" size={18} color="#fff" />
      </TouchableOpacity>

      <Divider orientation="vertical" width={1} />

      {/* Notification Tracker */}
      <TouchableOpacity
        style={styles.notification_container}
        activeOpacity={0.7}
        onPressOut={handleNotificationPress}
      >
        <Ionicons name="notifications-circle" size={24} color="#B9FF66" />
        {notifCount > 0 && <Text style={styles.text}>{notifCount}</Text>}
      </TouchableOpacity>

      <Divider orientation="vertical" width={1} />

      {/* Avatar (Circle Container) */}
      <TouchableOpacity 
        style={styles.avatar_container} 
        activeOpacity={0.7}
        onPressOut={handleAvatarPress}
      >
        <Image
          source={userAvatar ? { uri: userAvatar } : sample_avatar}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>
    </View>
  );
}

export default memo(RightHeader);

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