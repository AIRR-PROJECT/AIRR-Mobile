import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "../ThemedText";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

const aiTrendsImage = require("../../assets/images/tabs/index/ai_trends.jpg");
export default function AITrendingRecommendation() {
  const router = useRouter();

  const handleClick = () => {
    // handle click
  };
  return (
    <Pressable style={styles.container} onPress={handleClick}>
      {/* Title  */}
      <ThemedText
        style={styles.firstRowText}
        type="defaultSemiBold"
        darkColor="#fff"
        lightColor="#fff"
      >
        AI Trending Tech{"\n"}Recommendation
      </ThemedText>
      {/* Text */}
      <ThemedText
        style={styles.secondRowText}
        type="default"
        darkColor="#fff"
        lightColor="#fff"
      >
        We will discuss your business goals and objectives, target audience, and
        current marketing efforts.
      </ThemedText>
      {/* Image */}
      <Image source={aiTrendsImage} style={styles.image}/>
      {/* Button */}
      <View style={styles.secondRow}>
        <ThemedText
          style={styles.textLastRow}
          type="default"
          darkColor="#fff"
          lightColor="#fff"
        >
          Explore more
          </ThemedText>
          <MaterialCommunityIcons
            name="arrow-top-right-thin-circle-outline"
            size={50}
            color="#fff"
          />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#17191E",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    padding: 20,
    borderColor: "#48576E",
    height: 450,
    rowGap: 10,
  },

  secondRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#48576E",
    alignSelf: "flex-end",
  },
  textLastRow: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },

  firstRowText: {
    padding: 10,
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  secondRowText: {
    flexWrap: "wrap",
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 25,
    margin: 10,
  }
});
