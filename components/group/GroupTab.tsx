import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import GroupCardComponent from "@/components/group/GroupCardComponent";
import { useAppDispatch } from "@/redux/hook";
import { useEffect, useState } from "react";
import { getCreatedGroups, getGroupsByFieldId, getJoinedFields, getJoinedGroupsByFieldId } from "@/redux/slices/groupSlice";
import { Group } from "@/interfaces/groupInterface";
import FeedBlogPreviewSkeleton from "../tabs/feed/FeedBlogPreviewSkeleton";
import Animated from "react-native-reanimated";

export default function GroupTab(props: {type: string, fieldID?: string}) {
  const dispatch = useAppDispatch()

  const [groups, setGroups] = useState<Group[]>()
  const [isFetching, setIsFetching] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);

    setIsFetching(true)
    switch (props.type) {
      case "all":
        if (props.fieldID) {
          dispatch(getGroupsByFieldId(props.fieldID)).then((val) => {
            setGroups(val.payload as Group[])

            setIsFetching(false)

            setRefreshing(false)
          })
        }
        break
      case "my":
        dispatch(getCreatedGroups()).then((res) => {
          setGroups(res.payload as Group[])

          setIsFetching(false)

          setRefreshing(false)
        })
        break
      case "joined":
        if (props.fieldID) {
          dispatch(getJoinedGroupsByFieldId(props.fieldID)).then((val) => {
            setGroups(val.payload as Group[])

            setIsFetching(false)

            setRefreshing(false)
          })
        }
        break
      default:
        setIsFetching(false)

        setRefreshing(false)
        break
    }
  }

  useEffect(() => {
    setIsFetching(true)
    switch (props.type) {
      case "all":
        if (props.fieldID) {
          dispatch(getGroupsByFieldId(props.fieldID)).then((val) => {
            setGroups(val.payload as Group[])

            setIsFetching(false)
          })
        }
        break
      case "my":
        dispatch(getCreatedGroups()).then((res) => {
          setGroups(res.payload as Group[])

          setIsFetching(false)
        })
        break
      case "joined":
        if (props.fieldID) {
          dispatch(getJoinedGroupsByFieldId(props.fieldID)).then((val) => {
            setGroups(val.payload as Group[])

            setIsFetching(false)
          })
        }
        break
      default:
        setIsFetching(false)
        break
    }
  }, [props.fieldID])

  return (
    isFetching ? 
    <FeedBlogPreviewSkeleton/> :
    <View style={styles.container}>
      <Animated.FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={groups}
        renderItem={({ item }) => (
          <GroupCardComponent
            image={item.CoverURL}
            name={item.Name}
            id={item._id}
            members={item.NumberOfMembers}
            isJoined={props.type != "all"}
          />
        )}
        keyExtractor={(item, index) => item._id + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Add space between items
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    flex: 1,
  },
});
