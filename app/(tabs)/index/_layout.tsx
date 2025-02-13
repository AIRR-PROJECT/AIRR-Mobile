import { MaterialTopTabs } from "@/components/MaterialTopTabs";
export default function DashboardTabLayout() {
  return (
    <MaterialTopTabs
      style={{ flex: 1 }}
      screenOptions={{
        tabBarStyle: { height: 'auto' }, // Adjust the height of the tab bar
        tabBarLabelStyle: { fontSize: 14 }, // Adjust the font size of tab labels
        tabBarIndicatorStyle: { height: 2 }, // Change the indicator thickness
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />
      <MaterialTopTabs.Screen name="tags" options={{ title: "Tags" }} />
      <MaterialTopTabs.Screen
        name="leaderboards"
        options={{ title: "Leaderboards" }}
      />
      <MaterialTopTabs.Screen
        name="favorite-blogs"
        options={{ title: "Favorite Blogs" }}
      />
      <MaterialTopTabs.Screen name="history" options={{ title: "History" }} />
    </MaterialTopTabs>
  );
}
