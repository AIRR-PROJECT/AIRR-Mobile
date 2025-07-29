import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AnimatedPressable from "../AnimatedPressable";
import { Pressable } from "react-native";
import * as Linking from "expo-linking";
export default function CareerPathSuggestion({ isFromCareerPath = false }) {
  const router = useRouter();
  const webUrl = "https://airr-fe.vercel.app/career";
  const handleClick = () => {
    // handle click
    if (isFromCareerPath) {
      // Linking.openURL(webUrl);
      router.push({
        pathname: "/webview-screen",
        params: { url: webUrl },
      });
      return;
    }
    router.navigate("/(tabs)/career-path");
  };
  return (
    <TouchableOpacity onPress={handleClick} activeOpacity={0.8}>
      {/* gradient background */}
      <LinearGradient
        colors={["#66ff8c", "#9DE8EE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      />
      <View style={styles.container}>
        {/* Title and button */}
        <View style={styles.firstRow}>
          <ThemedText
            style={styles.textBorder}
            type="default"
            darkColor="#fff"
            lightColor="#fff"
          >
            Career Path
          </ThemedText>

          <MaterialCommunityIcons
            name="arrow-top-right-thin-circle-outline"
            size={60}
            color="#1E1E1E"
          />
        </View>
        {/* Image */}
        <View style={styles.secondRow}>
          <View style={[styles.verticalCurvedBar, { height: 60 }]} />
          <View style={[styles.verticalCurvedBar, { height: 90 }]} />
          <View style={[styles.verticalCurvedBar, { height: 120 }]} />
          <View style={[styles.verticalCurvedBar, { height: 150 }]} />
          <View style={[styles.verticalCurvedBar, { height: 180 }]} />
        </View>
        {/* Title */}
        <View style={styles.thirdRow}>
          <ThemedText
            style={styles.title}
            type="defaultSemiBold"
            darkColor="#fff"
            lightColor="#fff"
          >
            Get Career Path Suggestion
          </ThemedText>
        </View>
        {/* Text */}
        <View style={styles.fourthRow}>
          <Text style={styles.fourthRowText}>
            {!isFromCareerPath ? "Discover personalized career recommendations based on your skills and interests" : "This feature is currently only available on the web version. Click to view the career path workflow."}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 20,
    borderColor: "#1E1E1E",
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  firstRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
    width: "100%",
  },
  secondRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    columnGap: 20,
    padding: 10,
  },
  textBorder: {
    borderWidth: 2,
    borderColor: "#1E1E1E",
    borderRadius: 90,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    color: "#1E1E1E",
  },
  verticalCurvedBar: {
    width: 30,
    backgroundColor: "#1E1E1E",
    borderRadius: 90,
  },
  firstRowText: {
    flex: 1,
    fontSize: 16,
    color: "#1E1E1E",
    fontWeight: "bold",
  },
  title: {
    flexWrap: "wrap",
    width: "auto",
    fontSize: 20,
    color: "#1E1E1E",
    alignSelf: "auto",
  },
  thirdRow: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  fourthRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  fourthRowText: {
    flexWrap: "wrap",
    fontSize: 18,
    color: "#1E1E1E",
    textAlign: "justify",
    lineHeight: 24,
  },
});
