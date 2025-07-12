import GroupTab from "@/components/group/GroupTab";
import PopularGroupTab from "@/components/group/PopularGroupTab";
import { GroupField } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getGroupPopularFields,
  getPopularGroups,
} from "@/redux/slices/groupSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

let fields: GroupField[] = [];
// Change the impletation to group that user joined
export default function MyGroupTab() {
  const dispatch = useAppDispatch();
  // const { popularFields } = useAppSelector((state) => state.group);

  const [selectedId, setSelectedId] = useState("1");

  // useEffect(() => {
  //   dispatch(getGroupPopularFields());
  // }, []);

  // useEffect(() => {
  //   if (popularFields) {
  //     // console.log(popularFields)
  //     fields.push(...popularFields);
  //   }
  // }, [popularFields]);

  useEffect(() => {
  }, [selectedId]);
  const route = useRouter();
  const handleCreateButtonPress = () => {
    // Handle create group button press
    console.log("Create Group button pressed");
    route.push("/group/create-group");
  };
  return (
    <View style={styles.container}>
      {/* Create Group Button */}
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={handleCreateButtonPress}
        activeOpacity={0.7}
      >
        <FontAwesome name="plus" size={24} color="#000" />
        <Text style={styles.createGroupButtonText}>Create Group</Text>
      </TouchableOpacity>
      <GroupTab type="my" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
    flex: 1,
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
  createGroupButton: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginHorizontal: 20,
  },
  createGroupButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
