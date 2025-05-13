import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import TagApprovalCardComponent from "@/components/group/TagApprovalCardComponent";

// Initial mock data
const mockTag1 = {
  tag: "aimachine",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const mockTag2 = {
  tag: "react native",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const mockTag3 = {
  tag: "expo",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const initialTags = [mockTag1, mockTag2, mockTag3]

// later remember to add the props
export default function TagsApprovalsPage() {
  const [tags, setTags] = useState(initialTags);

  const onApprove = (tag: string) => {
    console.log("Approve tag with tag-name: ", tag);
  };
  const onReject = (tag: string) => {
    console.log("Reject tag with tag-name: ", tag);
    setTags((prev) => prev.filter((b) => b.tag !== tag));
  };
  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
   <TagApprovalCardComponent
      tag={item.tag}
      user={item.user}
      time={item.time}
      onApprove={onApprove}
      onReject={onReject}
   />
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Search bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={30} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder={"Search Tags"}
            placeholderTextColor={"#8A94AC"}
          />
        </View>
      </View>

      {/* Animated FlatList */}
      <Animated.FlatList
        data={tags}
        renderItem={renderItem}
        keyExtractor={(item) => item.tag}
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
