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
  role: "Member",
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
        style={[
          styles.memberItem,
          isSelected && styles.selectedMemberItem,
        ]}
        onPress={() => handleUserSelect(item.username)}
      >
        <Image
          source={{ uri: item.avatar }}
          style={styles.memberAvatar}
        />
        <Text
          style={[
            styles.memberName,
            isSelected && styles.selectedMemberName,
          ]}
        >
          @{item.username}
        </Text>
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
        {/* TODO: Nếu như list này ko tự fetch, thì thêm 1 cái kính lúp rồi cho user ấn thì search và/hoặc search khi user submit cái text input như mày thường làm */}
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
    padding: 15,
    backgroundColor: "#303030",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMemberItem: {
    backgroundColor: "#B9FF66",
  },
  memberName: {
    fontSize: 14,
    color: "#B9FF66",
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
});
