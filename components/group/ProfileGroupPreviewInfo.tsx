import { View, Image, StyleSheet, ViewStyle, Text } from "react-native";
import { Group } from "@/interfaces/groupInterface";
import { memo } from "react";

type BlogGroup = Pick<Group, "Name" | "CoverURL" | "NumberOfMembers">;

interface BlogInGroupProps {
  group: BlogGroup;
  style?: ViewStyle;
}

function ProfileGroupPreviewInfo({ group, style }: BlogInGroupProps) {
  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: group.CoverURL }} style={styles.image} />
      <View>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {group.Name?.length > 10 ? group.Name.slice(0, 10) + "…" : group.Name}
        </Text>
        <Text style={styles.memberCount}>
          {group.NumberOfMembers}{" "}
          {group.NumberOfMembers > 1 ? "members" : "member"}
        </Text>
      </View>
    </View>
  );
}
export default memo(ProfileGroupPreviewInfo);

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    borderWidth: 1,
    borderColor: "#B9FF66",
    padding: 20,
    paddingVertical: 10,
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    color: "#fff",
  },
  memberCount: {
    flexWrap: "wrap",
    fontSize: 12,
    color: "#eee",
  },
});