import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import TagApprovalCardComponent from "@/components/group/TagApprovalCardComponent";
import {
  PendingMemberRequest,
  PendingTagRequest,
} from "@/interfaces/groupInterface";
import {
  approveTag,
  getPendingMemberList,
  getPendingTagList,
  rejectTag,
} from "@/redux/slices/groupSlice";
import { useAppDispatch } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";

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
const initialTags = [mockTag1, mockTag2, mockTag3];

enum TabOptions {
  All = "all",
  NeedApproval = "need-approval",
}
// later remember to add the props
export default function TagsApprovalsPage() {
  // const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>();
  const { groupID, tagID } = useLocalSearchParams<{
    groupID: string;
    tagID: string;
  }>();

  const [tags, setTags] = useState<PendingTagRequest[]>([]);

  // useEffect(() => {
  //   dispatch(getPendingTagList(groupID)).then(res => {
  //     const list = res.payload as PendingTagRequest[]
  //     setTags(list)
  //   })
  // }, [])

  useEffect(() => {
    // Scroll to specific index
    if (tags != undefined && tagID != "" && tagID != undefined) {
      tags.forEach((value, index) => {
        if (value._id == tagID) {
          flatlistRef.current.scrollToIndex({ animated: true, index: index });
          return;
        }
      });
    }
  }, [tags, tagID]);

  const onApprove = (tagId: string, blogIDs: string[]) => {
    // dispatch(approveTag({
    //   groupID: groupID,
    //   tagIDToApprove: tagId,
    //   blogIDsContainTag: blogIDs
    // })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Approve tag with tag-name: ", tagId);
    //     setTags((prev) => prev.filter((b) => b._id !== tagId));
    //   }
    // })
  };
  const onReject = (tagId: string, blogIDs: string[]) => {
    // dispatch(rejectTag({
    //   groupID: groupID,
    //   tagIDToReject: tagId,
    //   blogIDsContainTag: blogIDs
    // })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Reject tag with tag-name: ", tagId);
    //     setTags((prev) => prev.filter((b) => b._id !== tagId));
    //   }
    // })
  };
  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
    <TagApprovalCardComponent
      {...item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  const isUserAdminOrOwner = true;
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.optionBar}>
        {/* Ấn nút này thì copy từ cái list cũ qua */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.All && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.All)}
        >
          <Text style={styles.optionText}>
            All Tags
          </Text>
        </TouchableOpacity>
        {/* TODO: ẤN nút này thì copy cái bên approval qua */}
        {isUserAdminOrOwner && <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.NeedApproval &&
              styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.NeedApproval)}
        >
          <Text style={styles.optionText}>Need Approval</Text>
        </TouchableOpacity>}
      </View>
      {/* <Animated.FlatList
        data={tags}
        renderItem={renderItem}
        keyExtractor={(item) => item.TagName}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
      /> */}
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
  optionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    borderRadius: 14,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B4C55",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionButtonActive: {
    backgroundColor: "#5CA0D3", // Active tab color
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
});
