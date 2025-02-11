import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type {
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);
import { ThemedText } from "@/components/ThemedText";
import Constants  from "expo-constants";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <MaterialTopTabs style={{ flex: 1,  }}>
      <MaterialTopTabs.Screen name="index" options={{ title: "TAB1" }} />
      <MaterialTopTabs.Screen name="explore" options={{ title: "TAB2" }} />
    </MaterialTopTabs>
  );
}
