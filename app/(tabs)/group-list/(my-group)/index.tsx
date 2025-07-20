import GroupCardComponent from "@/components/group/GroupCardComponent";
import GroupTab from "@/components/group/GroupTab";
import PopularGroupTab from "@/components/group/PopularGroupTab";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import { Group, GroupField } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getCreatedGroups,
  getGroupPopularFields,
  getPopularGroups,
} from "@/redux/slices/groupSlice";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
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
export default function MyGroupTab() {
  const dispatch = useAppDispatch();
  const route = useRouter();
  // const { popularFields } = useAppSelector((state) => state.group);
  const { groupIDToRemove, newGroupID } = useLocalSearchParams<{ groupIDToRemove: string, newGroupID: string }>()

  const refFields = useRef<FlatList>(null);
  const currentOffset = useRef(0);
  
  const [selectedId, setSelectedId] = useState("1");
  const [fields, setFields] = useState<GroupField[]>([])
  const [groups, setGroups] = useState(new Map<string, Group[]>())
  const [isFetching, setIsFetching] = useState(false)
  const [isNewGroupCreated, setIsNewGroupCreated] = useState<boolean>(false)

  const handleCreateButtonPress = () => {
    // Handle create group button press
    console.log("Create Group button pressed");
    route.push("/group/create-group");
  };

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
    setIsFetching(true)
    dispatch(getCreatedGroups()).then((res) => {
      const data = res.payload as Group[]

      let fields: GroupField[] = []
      let groups = new Map<string, Group[]>()
      data.forEach((g) => {
        // Add to fields
        if (fields.find(f => f._id == g.FieldID) === undefined) {
          fields.push({
            _id: g.FieldID,
            FieldName: g.FieldName
          })
        }

        // Add to groups
        if (groups.has(g.FieldID)) {
          let temp = groups.get(g.FieldID)
          temp!.push(g)
          groups.set(g.FieldID, temp!)
        }
        else {
          groups.set(g.FieldID, [g])
        }
      })
      setFields(fields)
      setGroups(groups)
      setSelectedId(fields[0]?._id)

      setIsFetching(false)
    })
  }, []);

  useEffect(() => {
    setIsNewGroupCreated(newGroupID !== undefined && newGroupID !== "")
    console.log(`temp: ${newGroupID}`)
    if (newGroupID !== undefined && newGroupID.length != 0) {
      route.push(`/group?groupId=${newGroupID}`)
    }
  }, [newGroupID])
  useEffect(() => {
    if (groupIDToRemove || isNewGroupCreated) {
      if (isNewGroupCreated) setIsNewGroupCreated(false)
      setIsFetching(true)
      dispatch(getCreatedGroups()).then((res) => {
        const data = res.payload as Group[]
  
        let fields: GroupField[] = []
        let groups = new Map<string, Group[]>()
        data.forEach((g) => {
          // Add to fields
          if (fields.find(f => f._id == g.FieldID) === undefined) {
            fields.push({
              _id: g.FieldID,
              FieldName: g.FieldName
            })
          }
  
          // Add to groups
          if (groups.has(g.FieldID)) {
            let temp = groups.get(g.FieldID)
            temp!.push(g)
            groups.set(g.FieldID, temp!)
          }
          else {
            groups.set(g.FieldID, [g])
          }
        })
        setFields(fields)
        setGroups(groups)
        setSelectedId(fields[0]?._id)

        setIsFetching(false)
      })

      route.setParams({
        groupIDToRemove: undefined
      })
    }
  }, [groupIDToRemove, isNewGroupCreated])
  
  return (
    isFetching ? 
    <FeedBlogPreviewSkeleton/> :
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

      <View style={styles.container}>
        {/* list tags */}
        <View style={styles.rowWrapper}>
          <FlatList
            data={fields}
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

        <View style={[styles.container, {paddingHorizontal: 20}]}>
          <FlatList
            data={groups.get(selectedId)}
            renderItem={({ item }) => (
              <GroupCardComponent
                image={item.CoverURL}
                name={item.Name}
                id={item._id}
                members={item.NumberOfMembers}
                isJoined={true}
              />
            )}
            keyExtractor={(item, index) => item._id + index}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Add space between items
          />
        </View>
      </View>
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
