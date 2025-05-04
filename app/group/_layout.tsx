// Import necessary modules and components from various libraries
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { goBack } from "expo-router/build/global-state/routing";
import { createGroup, resetCreateGroupProperties } from "@/redux/slices/groupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function GroupLayout() {
  const dispatch = useAppDispatch()
  const { createGroupCoverImage, createGroupDescription, createGroupField, createGroupName, createGroupRules, createGroupTags } = useAppSelector(state => state.group)

  // Get the current color scheme (dark or light)
  const colorScheme = useColorScheme();
  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
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
  const route = useRouter();
  const handleGoBack = () => {
    route.back();
  };
  const handleCreateGroup = () => {
    const formData = new FormData()
    formData.append("coverImage", {
      uri: createGroupCoverImage.uri,
      name: createGroupCoverImage.fileName,
      type: createGroupCoverImage.mimeType
    })
    formData.append("name", createGroupName)
    formData.append("tags", JSON.stringify(createGroupTags))
    formData.append("groupField", JSON.stringify(createGroupField))
    formData.append("description", createGroupDescription)
    formData.append("groupRules", JSON.stringify(createGroupRules))

    dispatch(createGroup(formData)).then((res) => {
      if (res.payload) {
        // Reset
        dispatch(resetCreateGroupProperties())
        
        router.replace("/group")
      }
    })
  }
  // Render the app layout with theme provider and navigation stack
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#fff",
        }}
      >
        {/* Define the screens for the navigation stack */}
        <Stack.Screen name="index" options={{ headerTitle: "" }} />
        <Stack.Screen
          name="create-group"
          options={{
            headerTitle: "",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.7}
                onPress={handleGoBack}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.7}
                onPress={handleCreateGroup}
              >
                <Text style={styles.createButtonText}>+ New Group</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="group-member-list"
          options={{
            headerTitle: "Group Members",
          }}
        />
        <Stack.Screen
          name="create-new-group-tag"
          options={{
            headerTitle: "Create New Group Tag",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  cancelButton: {
    padding: 10,
    backgroundColor: "#1B1F26",
    borderRadius: 999,
  },
  cancelButtonText: {
    color: "#DCDCDC",
    fontSize: 16,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  createButton: {
    padding: 10,
    backgroundColor: "#B9FF66",
    borderRadius: 999,
  },
  createButtonText: {
    color: "#000",
    fontSize: 16,
    paddingHorizontal: 15,
    fontWeight: "bold",
  },
});
