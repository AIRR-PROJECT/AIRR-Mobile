import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function CareerPathSuggestion() {
  const router = useRouter();

  const handleClick = () => {
    // handle
    router.navigate('/(tabs)/career-path')

  }
  return (
    <Pressable onPress={handleClick}>
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
          <View style={styles.textBorder}>
            <ThemedText
              style={styles.firstRowText}
              type="default"
              darkColor="#fff"
              lightColor="#fff"
            >
              Career Path
            </ThemedText>
          </View>

          <MaterialCommunityIcons
            name="arrow-top-right-thin-circle-outline"
            size={60}
            color="#1E1E1E"
          />
        </View>
        {/* Image */}
        <View style={styles.secondRow}>
          <View style={[styles.verticalCurvedBar, {height: 60}]}/>
          <View style={[styles.verticalCurvedBar, {height: 90}]}/>
          <View style={[styles.verticalCurvedBar, {height: 120}]}/>
          <View style={[styles.verticalCurvedBar, {height: 150}]}/>
          <View style={[styles.verticalCurvedBar, {height: 180}]}/>
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
          <ThemedText
            style={styles.fourthRowText}
            type="default"
            darkColor="#fff"
            lightColor="#fff"
          >
            We will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    padding: 20,
    borderColor: "#1E1E1E",
    height: 450,
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%", 
    borderRadius: 40,
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
  },
  verticalCurvedBar: {
    width: 30,
    backgroundColor: "#1E1E1E",
    borderRadius: 90,
  },
  firstRowText:{
    flex: 1,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  title: {
    flexWrap: "wrap",
    width: "auto",
    fontSize: 20,
    color: "black",
    alignSelf: "auto",
  },
  thirdRow:{
   
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  fourthRow: {
    
    alignItems: "center",
    justifyContent: "center",
  },
  fourthRowText:{
    flexWrap: "wrap",
    fontSize: 16,
    color: "black",
    textAlign: "justify",
  },
});
