import { EffectCallback, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AuthButton from "@/components/auth/AuthButton";

import ImageViewer from "@/components/ImageViewer";
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import { Dimensions, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout, loadToken, getUserInfo } from "@/redux/slices/authSlice";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const logo = require("@/assets/images/auth/Logo.svg");

export default function AuthScreen() {
  const router = useRouter();
  // const { isLoggedIn, isAccountVerified, userAccessToken, userRefreshToken } = useAppSelector(state => state.auth)

  // // Init
  // useMountEffect(() => {
  //   if (isLoggedIn && isAccountVerified && userAccessToken.length > 0 && userRefreshToken.length > 0) {
  //     router.replace("/(tabs)");
  //   }
  // })
  const dispatch = useAppDispatch();

  const { isLoggedIn, isAccountVerified } = useAppSelector(
    (state) => state.auth
  );
  const { userAccessToken, userRefreshToken, user } = useAppSelector(
    (state) => state.user
  );

  // Init
  useEffect(() => {
    if (
      isLoggedIn &&
      isAccountVerified &&
      !userAccessToken &&
      !userAccessToken &&
      !user
    ) {
      dispatch(logout());
    }

    dispatch(loadToken()).then(() => {
      dispatch(getUserInfo());
    });
  }, []);

  useEffect(() => {
    // console.log(user)
    if (user != undefined) {
      router.replace("/(tabs)/dashboard");
    }
    console.log("Tag changed test");
  }, [user]);

  const handleLogin = () => {
    router.push("/auth/login");
  };
  const handleSignUp = () => {
    router.push("/auth/sign-up-second-page");
  };
  const handleGuest = () => {
    router.push("/(tabs)/dashboard");
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    >
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={logo} />
      </View>
      <ThemedView
        style={styles.footerContainer}
        darkColor="#1E1E1E"
        lightColor="#1E1E1E"
      >
        <AuthButtonGradient label="Log In" onPress={handleLogin} />
        <AuthButton label="Sign Up" onPress={handleSignUp} />
        {/* <TouchableOpacity onPress={handleGuest}>
          <ThemedText type="link" style={{ color: "white" }}>
            Continue as guest
          </ThemedText>
        </TouchableOpacity> */}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
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
