
import { MaterialTopTabs } from "@/components/MaterialTopTabs";
export default function MyFeedTabLayout() {
  return (
    <MaterialTopTabs style={{ flex: 1, }}>
      <MaterialTopTabs.Screen name="index" options={{ title: "Home" }} />
      
    </MaterialTopTabs>
  );
}
