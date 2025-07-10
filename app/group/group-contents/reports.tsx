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

function ReportUserComponent({
  user,
  reason,
  time,
}: {
  user: { id: string; name: string; avatar: string };
  reason: string;
  time: number;
}) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
    >
      <Image
        source={{ uri: user.avatar }}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
      />
      <View>
        <Text style={{ color: "#fff", fontSize: 16 }}>{user.name}</Text>
        <Text style={{ color: "#aaa", fontSize: 14 }}>{reason}</Text>
        <Text style={{ color: "#aaa", fontSize: 12 }}>
          {new Date(time).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}
const mockData = {
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  reason: "Inappropriate content",
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const initialReports = Array(10)
  .fill(mockData)
  .map((item, index) => ({
    ...item,
    user: { ...item.user, id: index.toString() },
  }));
export default function ReportsApprovalsPage() {
  // const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>();
  const { groupID, tagID } = useLocalSearchParams<{
    groupID: string;
    tagID: string;
  }>();

  const [tags, setTags] = useState<PendingTagRequest[]>([]);

  // useEffect(() => {
  //   dispatch(getPendingTagList(groupID)).then(res => {
  //     const list = res.payload as PendingTagRequest[]f
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
    <ReportUserComponent
      {...item}
    //   onApprove={onApprove}
    //   onReject={onReject}
    />
  );
  // Vào được tab này thì chắc chắn là user đã là admin hoặc owner của group rồi
  const isUserAdminOrOwner = true;
  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.FlatList
        data={initialReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.user.id}
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
