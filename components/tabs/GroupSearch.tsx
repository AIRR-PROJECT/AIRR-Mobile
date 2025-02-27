import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import ButtonGradient from "../ButtonGradient";
import { FontAwesome6 } from "@expo/vector-icons";

export default function GroupSearch() {
  return (
    <View style={styles.container}>
      <FontAwesome6 name="magnifying-glass" size={48} color="white"/>
      <ThemedText
        style={styles.title}
        type="default"
        darkColor="#fff"
        lightColor="#fff"
      >
        Find a new group to explore
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 90,
    borderWidth: 2,
    padding: 20,
    columnGap: 10,
    borderColor: "white",
  },
  title: {
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    fontSize: 16,
  },
});
