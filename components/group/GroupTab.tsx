import { FlatList, StyleSheet, Text, View } from "react-native";
import GroupCardComponent from "@/components/group/GroupCardComponent";
import { useAppDispatch } from "@/redux/hook";
import { useEffect, useState } from "react";
import { getCreatedGroups, getFieldDetail } from "@/redux/slices/groupSlice";
import { Group } from "@/interfaces/groupInterface";
const mockGroup: Group = {
  CoverURL: "https://picsum.photos/200",
  Name: "Group Name",
  _id: "group-id",
  NumberOfMembers: 350,
  Description: "",
  Owner: {
    _id: "test owner",
    Username: "Test owner name",
    AvatarURL: ""
  },
  FieldName: "",
  Tags: [],
  avatar: "",
  members: [],
  timestamp: ""
};
const mockGroups = [
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
];
export default function GroupTab(props: {type: string, fieldID?: string}) {
  const dispatch = useAppDispatch()

  const [groups, setGroups] = useState<Group[]>(mockGroups)

  useEffect(() => {
    switch (props.type) {
      case "all":
        if (props.fieldID) {
          dispatch(getFieldDetail(props.fieldID)).then((val) => {
            setGroups(val.payload as Group[])
          })
        }
        break
      case "my":
        dispatch(getCreatedGroups()).then((res) => {
          console.log(res.payload)
          setGroups(res.payload as Group[])
        })
        break
      case "joined":
        break
    }
  }, [props.fieldID])

  return (
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
