import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import SaveProfileChanges from "@/components/profile/SaveProfileChanges";

const SettingsIcon = () => (
  <View>
    <Ionicons name="settings" size={24} color="#fff" style={{ padding: 10 }} />
  </View>
);

export default function ProfileLayout() {
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
          headerTitle: "Profile",
          headerRight: () => <SettingsIcon />, 
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: "Edit Profile",
          headerRight: () => <SaveProfileChanges />, 
        }}
      />
    </Stack>
  );
}
