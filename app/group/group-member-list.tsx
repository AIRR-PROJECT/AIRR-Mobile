import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { getMemberList } from "@/redux/slices/groupSlice";
import { useLocalSearchParams } from "expo-router";
import { GroupMember } from "@/interfaces/groupInterface";
const mockModerator = {
  name: "John Doe",
  role: "Moderator",
  avatar: "https://picsum.photos/200",
};
const mockAdmin = {
  name: "Jane Smith",
  role: "Admin",
  avatar: "https://picsum.photos/201",
};

const mockGroupMembers = [
  {
    name: "Alice Johnson",
    role: "Member",
    avatar: "https://picsum.photos/202",
  },
  {
    name: "Bob Brown",
    role: "Member",
    avatar: "https://picsum.photos/203",
  },
  {
    name: "Charlie Davis",
    role: "Member",
    avatar: "https://picsum.photos/204",
  },
];
// sort the list by role Moderator, Admin, Member
// const sortedGroupMembers = [mockModerator, mockAdmin, ...mockGroupMembers];
// type GroupMember = {
//   name: string;
//   role: string;
//   avatar: string;
// };

// type GroupMemberListProps = {
//   isUserInGroup: boolean;
//   groupList: GroupMember[];
// };
// later remember to add the props
export default function GroupMemberList() {
  const dispatch = useAppDispatch()

  const { groupID } = useLocalSearchParams<{ groupID: string }>()

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [filteredGroupMembers, setFilteredGroupMembers] = useState<GroupMember[]>([])
  const searchText = useRef("")

  useEffect(() => {
    if (groupID) {
      dispatch(getMemberList({ groupID })).then((res) => {
        let sortOrder = ["Owner", "Admin", "Member"]
        const groupMembers = res.payload as GroupMember[]
        const sortedGroupMembers = groupMembers.sort((a, b) => sortOrder.indexOf(a.Role) - sortOrder.indexOf(b.Role))

        setGroupMembers(sortedGroupMembers)
        setFilteredGroupMembers(sortedGroupMembers)
      })
    }
  }, [groupID])

  const onHandleSearchTextChange = (val: string) => {
    searchText.current = val
  }

  const onHandleSubmitEditing = () => {
    if (searchText.current.length != 0) {
      const filteredGroupMembers = groupMembers.filter((member) => member.MemberInfo.Username.toLowerCase().includes(searchText.current.toLowerCase()))

      setFilteredGroupMembers(filteredGroupMembers)
    }
    else {
      setFilteredGroupMembers(groupMembers)
    }
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={30} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder={"Search member"}
            placeholderTextColor={"#8A94AC"}
            onChangeText={onHandleSearchTextChange}
            onSubmitEditing={onHandleSubmitEditing}
          />
        </View>
      </View>
      <FlatList
        data={filteredGroupMembers}
        renderItem={({ item }) => (
          <View
            style={[
              styles.memberContainer,
              item.Role === "Admin"
                ? { borderColor: colors.admin }
                : item.Role === "Owner"
                ? { borderColor: colors.owner }
                : { borderColor: colors.member },
            ]}
          >
            <Image source={item.MemberInfo.AvatarURL} style={styles.avatar} />
            <View>
              <Text style={styles.memberName}>{item.MemberInfo.Username}</Text>
              <View style={styles.roleWrapper}>
                <Text
                  style={[
                    styles.role,
                    item.Role === "Admin"
                      ? { color: colors.admin }
                      : item.Role === "Owner"
                      ? { color: colors.owner }
                      : { color: colors.member },
                  ]}
                >
                  {item.Role}
                </Text>
                <FontAwesome6
                  name="bolt"
                  size={24}
                  color={
                    item.Role === "Admin"
                      ? colors.admin
                      : item.Role === "Owner"
                      ? colors.owner
                      : colors.member
                  }
                />
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
      />
    </View>
  );
}
const colors = {
  admin: "#FFBA66",
  owner: "#B9FF66",
  member: "#66DBFF",
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
  },
  textInput: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
    fontSize: 20,
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  role: {
    fontSize: 14,
    color: "#8A94AC",
  },
  roleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
