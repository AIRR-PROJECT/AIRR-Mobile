import GroupTab from "@/components/group/GroupTab";
import PopularGroupTab from "@/components/group/PopularGroupTab";
import { GroupField } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getFieldDetail,
  getGroupPopularFields,
  getJoinedFields,
  getPopularGroups,
} from "@/redux/slices/groupSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

// Change the impletation to group that user joined
export default function JoinedGroupTab() {
  const dispatch = useAppDispatch();

  const [selectedId, setSelectedId] = useState("1");
  const [joinedFields, setJoinedFields] = useState<GroupField[]>([]);
  const refFields = useRef<FlatList>(null);
  const currentOffset = useRef(0);

  const handleArrowPress = () => {
    refFields?.current?.scrollToOffset({
      offset: currentOffset.current + 300, // Adjust as needed
      animated: true,
    });
  };

  // Track scroll position without causing re-render
  const handleScroll = ({ nativeEvent }: any) => {
    const offsetX = nativeEvent.contentOffset.x;
    if (Math.abs(currentOffset.current - offsetX) > 10) {
      currentOffset.current = offsetX;
    }
  };

  useEffect(() => {
    dispatch(getJoinedFields()).then((res) => {
      const data = res.payload as GroupField[]

      setJoinedFields(data)
      if (data.length != 0) setSelectedId(data[0]._id)
    })
  }, []);

  useEffect(() => {
    if (selectedId) {

    }
  }, [selectedId]);

  return (
    <View style={styles.container}>
      {/* list tags */}
      <View style={styles.rowWrapper}>
        <FlatList
          data={joinedFields}
          ref={refFields}
          onScroll={handleScroll}
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
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity onPress={handleArrowPress} activeOpacity={0.8}>
          <FontAwesome name="caret-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* Content based on selected tabs */}
     
      {selectedId != "1" && <GroupTab fieldID={selectedId} type="joined"/>}
     
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
