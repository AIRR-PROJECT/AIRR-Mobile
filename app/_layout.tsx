import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Platform, Text, Modal } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image } from "expo-image";
import LeftHeader from "@/components/tabs/LeftHeader";
import RightHeader from "@/components/tabs/RightHeader";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const userLoggedIn = false; // Replace with actual user authentication check
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });
  const streak = 1; // Replace with actual streak count
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // change to dark later
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
              headerTitle: "Profile",
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
