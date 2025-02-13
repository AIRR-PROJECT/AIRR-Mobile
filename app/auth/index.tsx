import { Link, Redirect, Stack, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AuthButton from "@/components/auth/AuthButton";

import ImageViewer from "@/components/auth/imageViewer";
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import { Pressable } from "react-native";
import { Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const logo = require("@/assets/images/auth/Logo.svg");
export default function AuthScreen() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/auth/login");
  };
  const handleSignUp = () => {
    router.push("/auth/sign-up");
  };
  const handleGuest = () => {
    router.push("/(tabs)");
  }
  return (
    <ThemedView
      style={styles.container}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <ThemedView
        style={styles.imageContainer}
        darkColor="#1E1E1E"
        lightColor="#1E1E1E"
      >
        <LinearGradient
          colors={["rgba(196, 255, 127, 0.1)", "rgba(196, 255, 127, 0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 80,
          }}
        />
        <LinearGradient
          colors={["rgba(196, 255, 127, 0.1)", "rgba(196, 255, 127, 0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 80,
          }}
        />
        <LinearGradient
          colors={["rgba(196, 255, 127, 0.1)", "rgba(196, 255, 127, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.8, y: 0.8 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 80,
          }}
        />
        <LinearGradient
          colors={["rgba(196, 255, 127, 0.1)", "rgba(196, 255, 127, 0)"]}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 80,
          }}
        />
        <ImageViewer imgSource={logo} />
      </ThemedView>
      <ThemedView
        style={styles.footerContainer}
        darkColor="#1E1E1E"
        lightColor="#1E1E1E"
      >
        <AuthButtonGradient label="Log In" onPress={handleLogin}/>
        <AuthButton label="Sign Up" onPress={handleSignUp}/>
        <Pressable onPress={handleGuest}>
          <ThemedText type="link" style={{ color: "white" }}>
            Continue as guest
          </ThemedText>

        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
  },
  imageContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  footerContainer: {
    flex: 1 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
