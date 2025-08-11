import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { GroupRole } from "@/enums/group.enum";
import { useAppSelector } from "@/redux/hook";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
export default function ContentsPageTabLayout() {
  const { groupID, memberID, requestID } = useLocalSearchParams<{
    groupID: string;
    memberID: string;
    requestID: string;
  }>();
  const { userCurrentGroupRole } = useAppSelector((state) => state.user);
  const { loading } = useAppSelector((state) => state.loading);
  const canAccessReportsTab =
    userCurrentGroupRole === GroupRole.Admin ||
    userCurrentGroupRole === GroupRole.Owner;

  useEffect(() => {
    console.log(loading)
  }, [loading])
  
  return (
    <MaterialTopTabs
      style={{ flex: 1 }}
      screenOptions={({ route }) => ({
        tabBarStyle: { height: "auto", backgroundColor: "#1E1E1E", }, // Adjust the height of the tab bar
        tabBarLabelStyle: { fontSize: 12 }, // Adjust the font size of tab labels
        tabBarIndicatorStyle: { display: "none" }, // Change the indicator thickness
        tabBarItemStyle: { width: "auto" }, // Adjust the width of the tab bar items
        tabBarLabel: ({ focused }) => {
          const title =
            route.name === "blogs"
              ? "Blogs"
              : route.name === "tags"
              ? "Tags"
              : route.name === "members"
              ? "Members"
              : "Reports";
          return focused ? (
            <LinearGradient
              colors={["#B9FF66", "#9DE8EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 8,
                paddingVertical: 6,
                paddingHorizontal: 6,
                margin: 4,
              }}
            >
              <Text style={{ fontSize: 12, color: "#000", fontWeight: "bold" }}>
                {title}
              </Text>
            </LinearGradient>
          ) : (
            <View style={{ padding: 6, margin: 4 }}>
              <Text style={{ fontSize: 12, color: "#fff", fontWeight: "bold" }}>
                {title}
              </Text>
            </View>
          );
        },
        swipeEnabled: false,
      })}
    >
      <MaterialTopTabs.Screen
        name="blogs"
        options={{ title: "Blogs" }}
        initialParams={{
          groupID,
          requestID,
        }}
      />
      <MaterialTopTabs.Screen
        name="tags"
        options={{ title: "Tags" }}
        initialParams={{
          groupID,
          requestID,
        }}
      />
      <MaterialTopTabs.Screen
        name="members"
        options={{ title: "Members" }}
        initialParams={{
          groupID,
          memberID,
        }}
      />
      <MaterialTopTabs.Screen
        name="reports"
        options={{ title: "Reports" }}
        initialParams={{
          groupID,
          requestID,
        }}
        redirect={!canAccessReportsTab}
      />
    </MaterialTopTabs>
  );
}
