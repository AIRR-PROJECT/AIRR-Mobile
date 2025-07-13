import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ToastAndroid,
} from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import {
  PendingBlogRequest,
  PendingMemberRequest,
} from "@/interfaces/groupInterface";
import {
  approveBlog,
  getGroupBlogsByID,
  getGroupPersonalBlogsByID,
  getPendingBlogList,
  getPendingTagList,
  getUserGroupStatus,
  rejectBlog,
} from "@/redux/slices/groupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";
import { UserBlog } from "@/interfaces/blogInterface";
import queryClient from "@/redux/api/queryClient";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import GroupBlogPreview from "@/components/group/GroupBlogPreview";
import { GroupRole } from "@/enums/group.enum";
import FeedBlogPreview from "@/components/tabs/feed/FeedBlogPreview";
import MoreOptionBottomList from "@/components/blog/MoreOptionBottomList";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlogViewType } from "@/enums/blog_properties.enum";
import { Image } from "expo-image";
enum TabOptions {
  All = "all",
  MyBlogs = "my-blogs",
  NeedApproval = "need-approval",
}
const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
export default function BlogsApprovalsPage() {
  // Currently use state to manage the blogs

  const dispatch = useAppDispatch();
  // const flatlistRef = useRef<any>()
  const { user, userCurrentGroupRole } = useAppSelector((state) => state.user);
  const { groupID, blogID, blogIdToRemove } = useLocalSearchParams<{
    groupID: string;
    blogID: string;
    blogIdToRemove: string;
  }>();

  const [userStatus, setUserStatus] = useState("NotJoined");
  const [displayBlogs, setDisplayBlogs] = useState<UserBlog[]>([]);
  const [blogApprovals, setBlogApprovals] = useState<PendingBlogRequest[]>([]);
  const [blogPage, setBlogPage] = useState(1);

  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  // const [blogs, setBlogs] = useState<PendingBlogRequest[]>([]);

  const moreOptionRef = useRef<BottomSheet>(null);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);
  const [role, setRole] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const [isViewTypePrivateOrInProfile, setIsViewTypePrivateOrInProfile] =
    useState(false);
  const [isAlreadyReported, setIsAlreadyReported] = useState(false);
  const [moreOptionBlogId, setMoreOptionBlogId] = useState("");
  const [moreOptionGroupId, setMoreOptionGroupId] = useState("");

  const handlePressMoreOption = (
    isUserWritten: boolean,
    blogId: string,
    groupId: string,
    blogStatus: string,
    isViewTypePrivateOrInProfile: boolean,
    isAlreadyReported: boolean
  ) => {
    setIsUserWrittenBlog(isUserWritten);
    setIsViewTypePrivateOrInProfile(isViewTypePrivateOrInProfile);
    setIsAlreadyReported(isAlreadyReported);
    setMoreOptionBlogId(blogId);
    setMoreOptionGroupId(groupId);
    setBlogStatus(blogStatus);

    const role =
      userStatus == "Pending"
        ? "Pending"
        : userCurrentGroupRole
        ? userCurrentGroupRole
        : "Not Member";
    setRole(role);

    if (moreOptionRef.current) {
      moreOptionRef.current.snapToIndex(0);
    }
    // console.log("More option pressed", isUserWritten)
  };

  const groupBlogsQuery = useQuery({
    queryKey: ["feed-group-blogs"],
    queryFn: async () => {
      let fetchedBlogs;
      if (selectedTab == TabOptions.All) {
        fetchedBlogs = await dispatch(
          getGroupBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: blogPage,
          })
        );
      } else {
        fetchedBlogs = await dispatch(
          getGroupPersonalBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: blogPage,
          })
        );
      }

      // console.log(fetchedBlogs.payload.blogList.blogs)
      return fetchedBlogs.payload as UserBlog[];
    },
    placeholderData: keepPreviousData,
  });
  const groupBlogsMutation = useMutation({
    mutationFn: async (page: number) => {
      if (displayBlogs.length == 0) {
        return [];
      }
      let moreFetchedBlogs;
      if (selectedTab == TabOptions.All) {
        moreFetchedBlogs = await dispatch(
          getGroupBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: blogPage,
          })
        );
      } else {
        moreFetchedBlogs = await dispatch(
          getGroupPersonalBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: blogPage,
          })
        );
      }

      // console.log(moreFetchedBlogs.payload.blogList.blogs)
      return moreFetchedBlogs.payload as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-group-blogs"], (oldData: any) => {
        return [...oldData, ...data] as UserBlog[];
      });
    },
  });
  const groupBlogsReset = useMutation({
    mutationFn: async () => {
      let refetchedBlog;
      if (selectedTab == TabOptions.All) {
        refetchedBlog = await dispatch(
          getGroupBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: 1,
          })
        );
      } else {
        refetchedBlog = await dispatch(
          getGroupPersonalBlogsByID({
            groupID: groupID,
            userID: user._id,
            page: blogPage,
          })
        );
      }

      return refetchedBlog.payload as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-group-blogs"], (oldData: any) => {
        return [...data] as UserBlog[];
      });
      setBlogPage(1);
    },
  });

  const handleBlogListEndReached = () => {
    setBlogPage(blogPage + 1);
    groupBlogsMutation.mutate(blogPage + 1);
  };

  useEffect(() => {
    if (groupID) {
      dispatch(getUserGroupStatus(groupID)).then((res) => {
        const data = res.payload as string;

        setUserStatus(data);
      });
    }
  }, [groupID]);

  useEffect(() => {
    setDisplayBlogs(groupBlogsQuery.data as UserBlog[]);
  }, [groupBlogsQuery.data]);

  useEffect(() => {
    if (selectedTab != TabOptions.NeedApproval) {
      setBlogPage(1);
      groupBlogsReset.mutateAsync();
    } else {
      dispatch(getPendingBlogList(groupID)).then((res) => {
        const list = res.payload as PendingBlogRequest[];
        setBlogApprovals(list);
      });
    }
  }, [selectedTab]);

  // useEffect(() => {
  //   dispatch(getPendingBlogList(groupID)).then(res => {
  //     const list = res.payload as PendingBlogRequest[]
  //     setBlogs(list)
  //   })
  // }, [])

  // useEffect(() => {
  //   // Scroll to specific index
  //   if (blogs != undefined && blogID != "" && blogID != undefined) {
  //     blogs.forEach((value, index) => {
  //       if (value.BlogID == blogID) {
  //         flatlistRef.current.scrollToIndex({ animated: true, index: index })
  //         return
  //       }
  //     })
  //   }
  // }, [blogs, blogID])

  const handleHideBlog = () => {
    groupBlogsReset.mutateAsync();
  };
  const handleDeleteBlog = () => {
    groupBlogsReset.mutateAsync();
  };
  useEffect(() => {
    console.log(blogIdToRemove);
    if (blogIdToRemove && selectedTab != TabOptions.NeedApproval) {
      groupBlogsReset.mutateAsync();
    }
  }, [blogIdToRemove]);

  const [approvalBlogAction, setApprovalBlogAction] = useState<
    "main" | "approve" | "reject"
  >("main");
  const approvalSheetRef = useRef<BottomSheet>(null);
  const [approvalBlog, setApprovalBlog] = useState<{
    id: string;
    blogOwnerId: string;
  }>({ id: "", blogOwnerId: "" });
  const onApprove = (id: string, blogOwnerId: string) => {
    setApprovalBlogAction("approve");
    setApprovalBlog({ id, blogOwnerId });
    approvalSheetRef.current?.snapToIndex(0);
  };
  // const onReject = (id: string, blogOwnerId: string) => {
  //   setApprovalBlogAction("reject");
  //   setApprovalBlog({ id, blogOwnerId });
  //   approvalSheetRef.current?.snapToIndex(0);
  // };
  // const onApprove = (id: string, blogOwnerId: string) => {
  //   dispatch(
  //     approveBlog({
  //       groupID: groupID,
  //       blogIDToApprove: id,
  //       blogOwnerID: blogOwnerId,
  //     })
  //   ).then((res) => {
  //     if (res.payload === true) {
  //       console.log("Approve blog with id: ", id);
  //       setBlogApprovals((prev) => prev.filter((b) => b.BlogID !== id));
  //     }
  //   });
  // };

  const onReject = (id: string, blogOwnerId: string) => {
    dispatch(
      rejectBlog({
        groupID: groupID,
        blogIDToReject: id,
        blogOwnerID: blogOwnerId,
      })
    ).then((res) => {
      if (res.payload === true) {
        console.log("Reject blog with id: ", id);
        ToastAndroid.show("Blog rejected successfully!", ToastAndroid.SHORT);
        setBlogApprovals((prev) => prev.filter((b) => b.BlogID !== id));
      }
    });
  };

  const renderBlogApprovalItem = ({ item }: any) => (
    <BlogApprovalCardComponent
      {...item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
  const blogApprovalFlatlistRef = useRef<any>(null);
  // TODO: Replace with actual logic to check if the user is admin or owner
  // 2 lựa chọn trên thì là cái feed blog preview
  // Còn cái lựa chọn thứ 3 là cái approval blog như bên approval

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.optionBar}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.All && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.All)}
        >
          <Text style={styles.optionText}>
            {userCurrentGroupRole === GroupRole.Owner ||
            userCurrentGroupRole === GroupRole.Admin
              ? "All Published Blogs"
              : "All Blogs"}
          </Text>
        </TouchableOpacity>

        {userStatus == "Active" && (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTab === TabOptions.MyBlogs && styles.optionButtonActive,
            ]}
            onPress={() => setSelectedTab(TabOptions.MyBlogs)}
          >
            <Text style={styles.optionText}>My Blogs</Text>
          </TouchableOpacity>
        )}

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

      {selectedTab != TabOptions.NeedApproval ? (
        <FlatList
          data={displayBlogs}
          renderItem={({ item }) => {
            console.log(item);
            return (
              <FeedBlogPreview
                blog={item}
                onPressMoreButton={() =>
                  handlePressMoreOption(
                    item.Author._id === user._id,
                    item._id,
                    item.Group._id,
                    item.Status,
                    false,
                    item.IsReportedByUser
                  )
                }
              />
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={[styles.list, {}]}
          style={{ paddingBottom: 80 }}
          onEndReached={handleBlogListEndReached}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        />
      ) : (
        <View style={{ flex: 1, padding: 20 }}>
          <Animated.FlatList
            data={blogApprovals}
            renderItem={renderBlogApprovalItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            itemLayoutAnimation={LinearTransition}
            ref={blogApprovalFlatlistRef}
          />
        </View>
      )}

      <MoreOptionBottomList
        sheetRef={moreOptionRef}
        isUserWrittenBlog={isUserWrittenBlog}
        blogId={moreOptionBlogId}
        groupId={moreOptionGroupId}
        role={role}
        blogStatus={blogStatus}
        isFromFeed={true}
        isFromDetail={false}
        isViewTypePrivateOrInProfile={isViewTypePrivateOrInProfile}
        isAlreadyReported={isAlreadyReported}
        handleHideThisBlog={handleHideBlog}
        handleDeleteThisBlog={handleDeleteBlog}
      />

      <BottomSheet
        ref={approvalSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "#fff" }}
        backgroundStyle={{ backgroundColor: "#1E1E1E" }}
        style={{ borderRadius: 20 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        onClose={() => {
          setApprovalBlogAction("main");
        }}
      >
        <BottomSheetView style={{ padding: 20, gap: 20 }}>
          {approvalBlogAction === "approve" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Confirm Blog Approval!
                  </Text>
                </View>
                <Text style={{ color: "#000", fontSize: 14 }}>
                  Are you sure you want to approve this blog? It will be
                  published and visible to everyone once approved.
                </Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      approvalSheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let Me Rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        approveBlog({
                          groupID: groupID,
                          blogIDToApprove: approvalBlog.id,
                          blogOwnerID: approvalBlog.blogOwnerId,
                        })
                      ).then((res) => {
                        if (res.payload === true) {
                          console.log(
                            "Approve blog with id: ",
                            approvalBlog.id
                          );
                          ToastAndroid.show(
                            "Blog approved successfully!",
                            ToastAndroid.SHORT
                          );
                          setBlogApprovals((prev) =>
                            prev.filter((b) => b.BlogID !== approvalBlog.id)
                          );
                        }
                      });
                      approvalSheetRef.current?.close();
                    }}
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
    marginVertical: 20,
    paddingHorizontal: 20,
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
    padding: 10,
    borderRadius: 20,
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 20,
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
