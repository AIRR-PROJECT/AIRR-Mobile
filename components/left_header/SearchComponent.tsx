import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";

// Change the view to touchable component to make it clickable
type SearchBlogComponentProps = {
  thumbnail: string;
  title: string;
  description: string;
};
function SearchBlogComponent({
  thumbnail,
  title,
  description,
}: SearchBlogComponentProps) {
  return (
    <View style={styles.container}>
      {/* thumbnail */}
      <Image source={thumbnail} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
    </View>
  );
}

type SearchGroupComponentProps = {
  image: string;
  name: string;
  description: string;
  numberOfMembers: number;
};

function SearchGroupComponent({
  image,
  name,
  description,
  numberOfMembers,
}: SearchGroupComponentProps) {
  return (
    <View style={styles.container}>
      {/* image */}
      <Image source={image} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: "#666" }}>
          {description}
        </Text>
      </View>
      <View style={styles.memberContainer}>
        <Text>{numberOfMembers} members</Text>
      </View>
    </View>
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
