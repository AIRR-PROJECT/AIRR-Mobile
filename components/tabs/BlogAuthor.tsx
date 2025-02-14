import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { User } from "@/interfaces/userInterace";

type Author = Pick<User, "name" | "avatar">;

interface BlogAuthorProps {
    author: Author;
    style?: ViewStyle;
}
const mockDate = '12 minutes ago'
export default function BlogAuthor({ author, style }: BlogAuthorProps) {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: author.avatar }} style={styles.image} />
      <View style={styles.textContainer}>
        <ThemedText
          style={styles.name}
          type="defaultSemiBold"
          lightColor="#fff"
          darkColor="#fff"
        >
          {author.name}
        </ThemedText>
        <ThemedText
          style={styles.date}
          type="subtitle"
          lightColor="#fff"
          darkColor="#fff"
        >
          {mockDate}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    marginBottom: 5,
  },
  date: {
    flexWrap: "wrap",
    fontSize: 12,
  },
});
