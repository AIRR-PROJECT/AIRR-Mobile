import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OwnerLeaveGroup() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Are You Sure You Want To Leave the Group?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B9FF66",
    marginBottom: 20,
  }
});
