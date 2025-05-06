import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { Image } from "expo-image";

// later remember to add the props
export default function TagsApprovalsPage() {
  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={30} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder={"Search Tags"}
            placeholderTextColor={"#8A94AC"}
          />
        </View>
      </View>
    </View>
  );
}
const colors = {
  moderator: "#FFBA66",
  admin: "#B9FF66",
  member: "#66DBFF",
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
  },
  textInput: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
    fontSize: 20,
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  role: {
    fontSize: 14,
    color: "#8A94AC",
  },
  roleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
