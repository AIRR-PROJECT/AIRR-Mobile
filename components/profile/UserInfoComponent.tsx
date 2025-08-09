import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Image } from "expo-image";
import ButtonGradient from "../ButtonGradient";
import { useRouter } from "expo-router";
import { User } from "@/interfaces/userInterface";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { format } from "date-fns";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type UserInfo = Pick<
  User,
  | "username"
  | "avatarURL"
  | "firstName"
  | "lastName"
  | "joinDate"
  | "dateOfBirth"
>;

type UserInfoProps = UserInfo & { isOwnProfile: boolean };

export default function UserInfoComponent({
  username,
  avatarURL,
  firstName,
  lastName,
  joinDate,
  isOwnProfile,
}: // followers,
// following,
UserInfoProps) {
  const router = useRouter();

  const { userAvatar, user } = useAppSelector((state) => state.user);

  const handleEditProfile = () => {
    router.push("/profile/edit-profile");
  };
  useEffect(() => {}, []);
  // Format join date as "Joined at MM/yyyy"
  let joinedText = "Joined at ";
  if (joinDate) {
    try {
      joinedText += format(new Date(joinDate), "MM/yyyy");
    } catch {
      joinedText += "unknown";
    }
  } else {
    joinedText += "unknown";
  }
  return (
    <View style={styles.container}>
      {/* User avatar */}
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 15,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={isOwnProfile ? userAvatar : avatarURL}
          style={styles.avatar}
          contentFit="fill"
        />
      </View>
      {/* user info */}
      <View style={styles.userInfoSection}>
        {/* user full name */}
        {!isOwnProfile && <Text style={styles.userFullName}>
          {firstName || lastName ? firstName + " " + lastName : "No name"}
        </Text>}
        {isOwnProfile && user && <Text style={styles.userFullName}>
          {user.firstName || user.lastName ? user.firstName + " " + user.lastName : "No name"}
        </Text>}
        {/* Edit profile button */}
        {/* {isOwnProfile && (
            <ButtonGradient
              label="Edit profile"
              onPress={handleEditProfile}
              style={styles.editProfileButton}
              labelStyle={styles.editProfileButtonText}
            />
          )} */}

        {/* user username and day joined*/}
        <Text
          style={styles.userUsername}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          @{username}
        </Text>
        {/* User joined Date */}
        <Text style={styles.userDateJoined}>{joinedText}</Text>
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
    backgroundColor: "#181818",
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#80ff52ff",
  },
  userInfoSection: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginLeft: 10,
    flex: 1,
    height: 80,
  },
  userFullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  userUsername: {
    fontSize: 12,
    color: "#B9FF66",
    width: "90%",
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
