import { View, Image, StyleSheet, ViewStyle, Text } from "react-native";
import { Group } from "@/interfaces/groupInterface";

type BlogGroup = Pick<Group, "Name" | "CoverURL" | "NumberOfMembers">;

interface BlogInGroupProps {
  group: BlogGroup;
  style?: ViewStyle;
}

export default function GroupPreviewInfo({ group, style }: BlogInGroupProps) {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: group.CoverURL }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">{group.Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    columnGap: 10,
    flex: 1,
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  memberCount: {
    flexWrap: "wrap",
    fontSize: 12,
  },
});
