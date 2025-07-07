import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

type Author = {
  _id: string
  Name: string;
  AvatarURL: string;
  Username: string;
  // streak: number;
};

// later change this component to take a user prop
export default function BlogAuthorComponent({
  _id,
  Name,
  AvatarURL,
  Username,
  // streak,
}: Author) {
  const handleOnPress = () => {
    router.push(`/profile?userID=${_id}`)
  }
  
  return (
    <TouchableOpacity style={styles.rowContainer} onPress={handleOnPress}>
      {/* User avatar */}
      <Image style={styles.authorImage} source={{ uri: AvatarURL }} />
      <View>
        <View style={[styles.rowContainer, {gap: 5}]}>
          
          <Text style={styles.authorName}>{Name.trim().length == 0 ? "No name" : Name}</Text> 
          {/* <Text style={styles.authorName}>{streak}</Text> */}
        </View>
        <Text style={styles.authorUsername}>@{Username}</Text>
      </View>
    </TouchableOpacity>
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
