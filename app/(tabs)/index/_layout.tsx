
import { MaterialTopTabs } from "@/components/MaterialTopTabs";
export default function DashboardTabLayout() {
  return (
    <MaterialTopTabs style={{ flex: 1, }}>
      <MaterialTopTabs.Screen name="index" options={{ title: "Home",  }} />
      <MaterialTopTabs.Screen name="tags" options={{ title: "Tags" }} />
      <MaterialTopTabs.Screen name="leaderboards" options={{ title: "Leaderboards" }} />
      <MaterialTopTabs.Screen name="favorite-blogs" options={{ title: "Favorite Blogs" }} />
      <MaterialTopTabs.Screen name="history" options={{ title: "History" }} />
    </MaterialTopTabs>
  );
}
