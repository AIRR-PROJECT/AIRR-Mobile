import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import TagApprovalCardComponent from "@/components/group/TagApprovalCardComponent";
import {
  GroupTag,
  PendingMemberRequest,
  PendingTagRequest,
} from "@/interfaces/groupInterface";
import {
  approveTag,
  getGroupTagsByID,
  getPendingMemberList,
  getPendingTagList,
  rejectTag,
} from "@/redux/slices/groupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";
import { SectionGrid } from "react-native-super-grid";
import { GroupRole } from "@/enums/group.enum";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { EmptyContent } from "@/components/EmptyContent";
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
  const sheetRef = useRef<BottomSheet>(null);
  const [bottomSheetMode, setBottomSheetMode] = useState<"main" | "approve">(
    "main"
  );
  const [selectedTagID, setSelectedTagID] = useState<string>("");
  const dispatch = useAppDispatch();
  const flatlistRef = useRef<any>();
  const { userCurrentGroupRole } = useAppSelector((state) => state.user);
  const { groupID, tagIDNotif } = useLocalSearchParams<{
    groupID: string;
    tagIDNotif: string;
  }>();
  const tagIDToScroll = useRef<string | null>(tagIDNotif);

  const [displayTags, setDisplayTags] = useState<
    { id: string; data: GroupTag[] }[]
  >([]);
  const [tagsApproval, setTagsApproval] = useState<PendingTagRequest[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  const [isTagFetching, setIsTagFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setIsTagFetching(true);
    if (selectedTab == TabOptions.All) {
      dispatch(getGroupTagsByID({ groupID })).then((res) => {
        const list = res.payload as GroupTag[];

        let categorizedTags = {};
        let categorizedTagsList: { id: string; data: GroupTag[] }[] = [];
        const retrievedTags = res.payload as GroupTag[];

        retrievedTags.forEach((tags) => {
          const initial = tags.TagName.charAt(0).toLowerCase();

          if (Object.hasOwn(categorizedTags, initial)) {
            (categorizedTags[initial] as GroupTag[]).push(tags);
          } else {
            categorizedTags[initial] = [tags];
          }
        });

        Object.entries(categorizedTags).forEach((entry) => {
          categorizedTagsList.push({
            id: entry[0] as string,
            data: entry[1] as GroupTag[],
          });
        });
        categorizedTagsList = categorizedTagsList.sort((a, b) =>
          a.id.localeCompare(b.id)
        );
        setDisplayTags(categorizedTagsList);

        setIsTagFetching(false);
      });
    } else {
      dispatch(getPendingTagList(groupID)).then((res) => {
        const list = res.payload as PendingTagRequest[];
        setTagsApproval(list);

        setIsTagFetching(false);
      });
    }
  }, [selectedTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    setIsTagFetching(true);
    if (selectedTab == TabOptions.All) {
      dispatch(getGroupTagsByID({ groupID })).then((res) => {
        const list = res.payload as GroupTag[];

        let categorizedTags = {};
        let categorizedTagsList: { id: string; data: GroupTag[] }[] = [];
        const retrievedTags = res.payload as GroupTag[];

        retrievedTags.forEach((tags) => {
          const initial = tags.TagName.charAt(0).toLowerCase();

          if (Object.hasOwn(categorizedTags, initial)) {
            (categorizedTags[initial] as GroupTag[]).push(tags);
          } else {
            categorizedTags[initial] = [tags];
          }
        });

        Object.entries(categorizedTags).forEach((entry) => {
          categorizedTagsList.push({
            id: entry[0] as string,
            data: entry[1] as GroupTag[],
          });
        });
        categorizedTagsList = categorizedTagsList.sort((a, b) =>
          a.id.localeCompare(b.id)
        );
        setDisplayTags(categorizedTagsList);

        setIsTagFetching(false);
      });
    } else {
      dispatch(getPendingTagList(groupID)).then((res) => {
        const list = res.payload as PendingTagRequest[];
        setTagsApproval(list);

        setIsTagFetching(false);
      });
    }
    
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  }, []);

  useEffect(() => {
    // Prevent scroll to member altogether
    if (tagIDToScroll.current == null) return;

    // Scroll to specific index
    if (selectedTab !== TabOptions.NeedApproval) {
      setSelectedTab(TabOptions.NeedApproval);
    } else if (tagsApproval != undefined && tagIDToScroll.current != "") {
      tagsApproval.forEach((value, index) => {
        if (value._id == tagIDToScroll.current) {
          flatlistRef.current.scrollToIndex({ animated: true, index: index });
          // Turn on prevention
          tagIDToScroll.current = null;
          return;
        }
      });
    }
  }, [tagsApproval, tagIDToScroll.current, selectedTab]);

  // Approve handler with confirmation
  const onApprove = (tagId: string, blogIDs: string[]) => {
    setSelectedTagID(tagId);
    setBottomSheetMode("approve");
    sheetRef.current?.snapToIndex(0);
  };
  // Confirm approve action
  const handleConfirmApprove = () => {
    dispatch(
      approveTag({
        groupID: groupID,
        tagIDToApprove: selectedTagID,
        blogIDsContainTag: [],
      })
    ).then((res) => {
      if (res.payload === true) {
        ToastAndroid.show("Tag approved", ToastAndroid.SHORT);
        setTagsApproval((prev) => prev.filter((b) => b._id !== selectedTagID));
      }
      sheetRef.current?.close();
    });
  };
  // Reject handler (no confirmation needed)
  const onReject = (tagId: string, blogIDs: string[]) => {
    dispatch(
      rejectTag({
        groupID: groupID,
        tagIDToReject: tagId,
        blogIDsContainTag: blogIDs,
      })
    ).then((res) => {
      if (res.payload === true) {
        setTagsApproval((prev) => prev.filter((b) => b._id !== tagId));
      }
    });
  };

  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
    <TagApprovalCardComponent
      {...item}
      onApprove={() => onApprove(item._id, item.blogIDsContainTag ?? [])}
      onReject={() => onReject(item._id, item.blogIDsContainTag ?? [])}
    />
  );
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
          <Text style={styles.optionText}>All Tags</Text>
        </TouchableOpacity>
        {/* TODO: ẤN nút này thì copy cái bên approval qua */}
        {(userCurrentGroupRole == GroupRole.Admin ||
          userCurrentGroupRole == GroupRole.Owner) && (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTab === TabOptions.NeedApproval &&
                styles.optionButtonActive,
            ]}
            onPress={() => setSelectedTab(TabOptions.NeedApproval)}
          >
            <Text style={styles.optionText}>Need Approval</Text>
          </TouchableOpacity>
        )}
      </View>

      {isTagFetching ? (
        <FeedBlogPreviewSkeleton />
      ) : selectedTab == TabOptions.All ? 
      displayTags && displayTags.length == 0 ?
      (
        <SectionGrid
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          sections={[{
            data: []
          }]}
          itemDimension={150} // Controls column width
          spacing={10} // Spacing between items
          style={styles.gridView}
          renderItem={() => <EmptyContent/>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.title}>{section.id}</Text>
          )}
          // contentContainerStyle={styles.list}
        />
      ) :
      (
        <SectionGrid
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          sections={displayTags}
          itemDimension={150} // Controls column width
          spacing={10} // Spacing between items
          style={styles.gridView}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tagContainer}>
              <Text style={styles.tag}>#{item.TagName}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.title}>{section.id}</Text>
          )}
          keyExtractor={(item, index) => item.TagName + index}
          // contentContainerStyle={styles.list}
        />
      ) : 
      tagsApproval && tagsApproval.length == 0 ?
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={["1"]}
          renderItem={() => <EmptyContent/>}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          itemLayoutAnimation={LinearTransition}
        />
      ) :
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={tagsApproval}
          renderItem={renderItem}
          keyExtractor={(item) => item.TagName}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          itemLayoutAnimation={LinearTransition}
        />
      )}
      {/* BottomSheet for approve confirmation */}
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
                source={require("@/assets/images/group/join_confirm.png")}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.joinModalTitle}>Approve this tag?</Text>
                <Text>
                  This will approve the tag and make it available in the group.
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
                    onPress={handleConfirmApprove}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
  },
  tagContainer: {
    padding: 10,
    backgroundColor: "#2E3B40",
    borderRadius: 10,
    marginVertical: 5,
    width: 160,
  },
  tag: {
    fontSize: 16,
    color: "#fff",
  },
  gridView: {
    flex: 1,
    paddingBottom: 40,
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
