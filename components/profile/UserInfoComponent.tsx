import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Image } from "expo-image";
import ButtonGradient from "../ButtonGradient";
import { useRouter } from "expo-router";
import { User } from "@/interfaces/userInterface";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";
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
  dateOfBirth: dateJoined,
  isOwnProfile,
}: // followers,
// following,
UserInfoProps) {
  const router = useRouter();

  const { userAvatar } = useAppSelector((state) => state.user);

  const handleEditProfile = () => {
    console.log("Edit profile");
    router.push("/profile/edit-profile");
  };
  useEffect(() => {}, []);
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
            alignItems: "center",
          }}
        >
          <ThemedText type="title" style={styles.userFullName}>
            {firstName || lastName
              ? (firstName + " " + lastName)
              : "No name"}
          </ThemedText>
          {/* Edit profile button */}
          {isOwnProfile && (
            <ButtonGradient
              label="Edit profile"
              onPress={handleEditProfile}
              style={styles.editProfileButton}
              labelStyle={styles.editProfileButtonText}
            />
          )}
        </View>
        {/* user username and day joined*/}
        <View style={{ flexDirection: "row" }}>
          <Text
            style={styles.userUsername}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            @{username}
          </Text>
        </View>
        {/* User joined Date */}
        <Text style={styles.userDateJoined}>
          Joined at{" "}
          {new Date(dateJoined).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
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
