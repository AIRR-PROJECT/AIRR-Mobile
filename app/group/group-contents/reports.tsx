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
  GroupReport,
  PendingMemberRequest,
  PendingTagRequest,
} from "@/interfaces/groupInterface";
import {
  actionBlogReport,
  approveTag,
  getPendingMemberList,
  getPendingReportBlogList,
  getPendingTagList,
  rejectTag,
} from "@/redux/slices/groupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";
import ReportCardComponent from "@/components/group/ReportCardComponent";

type ReportUserComponentProps = GroupReport & {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

function ReportUserComponent({
  Blog,
  Reports,
  onApprove,
  onReject
}: ReportUserComponentProps) {
  const [temp, setTemp] = useState("")
  useEffect(() => {
    let string = ""
    Reports.forEach((r) => {
      string += "@" + r.User.UserName + ": (" + r.ReportType + ") " + r.Details + " - " 
    })
    setTemp(string)
  }, [Reports])

  return (
    <View
      style={styles.reportContainer}
    >
      {Blog && 
        <Image
          source={{ uri: Blog.CoverURL }}
          style={styles.avatar}
        />
      }
      {Blog && Reports &&
        <View>
          <Text style={{ color: "#000", fontSize: 16 }}>{Blog.Title}</Text>
          <Text style={{ color: "#aaa", fontSize: 14 }}>{Reports.length} Reports</Text>
          {/* Hải: DISPLAY ALL REPORTS ABOUT THIS BLOG */}
          <Text style={{ color: "#aaa", fontSize: 12 }}>
            {temp}
          </Text>
          {/* Hải: DISPLAY APPROVE AND REJECT BUTTONS */}
        </View>
      }
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
  const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>();
  const { groupID, tagID } = useLocalSearchParams<{
    groupID: string;
    tagID: string;
  }>();

  const [displayReports, setDisplayReports] = useState<GroupReport[]>([]);

  useEffect(() => {
    if (groupID) {
      dispatch(getPendingReportBlogList(groupID)).then(res => {
        const list = res.payload as GroupReport[]
        console.log(list)
        
        setDisplayReports(list)
      })
    }
  }, [groupID])

  const onApprove = (blogID: string) => {
    dispatch(actionBlogReport({
      BlogID: blogID,
      GroupID: groupID,
      Action: "Resolve"
    })).then(res => {
      if (res.payload === true) {
        console.log("Resolve report");
        setDisplayReports((prev) => prev.filter((r) => r.Blog._id !== blogID));
      }
    })
  };
  const onReject = (blogID: string) => {
    dispatch(actionBlogReport({
      BlogID: blogID,
      GroupID: groupID,
      Action: "Reject"
    })).then(res => {
      if (res.payload === true) {
        console.log("Reject report");
        setDisplayReports((prev) => prev.filter((r) => r.Blog._id !== blogID));
      }
    })
  };
  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
    <ReportCardComponent
      {...item}
        onApprove={onApprove}
        onReject={onReject}
    />
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.FlatList
        data={displayReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.Blog._id}
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
    backgroundColor: "#1E1E1E",
    padding: 20,
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
  reportContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
});
