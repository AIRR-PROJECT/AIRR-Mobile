import UploadProfileComponent from "@/components/profile/UploadProfileComponent";
import { ThemedText } from "@/components/ThemedText";
import { View, Text, StyleSheet, ScrollView } from "react-native";
const sample_avatar = require("@/assets/images/sample-avatar.png");

export default function EditProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <ThemedText style={styles.title}>Profile Photo</ThemedText>
      <ThemedText style={styles.description}>
        Show off your vibe! Upload a profile pic to make your account totally
        you. let the world see your style!
      </ThemedText>
      {/* Image */}
      <UploadProfileComponent imgSource={sample_avatar}/>
      {/* Persoanl Info */}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    color: "#A2B5A5",
    marginTop: 8,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  
});
