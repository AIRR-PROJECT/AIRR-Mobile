// Import necessary modules and components from various libraries
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  // Get the current color scheme (dark or light)
  const colorScheme = useColorScheme();
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
      <Stack >
        {/* Define the screens for the navigation stack */}
        <Stack.Screen 
          name="index"
          options={{ headerShown: false }} 
        />
        <Stack.Screen name='login' options={{ headerShown: false }}/>
        <Stack.Screen name='forgot-password' options={{ headerShown: false }}/>
        <Stack.Screen name='verify-account-otp' options={{ headerShown: false }}/>
        <Stack.Screen name='verify-password-otp' options={{ headerShown: false }}/>
        <Stack.Screen name='set-password' options={{ headerShown: false }}/>
        <Stack.Screen name='sign-up-first-page' options={{ headerShown: false }}/>
        <Stack.Screen name='sign-up-second-page' options={{ headerShown: false }}/>
      </Stack>

  
      <StatusBar style="light" />
    </ThemeProvider>
    
  );
}