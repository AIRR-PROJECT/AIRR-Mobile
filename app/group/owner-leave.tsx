import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

interface Member {
  avatar: string;
  username: string;
  role: string;
}

const member: Member = {
  avatar: "https://picsum.photos/200",
  username: "John Doe",
  role: "Owner",
};

const members: Member[] = Array.from({ length: 10 }, (_, i) => ({
  ...member,
  username: `User${i + 1}`,
}));

export default function OwnerLeaveGroup() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleUserSelect = (username: string) => {
    setSelectedUser(username);
  };

  const filteredMembers = members.filter((m) =>
    m.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: Member; index: number }) => {
    const isSelected = item.username === selectedUser;
    return (
      <TouchableOpacity
        key={index}
        style={[styles.memberItem, isSelected && styles.selectedMemberItem]}
        onPress={() => handleUserSelect(item.username)}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
          <Text
            style={[styles.memberName, isSelected && styles.selectedMemberName]}
          >
            @{item.username}
          </Text>
        </View>

        <View
          style={[
            styles.roleWrapper,
            {
              borderColor:
                item.role === "Admin"
                  ? colors.admin
                  : item.role === "Owner"
                  ? colors.owner
                  : colors.member,
              zIndex: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.role,
              item.role === "Admin"
                ? { color: colors.admin }
                : item.role === "Owner"
                ? { color: colors.owner }
                : { color: colors.member },
            ]}
          >
            {item.role}
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
        <TouchableOpacity style={styles.joinCancelButton}>
          <Text style={styles.joinCancelButtonText}>Let me rethink</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinConfirmButton}>
          <Text style={styles.joinConfirmButtonText}>Sure, I'm out!</Text>
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
