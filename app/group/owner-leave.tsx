import { GroupMember } from "@/interfaces/groupInterface";
import { useAppDispatch } from "@/redux/hook";
import { getGroupAdmins, getMemberList, leaveGroup } from "@/redux/slices/groupSlice";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

export default function OwnerLeaveGroup() {
  const dispatch = useAppDispatch()
  const { groupID } = useLocalSearchParams<{ groupID: string }>()

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [members, setMembers] = useState<GroupMember[]>([])
  const [filteredMembers, setFilteredMembers] = useState<GroupMember[]>([])

  useEffect(() => {
    if (groupID) {
      dispatch(getMemberList({ groupID })).then((res) => {
        const data = res.payload as GroupMember[]
        console.log(data)

        setMembers(data)
        setFilteredMembers(data)
      })
    }
  }, [groupID])

  useEffect(() => {
    if (searchText.length != 0) {
      setFilteredMembers(members.filter((m) =>
        m.MemberInfo.Username.toLowerCase().includes(searchText.toLowerCase()))
      )
    }
    else {
      setFilteredMembers(members)
    }
  }, [searchText, members])

  const handleUserSelect = (_id: string) => {
    setSelectedUser(_id);
  };

  const handleCancel = () => {
    router.dismiss()
  }
  const handleConfirm = () => {
    dispatch(leaveGroup({ groupID: groupID, newOwnerID: selectedUser! })).then((res) => {
      const result = res.payload as boolean

      if (result == true) {
        router.dismiss(2)
      }
    })
  }

  const renderItem = ({ item, index }: { item: GroupMember; index: number }) => {
    const isSelected = item.MemberInfo.Username === selectedUser;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.memberItem, isSelected && styles.selectedMemberItem]}
        onPress={() => handleUserSelect(item.MemberInfo._id)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: item.MemberInfo.AvatarURL }} style={styles.memberAvatar} />
          <Text
            style={[styles.memberName, isSelected && styles.selectedMemberName]}
          >
            @{item.MemberInfo.Username}
          </Text>
        </View>

        <View
          style={[
            styles.roleWrapper,
            {
              borderColor:
                item.Role === "Admin"
                  ? colors.admin
                  : item.Role === "Owner"
                  ? colors.owner
                  : colors.member,
              zIndex: 1,
            },
          ]}
        >
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Are You Sure You Want To Leave the Group?
      </Text>
      <Text style={styles.smallText}>Choose new group owner:</Text>

      {/* Search bar */}
      <View style={{ width: "100%", marginBottom: 20, paddingHorizontal: 20 }}>
        {/* TODO: Nếu như list này ko tự fetch, thì thêm 1 cái kính lúp rồi cho user ấn thì search và/hoặc search khi user submit cái text input như bên group fields */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search username..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Member list */}
      <FlatList
        style={styles.flatlist}
        data={filteredMembers}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={[styles.rowContainer, { gap: 20 }]}>
        <TouchableOpacity style={styles.joinCancelButton} onPress={handleCancel}>
          <Text style={styles.joinCancelButtonText}>Let me rethink</Text>
        </TouchableOpacity>
        <TouchableOpacity style={selectedUser ? styles.joinConfirmButton : styles.joinConfirmDisabledButton} disabled={selectedUser == null} onPress={handleConfirm}>
          <Text style={selectedUser ? styles.joinConfirmButtonText : styles.joinConfirmDisabledButtonText}>Sure, I'm out!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B9FF66",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  smallText: {
    fontSize: 14,
    color: "#DCDCDC",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  flatlist: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#444",
    height: "40%",
    flexGrow: 0,
    borderRadius: 8,
  },
  memberItem: {
    width: "100%",
    padding: 15,
    backgroundColor: "#303030",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedMemberItem: {
    backgroundColor: "#E0E0E0",
  },
  memberName: {
    fontSize: 14,
    color: "#fff",
  },
  selectedMemberName: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
  searchInput: {
    height: 40,
    borderColor: "#B9FF66",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
    width: "100%",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  role: {
    fontSize: 14,
    color: "#8A94AC",
    fontWeight: "bold",
  },
  roleWrapper: {
    padding: 20,
    borderWidth: 2,
    borderRadius: 8,
  },
  joinCancelButton: {
    backgroundColor: "#303030",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinConfirmDisabledButton: {
    backgroundColor: "#DDF5C1",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  joinCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinConfirmButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinConfirmDisabledButtonText: {
    color: "#7F7F7E",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
});
const colors = {
  admin: "#FFBA66",
  owner: "#B9FF66",
  member: "#66DBFF",
};
