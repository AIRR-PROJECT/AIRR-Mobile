import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function SearchTab() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Search button pressed")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#B9FF66",
    justifyContent: "center",
    alignItems: "center",
  },
});
