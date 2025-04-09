import PopularGroupScreen from "@/components/group/PopularGroupScreen";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
const mockTags = [
  { id: "1", name: "Popular" }, // Popular is the default selected tab with id "1"
  { id: "2", name: "Web" },
  { id: "3", name: "Devops" },
  { id: "4", name: "AI" },
  { id: "5", name: "Mobile" },
  { id: "6", name: "Blockchain" },
  { id: "7", name: "Security" },
  { id: "8", name: "Cloud" },
  { id: "9", name: "Data Science" },
  { id: "10", name: "Game Development" },
  { id: "11", name: "VR/AR" },
  { id: "12", name: "IoT" },
  { id: "13", name: "Quantum Computing" },
  { id: "14", name: "Robotics" },
];
export default function GroupPopularTab() {
  const [selectedId, setSelectedId] = useState("1");
  return (
    <View style={styles.container}>
      {/* list tags */}
      <View style={styles.rowWrapper}>
        <FlatList
          data={mockTags}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabItem,
                selectedId === item.id && styles.tabItemActive,
              ]}
              onPress={() => {
                setSelectedId(item.id);
              }}
            >
              <Text
                style={{
                  color: selectedId === item.id ? "#fff" : "#8A94AC",
                  fontWeight: "bold",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <FontAwesome name="caret-right" size={30} color="white" />
      </View>
      {/* Content based on selected tabs */}
      {selectedId === "1" ? <PopularGroupScreen /> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
    
  },
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabList: {
    paddingHorizontal: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  tabItemActive: {
    backgroundColor: "#363B47",
  },
  contentContainer: {
    padding: 20,
  },
  content: {
    color: "#fff",
    fontSize: 18,
  },
});
