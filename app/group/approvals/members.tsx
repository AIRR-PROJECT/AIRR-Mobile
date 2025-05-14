import { FontAwesome6 } from "@expo/vector-icons";
import { View, TextInput, StyleSheet } from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useState } from "react";
import MemberApprovalCardComponent from "@/components/group/MemberApprovalCardComponent";

// Initial mock data
const mockUser = {
  id: "1",
  name: "John Doe", 
  avatar: "https://picsum.photos/200/300",
  username: "johndoe",

  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};

const initialUsers = [mockUser, mockUser, mockUser].map((user, index) => ({
  ...user,
  id: index.toString(),
}));

export default function MemberApprovalsPage() {
  // Currently use state to manage the users
  // TODO: Khoa: Change to what you want
  const [users, setUsers] = useState(initialUsers);

  const onApprove = (id: string) => {
    console.log("Approve user with id: ", id);
  };

  const onReject = (id: string) => {
    console.log("Reject user with id: ", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const renderItem = ({ item }: any) => (
    <MemberApprovalCardComponent
      id={item.id}
      name={item.name}
      avatar={item.avatar}
      username={item.username}
      time={item.time}
      onApprove={onApprove}
      onReject={onReject}
    />
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Search Blogs"
            placeholderTextColor="#8A94AC"
          />
        </View>
      </View>

      {/* Animated FlatList */}
      <Animated.FlatList
        data={initialUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  textInput: {
    padding: 10,
    flex: 1,
    color: "#fff",
    fontSize: 18,
  },
});
