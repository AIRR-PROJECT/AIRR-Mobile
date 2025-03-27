import { View, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";

type GroupJoinProps = {
  url1?: string;
  url2?: string;
  url3?: string;
};
const defaultUri = "https://picsum.photos/seed/picsum/200";
export default function GroupJoin({ url1 = defaultUri, url2 = defaultUri, url3 = defaultUri}: GroupJoinProps) {
  const defaultUri = "https://picsum.photos/seed/picsum/200";
  return (
    <View style={styles.container}>
      {/* image */}
      <View style={styles.imageContainer}>
        <Image
          source={url1 || defaultUri}
          style={[styles.image]}
        />
        <Image
          source={url2 || defaultUri}
          style={[styles.image, styles.middleImage]}
        />
        <Image
          source={url3 || defaultUri}
          style={[styles.image, styles.lastImage]}
        />
      </View>
      {/* Dot symbols */}
      <View style={styles.dotContainer}>
        <FontAwesome name="circle" size={8} color="black" />
        <FontAwesome name="circle" size={16} color="black" />
        <FontAwesome name="circle" size={24} color="black" />
      </View>
      {/* Join Group button */}
      <View style={styles.buttonContainer}>
        <ThemedText
          style={styles.title}
          type="default"
          darkColor="#fff"
          lightColor="#fff"
        >
          Join Group
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 90,
    padding: 5,
    columnGap: 5,
    height: 100,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 5,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 90,
    padding: 20,
    backgroundColor: "#1E1E1E",
    height: 70,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 90,
  },
  middleImage: {
    marginLeft: -40, // Overlap the second image over the first
  },
  lastImage: {
    marginLeft: -40, // Overlap the third image over the second
  },
  title: {
    color: "white",

  },
});
