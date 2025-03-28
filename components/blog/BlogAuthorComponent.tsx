import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { FontAwesome5 } from "@expo/vector-icons";

type Author = {
  name: string;
  image: string;
  userName: string;
  streak: number;
};

// later change this component to take a user prop
export default function BlogAuthorComponent({
  name,
  image,
  userName,
  streak,
}: Author) {
  return (
    <View style={styles.rowContainer}>
      {/* User avatar */}
      <Image style={styles.authorImage} source={{ uri: image }} />
      <View>
        <View style={[styles.rowContainer, {gap: 5}]}>
          <Text style={styles.authorName}>{name}</Text>
          <FontAwesome5 name="fire-alt" size={20} color="#B9FF66" />
          <Text style={styles.authorName}>{streak}</Text>
        </View>
        <Text style={styles.authorUsername}>@{userName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 45,
    marginRight: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  authorUsername: {
    color: "#fff",
    fontSize: 14,
  },
});
