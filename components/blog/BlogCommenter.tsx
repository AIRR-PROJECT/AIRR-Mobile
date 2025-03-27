import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Feather, FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Divider } from "@rneui/base";

type Commenter = {
  name: string;
  image: string;
  date: string;
  comment: string;
};

// later change this component to take a user prop
export default function BlogCommenter({ name, image, date, comment }: Commenter) {
  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer, { justifyContent: "space-between" }]}>
        {/* User avatar */}
        <View style={styles.rowContainer}>
          <Image style={styles.avatar} source={{ uri: image }} />
          {/* name and date */}
          <View>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
        </View>
        {/* More button */}
        <Feather name="more-horizontal" size={24} color="white" />
      </View>
      {/* Actual Comment */}
      <Text style={styles.comment}> 
        {comment}
      </Text>
      <Divider />
      {/* Interaction */}
      <View style={[styles.rowContainer, { gap: 20 }]}>
        <FontAwesome name="thumbs-up" size={24} color="#fff" />
        <FontAwesome name="thumbs-down" size={24} color="#fff" />
        <MaterialIcons name="comment" size={28} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#565656",
    borderRadius: 20,
    gap: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 45,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    color: "#fff",
    fontSize: 14,
  },
  comment: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  }
});
