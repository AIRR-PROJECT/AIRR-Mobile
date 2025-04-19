import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { User1 } from "@/interfaces/userInterface";

type Author = Pick<User1, "name" | "avatar">;

interface BlogAuthorProps {
  author: Author;
  style?: ViewStyle;
  time?: string;
}
const mockDate = "12 minutes ago";
export default function BlogAuthor({ author, style, time }: BlogAuthorProps) {
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
          {mockDate ?? time}
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
    width: 50,
    height: 50,
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
