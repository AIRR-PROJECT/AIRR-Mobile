import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import GradientText from "../GradientText";
import { LinearGradient } from "expo-linear-gradient";

export default function ReadmeComponent() {
  return (
    // Readme

    <View style={styles.readMeContainer}>
      <LinearGradient
        colors={["#9DE8EE", "#B9FF66"]}
        style={styles.background}
      />
      <ThemedText style={styles.title}>
        “YOUR README WILL BE DISPLAYED HERE!”
      </ThemedText>
      <TouchableOpacity style={styles.buttonContainer}>
        <ThemedText style={styles.buttonText}>Add Readme</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  // Styles
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  readMeContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    justifyContent: "center",
    height: 150,
    gap: 20,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    height: 50,
  },
  buttonContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 45,
    height: 50,
    justifyContent: "center",
    width: 150,
    borderWidth: 2,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
