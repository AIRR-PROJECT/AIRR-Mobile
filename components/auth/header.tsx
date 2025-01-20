import { ThemedView } from "../ThemedView";
import { StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";

const icon_air_tech = require("@/assets/images/logo/logo_icon-air-tech.svg");
import { ThemedText } from "../ThemedText";

export default function AuthHeader() {
  return (
    <ThemedView
      style={styles.headerContainer}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <Image source={icon_air_tech} style={styles.image} contentFit="contain" />
      <ThemedView style={styles.buttonContainer}>
        <Pressable style={styles.button}>
          <ThemedText style={styles.buttonLabel}>Sign Up</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Vertically center items
    justifyContent: "space-between", // Distribute items evenly
    marginRight: "15%",
    padding: 20,
  },
  image: {
    width: 300,
    height: 30,
  },
  buttonContainer: {
    width: 100,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "transparent",
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#0070f3",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
