// Import necessary modules and components from various libraries
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Get the current color scheme (dark or light)
  const colorScheme = useColorScheme();
  const userLoggedIn = false; // Replace with actual user authentication check
  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // If fonts are not loaded yet, return null to render nothing
  if (!loaded) {
    return null;
  }

  
  // Render the app layout with theme provider and navigation stack
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Define the screens for the navigation stack */}
        <Stack.Screen 
          name="index"
          redirect={userLoggedIn}
          options={{ headerShown: false }} 
        />
        
        {/* Auth group */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        
        {/* Authenticated group */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {userLoggedIn ? (
        <Redirect href="/(tabs)" />
      ) : (
        <Redirect href="/(auth)" />
      )}
      {/* Set the status bar style */}
      <StatusBar style="light" />
    </ThemeProvider>
  );
}