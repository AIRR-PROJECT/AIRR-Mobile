import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { SearchBarBlog } from "@/interfaces/blogInterface";
import { SearchBarGroup } from "@/interfaces/groupInterface";
import { router } from "expo-router";

// Change the view to touchable component to make it clickable
type SearchBlogComponentProps = {
  thumbnail: string;
  title: string;
  description: string;
};
function SearchBlogComponent({
  _id,
  Title,
  Description,
  Owner
}: SearchBarBlog) {
  const handlePress = () => {
    router.push(`/blog?userBlogId=${_id}`)
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* thumbnail */}
      <Image source={Owner.AvatarURL} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {Title}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {Description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

type SearchGroupComponentProps = {
  image: string;
  name: string;
  description: string;
  numberOfMembers: number;
};

function SearchGroupComponent({
  _id,
  Name,
  Description,
  CoverURL
}: SearchBarGroup) {
  const handlePress = () => {
    router.push(`/group?groupId=${_id}`)
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {/* image */}
      <Image source={CoverURL} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {Name}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: "#666" }}>
          {Description}
        </Text>
      </View>
      {/* <View style={styles.memberContainer}>
        <Text>{numberOfMembers} members</Text>
      </View> */}
    </TouchableOpacity>
  );
}

type SearchUserComponentProps = {
  avatar: string;
  name: string;
};
function SearchUserComponent({ avatar, name }: SearchUserComponentProps) {
  return (
    <View style={styles.container}>
      <Image source={avatar} style={styles.image} />
      <Text style={styles.title}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    height: 100,
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  item: {
    padding: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  memberContainer: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#F5FFF7",
  },
});
export { SearchBlogComponent, SearchGroupComponent, SearchUserComponent };
