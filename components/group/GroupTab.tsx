import { FlatList, StyleSheet, Text, View } from "react-native";
import GroupCardComponent from "@/components/group/GroupCardComponent";
import { useAppDispatch } from "@/redux/hook";
import { useEffect, useState } from "react";
import { getCreatedGroups, getGroupsByFieldId } from "@/redux/slices/groupSlice";
import { Group } from "@/interfaces/groupInterface";
import FeedBlogPreviewSkeleton from "../tabs/feed/FeedBlogPreviewSkeleton";

export default function GroupTab(props: {type: string, fieldID?: string}) {
  const dispatch = useAppDispatch()

  const [groups, setGroups] = useState<Group[]>()
  const [isFetching, setIsFetching] = useState(false)

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
          dispatch(getGroupsByFieldId(props.fieldID)).then((val) => {
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
      <FlatList
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
});
