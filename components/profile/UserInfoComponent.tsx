import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Image } from "expo-image";
import ButtonGradient from "../ButtonGradient";
import { useRouter } from "expo-router";
import { User } from "@/interfaces/userInterface";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type UserInfo = Pick<User, "username" | "avatarURL" | "firstName" | "lastName" | "joinDate">

type UserInfoProps = UserInfo & { isOwnProfile: boolean };

export default function UserInfoComponent({
  username,
  avatarURL,
  firstName,
  lastName,
  joinDate,
  isOwnProfile
  // followers,
  // following,
}: UserInfoProps) {
  const router = useRouter();

  const { userAvatar } = useAppSelector(state => state.user)

  const [followers, setFollowers] = useState(1)
  const [following, setFollowing] = useState(1)

  const handleEditProfile = () => {
    console.log("Edit profile");
    router.push("/profile/edit-profile");
  };
  useEffect(() => {
  }, [])
  return (
    <View style={styles.container}>
      {/* User avatar */}
      <Image source={isOwnProfile ? userAvatar : avatarURL} style={styles.avatar} contentFit="contain" />
      {/* user info */}
      <View style={styles.userInfoSection}>
        {/* user full name */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            alignItems: "center",
          }}
        >
          <ThemedText type="title" style={styles.userFullName}>
            {(firstName || lastName) ? (firstName + " " + lastName).slice(0, 10) : "No name"}
          </ThemedText>
          {/* Edit profile button */}
          {
            isOwnProfile && <ButtonGradient
              label="Edit profile"
              onPress={handleEditProfile}
              style={styles.editProfileButton}
              labelStyle={styles.editProfileButtonText}
            />
          }
        </View>
        {/* user username  and day join*/}
        <View style={{ flexDirection: "row" }}>
          <ThemedText style={styles.userUsername}>
            @{username.slice(0, 8)}
          </ThemedText>
          <ThemedText style={styles.userDateJoined}> . {new Date(joinDate!).toDateString()}</ThemedText>
        </View>
        {/* user followers and following */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ThemedText style={styles.userFollowers}>
            {followers}{" "}
            <ThemedText style={styles.followText}>Followers</ThemedText>
          </ThemedText>
          <ThemedText style={styles.userFollowing}>
            {following}{" "}
            <ThemedText style={styles.followText}>Following</ThemedText>
          </ThemedText>
        </View>
      </View>
    </View>
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
    width: 120,
    height: 120,
    borderRadius: 15,
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
    color: "#fff",
  },
  userDateJoined: {
    fontSize: 12,
    color: "#828998",
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
