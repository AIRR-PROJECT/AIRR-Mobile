import { Tabs,  } from "expo-router";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";

const MiddleButton = () => (
  <Pressable 
    style={{
      flex: 1,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      width: 60,
      height: 60,
      justifyContent: 'center',
      // alignItems: 'center',
      // elevation: 4,
      shadowColor: '#1E1E1E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    }}
  >
    <AntDesign name="plussquare" size={40} color="#B9FF66" style={{alignSelf: "center"}}/>
  </Pressable>
);
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const handleMiddleButtonPress = () => {
    console.log("Middle Button Press");
  };
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
       {/* Middle Button with Function */}
       <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarButton: (props) => <MiddleButton {...props} />,
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
