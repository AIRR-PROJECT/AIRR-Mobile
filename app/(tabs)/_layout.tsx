import { Tabs, withLayoutContext } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tab } from "@rneui/base";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-feed"
        options={{
          title: "My Feed",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="newspaper" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="career-path"
        options={{
          title: "Career Path",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="line-graph" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: "Group",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="account-group" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
