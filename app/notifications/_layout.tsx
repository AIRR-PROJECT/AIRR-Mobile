import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";

const SettingsIcon = () => (
  <TouchableOpacity activeOpacity={0.7}>
    <Ionicons name="settings" size={24} color="#fff" style={{ padding: 10 }} />
  </TouchableOpacity>
);

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E1E1E",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Notifications",
          headerRight: () => <SettingsIcon />,
        }}
      />
    </Stack>
  );
}
