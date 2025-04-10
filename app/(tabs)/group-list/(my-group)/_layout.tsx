import { MaterialTopTabs } from "@/components/MaterialTopTabs";
export default function MyFeedTabLayout() {
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
      <MaterialTopTabs.Screen name="popular" options={{ title: "Popular" }} />
      <MaterialTopTabs.Screen name="web" options={{ title: "Web" }} />
      <MaterialTopTabs.Screen name="devops" options={{ title: "Devops" }} />
    </MaterialTopTabs>
  );
}
