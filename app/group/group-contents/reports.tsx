import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
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
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export default function ReportsApprovalsPage() {
  const dispatch = useAppDispatch();
  const flatlistRef = useRef<any>();
  const sheetRef = useRef<BottomSheet>(null);
  const { groupID, tagID } = useLocalSearchParams<{
    groupID: string;
    tagID: string;
  }>();

  const [displayReports, setDisplayReports] = useState<GroupReport[]>([]);
  const [isReportFetching, setIsReportFetching] = useState(false);

  // For bottom sheet confirm
  const [bottomSheetMode, setBottomSheetMode] = useState<
    "main" | "approve" | "reject"
  >("main");
  const [selectedReportID, setSelectedReportID] = useState<string>("");

  useEffect(() => {
    if (groupID) {
      setIsReportFetching(true);
      dispatch(getPendingReportBlogList(groupID)).then((res) => {
        const list = res.payload as GroupReport[];
        setDisplayReports(list);
        setIsReportFetching(false);
      });
    }
  }, [groupID]);

  const onApprove = (blogID: string) => {
    setSelectedReportID(blogID);
    setBottomSheetMode("approve");
    sheetRef.current?.snapToIndex(0);
  };
  const handleConfirmApprove = () => {
    dispatch(
      actionBlogReport({
        blogID: selectedReportID,
        groupID: groupID,
        action: "Resolve",
      })
    ).then((res) => {
      if (res.payload === true) {
        ToastAndroid.show("Report resolved", ToastAndroid.SHORT);
        setDisplayReports((prev) =>
          prev.filter((r) => r.Blog._id !== selectedReportID)
        );
      }
      sheetRef.current?.close();
    });
  };

  const handleConfirmReject = (blogID:string) => {
    dispatch(
      actionBlogReport({
        blogID: blogID,
        groupID: groupID,
        action: "Reject",
      })
    ).then((res) => {
      if (res.payload === true) {
        ToastAndroid.show("Report rejected", ToastAndroid.SHORT);
        setDisplayReports((prev) =>
          prev.filter((r) => r.Blog._id !== blogID)
        );
      }
      sheetRef.current?.close();
    });
  };
  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
    <ReportCardComponent
      {...item}
      onApprove={onApprove}
      onReject={handleConfirmReject}
    />
  );
  return isReportFetching ? (
    <FeedBlogPreviewSkeleton />
  ) : (
    <GestureHandlerRootView style={styles.container}>
      <Animated.FlatList
        data={displayReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.Blog._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
      />
      <BottomSheet
        ref={sheetRef}
        index={-1}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        handleStyle={{ backgroundColor: "#1E1E1E" }}
        style={{ backgroundColor: "#1E1E1E" }}
        backgroundStyle={{ backgroundColor: "#1E1E1E" }}
        onClose={() => {
          setBottomSheetMode("main");
        }}
      >
        <BottomSheetView style={{ padding: 20, gap: 20 }}>
          {bottomSheetMode === "approve" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.joinModalTitle}>Approve this report?</Text>
                <Text>This will resolve the report and ban the blog.</Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmApprove}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {/* {bottomSheetMode === "reject" && (
            <View style={[styles.modalContentContainer]}>
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.joinModalTitle}>
                  Reject this report?
                </Text>
                <Text>
                  This will reject the report and keep the blog visible.
                </Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmReject}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )} */}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
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
  modalContentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  joinConfirmImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  joinCancelButton: {
    backgroundColor: "#1B1F26",
    padding: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  joinCancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  joinConfirmButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(36, 87, 75, 0.5)", // Semi-transparent dark background
  },
  joinModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
