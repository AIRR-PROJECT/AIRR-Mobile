import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity>
            <Ionicons
              name="settings"
              size={24}
              color="#fff"
              style={[{ padding: 10 }]}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "#1E1E1E",
        }
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Profile" }} />
      <Stack.Screen
        name="edit-profile"
        options={{ headerTitle: "Edit Profile" }}
      />
    </Stack>
  );
}
