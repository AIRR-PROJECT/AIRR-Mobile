import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Platform, Text, Modal } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import LeftHeader from "@/components/tabs/LeftHeader";
import RightHeader from "@/components/tabs/RightHeader";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/redux/api/queryClient";
import { getUserInfo, loadToken, logout } from "@/redux/slices/authSlice";
import { injectStoreToAxiosInterceptor } from "@/redux/api/axiosInstance";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export function RootBackgroundTask() {
  const dispatch = useAppDispatch()

  const { isLoggedIn, isAccountVerified } = useAppSelector(state => state.auth)
  const { userAccessToken, userRefreshToken, user } = useAppSelector(state => state.user)

  // Init
  useEffect(() => {
    if (isLoggedIn && isAccountVerified && !userAccessToken && !userAccessToken && !user) {
      dispatch(logout())
    }

    dispatch(loadToken()).then(() => {
      // console.log(userAccessToken)
      // console.log(userRefreshToken)
      // if (userAccessToken != "" && userRefreshToken != "") {
      //   dispatch(getUserInfo())
      // }
      // else {
      //   dispatch(logout())
      // }
        dispatch(getUserInfo())
    })
  }, [])

  useEffect(() => {
  }, [isLoggedIn, isAccountVerified])

  useEffect(() => {
    // console.log(user)
    if (user != undefined) {
      router.push("/(tabs)")
    }
  }, [user])

  return <></>
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const userLoggedIn = false; // Replace with actual user authentication check
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const streak = 1; // Replace with actual streak count
  
  injectStoreToAxiosInterceptor(store)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RootBackgroundTask></RootBackgroundTask>
        {/* // change to dark later */}
        <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
          {/* <StatusBar style="auto" /> */}
          {/* <SafeAreaView style={styles.safeArea}> */}
          <View style={styles.container}>
            <Stack>
              <Stack.Screen
                name="index"
                redirect={userLoggedIn}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: true,
                  headerStyle:{
                    backgroundColor: "#1E1E1E",
                  },
                  headerLeft: () => <LeftHeader/>,
                  headerTitle: "",
                  headerRight: () => <RightHeader streak={streak}/>,
                }}
              />
              <Stack.Screen name="profile" 
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="blog" 
                options={{
                  headerShown: true,
                  headerStyle:{
                    backgroundColor: "#1E1E1E",
                  },
                  headerLeft: () => <LeftHeader/>,
                  headerTitle: "",
                  headerRight: () => <RightHeader streak={streak}/>,
                }}
              />
            </Stack>
            {userLoggedIn ? (
              <Redirect href="/(tabs)" />
            ) : (
              <Redirect href="/auth" />
            )}
          </View>
          {/* </SafeAreaView> */}
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Change as needed
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 0 : 0, // Prevent status bar overlap on Android
  },
});
