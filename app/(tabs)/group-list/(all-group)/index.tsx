import GroupTab from "@/components/group/GroupTab";
import PopularGroupTab from "@/components/group/PopularGroupTab";
import { GroupField } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getGroupPopularFields, getPopularGroups } from "@/redux/slices/groupSlice";
import {  FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

let fields: GroupField[] = [
  { _id: "1", FieldName: "Popular" }, // Popular is the default selected tab with id "1"
];

export default function GroupPopularTab() {
  const dispatch = useAppDispatch()
  const { popularFields } = useAppSelector(state => state.group)

  const [selectedId, setSelectedId] = useState("1");

  useEffect(() => {
    dispatch(getGroupPopularFields())
  }, [])

  useEffect(() => {
    if (popularFields) {
      // console.log(popularFields)
      fields.push(...popularFields)
    }
  }, [popularFields])

  useEffect(() => {
    if (selectedId === "1") {
      dispatch(getPopularGroups())
    }
  }, [selectedId])

  console.log("selectedId", selectedId);
 
  return (
    <View style={styles.container}>
      {/* list tags */}
      <View style={styles.rowWrapper}>
        <FlatList
          data={fields}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tabItem,
                selectedId === item._id && styles.tabItemActive,
              ]}
              onPress={() => {
                setSelectedId(item._id);
              }}
            >
              <Text
                style={{
                  color: selectedId === item._id ? "#fff" : "#8A94AC",
                  fontWeight: "bold",
                }}
              >
                {item.FieldName}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <FontAwesome name="caret-right" size={30} color="white" />
      </View>
      {/* Content based on selected tabs */}
      {selectedId === "1" ? <PopularGroupTab /> : <GroupTab fieldID={selectedId}/>}
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
 
});
