import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SaveProfileChanges from "@/components/profile/SaveProfileChanges";
import ButtonGradient from "@/components/ButtonGradient";
import { useAppSelector } from "@/redux/hook";

const SettingsIcon = ({ isOwnProfile }: { isOwnProfile: boolean }) => (
  
  <ButtonGradient
    label="Edit profile"
    onPress={() => {
      router.push("/profile/edit-profile");
    }}
    style={styles.editProfileButton}
    labelStyle={styles.editProfileButtonText}
  />
);

export default function ProfileLayout() {
  const { isViewingOwnProfile } = useAppSelector(state => state.user)

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
          headerRight: () => <SettingsIcon isOwnProfile={isViewingOwnProfile}/>, 
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 120,
    borderRadius: 20,
    backgroundColor: "#1B1B24",
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#B9FF9F",
  },
  userInfoSection: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
    width: "auto",
  },
  userFullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  userUsername: {
    fontSize: 12,
    color: "#B9FF66",
  },
  userDateJoined: {
    fontSize: 12,
    color: "#828998",
    fontStyle: "italic",
  },
  userFollowers: {
    fontSize: 12,
    color: "#fff",
  },
  userFollowing: {
    fontSize: 12,
    color: "#fff",
  },
  followText: {
    fontSize: 12,
    color: "#CBCCCE",
  },
  editProfileButton: {
    width: 110,
    height: 50,
    borderRadius: 25,
    paddingBlock: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
  },
  editProfileButtonText: {
    fontSize: 14,
    color: "#000",
  },
});
