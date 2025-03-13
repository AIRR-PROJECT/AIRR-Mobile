import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { Group } from "@/interfaces/groupInterface";

type BlogGroup = Pick<Group, "name" | "avatar" | "numberOfMembers">;

interface BlogInGroupProps {
  group: BlogGroup;
  style?: ViewStyle;
}

export default function GroupPreviewInfo({ group, style }: BlogInGroupProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <ThemedText
          style={styles.name}
          type="defaultSemiBold"
          lightColor="#fff"
          darkColor="#fff"
        >
          {group.name}
        </ThemedText>
        <ThemedText
          style={styles.memberCount}
          type="subtitle"
          lightColor="#fff"
          darkColor="#fff"
        >
          {group.numberOfMembers} members
        </ThemedText>
      </View>
      <Image source={{ uri: group.avatar }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 8,
    columnGap: 10,
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
  memberCount: {
    flexWrap: "wrap",
    fontSize: 12,
  },
});
