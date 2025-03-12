import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { useEffect, useState } from "react";
export default function MyFeedTabLayout() {
  const [swipeEnabled, setSwipeEnabled] = useState(true);
  return (
    <MaterialTopTabs
      style={{ flex: 1 }}
      screenOptions={{
        tabBarStyle: { height: "auto", backgroundColor: "#1E1E1E" }, // Adjust the height of the tab bar
        tabBarLabelStyle: { fontSize: 12 }, // Adjust the font size of tab labels
        tabBarIndicatorStyle: { height: 2 }, // Change the indicator thickness
        tabBarItemStyle: { width: "auto" }, // Adjust the width of the tab bar items
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Popular" }} />
      <MaterialTopTabs.Screen name="byDate" options={{ title: "By Date" }} />
      <MaterialTopTabs.Screen name="byLike" options={{ title: "By Like" }} />
      <MaterialTopTabs.Screen
        name="byComments"
        options={{ title: "By Comments" }}
      />
    </MaterialTopTabs>
  );
}
