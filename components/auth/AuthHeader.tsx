import { ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";

const icon_air_tech = require("@/assets/images/logo/logo_icon-air-tech.svg");

import AuthButtonGradient from "./AuthButtonGradient";
import { useRouter } from "expo-router";
type AuthHeaderProps = {
  // Props type definition
  signUp?: boolean;
};
export default function AuthHeader({ signUp = true }: AuthHeaderProps) {
  const router = useRouter();
  const handlePress = () => {
    if (signUp) {
      router.push("/auth/sign-up-first-page");
    } else {
      router.push("/auth/login");
    }
  };
  const label = signUp ? "Sign Up" : "Login";
  return (
    <ThemedView
      style={styles.headerContainer}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <Image source={icon_air_tech} style={styles.image} contentFit="contain" />
      <AuthButtonGradient
        style={styles.buttonContainer}
        buttonStyle={styles.button}
        labelStyle={styles.buttonLabel}
        label={label}
        onPress={handlePress}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Arrange items in a row
    alignItems: "center", // Vertically center items
    justifyContent: "space-evenly", // Distribute items evenly
    marginRight: "15%",
    marginTop: 20,
    padding: 10,
  },
  image: {
    width: 300,
    height: 30,
  },
  buttonContainer: {
    width: 100,
    height: 46,
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
  },
  buttonLabel: {
    color: "#000",
    fontSize: 16,
  },
});
