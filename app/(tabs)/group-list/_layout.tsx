import { MaterialTopTabs } from "@/components/MaterialTopTabs";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
export default function GroupListTabLayout() {
  return (
    <MaterialTopTabs
      style={{ flex: 1 }}
      screenOptions={({ route }) => ({
        tabBarStyle: { height: "auto", backgroundColor: "#1E1E1E" }, // Adjust the height of the tab bar
        tabBarLabelStyle: { fontSize: 12 }, // Adjust the font size of tab labels
        tabBarIndicatorStyle: { height: 2 }, // Change the indicator thickness
        tabBarLabel: ({ focused }) => {
          console.log("route", route.name);
          let title = "";
          switch (route.name) {
            case "(all-group)":
              title = "All Group";
              break;
            case "(my-group)":
              title = "My Group";
              break;
            case "(joined-group)":
              title = "Joined Group";
              break;
            default:
              title = "Group";
              break;
          }

          return focused ? (
            <LinearGradient
              colors={["#B9FF66", "#9DE8EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 8,
                paddingVertical: 6,
                paddingHorizontal: 12,
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
        name="(all-group)"
        options={{ title: "All Group" }}
      />
      <MaterialTopTabs.Screen
        name="(my-group)"
        options={{ title: "My Group" }}
      />
      <MaterialTopTabs.Screen
        name="(joined-group)"
        options={{ title: "Joined Group" }}
      />
    </MaterialTopTabs>
  );
}
