import { MaterialTopTabs } from "@/components/MaterialTopTabs";
export default function FeedTabLayout() {
  return (
    <MaterialTopTabs
      style={{ flex: 1 }}
      screenOptions={{
        tabBarStyle: { height: "auto", backgroundColor: "#1E1E1E" }, // Adjust the height of the tab bar
        tabBarLabelStyle: { fontSize: 12 }, // Adjust the font size of tab labels
        tabBarIndicatorStyle: { height: 2 }, // Change the indicator thickness
      }}
    >
      <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />

      <MaterialTopTabs.Screen
        name="favorite-blogs"
        options={{ title: "Favorite Blogs" }}
      />
      <MaterialTopTabs.Screen name="history" options={{ title: "History" }} />
    </MaterialTopTabs>
  );
}
