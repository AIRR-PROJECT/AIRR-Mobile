import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ToastAndroid,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import validateNotEmpty from "@/utils/validateNotEmpty";

import BlogCommenter from "@/components/blog/BlogCommenter";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  commentOnBlog,
  deleteComment,
  editComment,
  getAIBlogDetail,
  getBlogComment,
  getUserBlogDetail,
  setCommentAdded,
} from "@/redux/slices/blogSlice";
import {
  AIBlogSection,
  PostComment,
  UserBlogChildComment,
  UserBlogComment,
  UserBlogTag,
} from "@/interfaces/blogInterface";
import {
  getUserBlogDislikeActivities,
  getUserBlogLikeActivities,
  getUserBlogSaveActivities,
} from "@/redux/slices/authSlice";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { Divider } from "@rneui/base";
import CommentMoreOptionBottomList from "@/components/blog/CommentMoreOptionBottomList";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";

export default function CommentBlogScreen() {
  const searchParams = useLocalSearchParams<{
    blogId: string;
    commentId: string;
  }>();

  const dispatch = useAppDispatch();
  const {
    currentAIBlog,
    currentUserBlog,
    currentBlogComments,
    isCurrentBlogSaved,
  } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);
  // CHANGE: Initialize with empty array instead of currentBlogComments
  const [blogComments, setBlogComments] = useState<UserBlogComment[]>([]);
  // Post comment
  const [postCommentContent, setPostCommentContent] = useState("");
  const [commentText, setCommentText] = useState("");
  // Comment options
  const [editCommentContent, setEditCommentContent] = useState("");
  const [chosenComment, setChosenComment] = useState<UserBlogComment>();
  const [chosenChildComment, setChosenChildComment] =
    useState<UserBlogChildComment>();
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setRefreshing(true);

    dispatch(getBlogComment(searchParams.blogId)).then(() => {
      setRefreshing(false);
    })
  }, [])

  // FETCH COMMENTS ONLY ONCE ON MOUNT
  useEffect(() => {
    if (searchParams.blogId && !hasInitiallyLoaded) {
      console.log("Fetching comments for blogId:", searchParams.blogId);
      dispatch(getBlogComment(searchParams.blogId));
      setHasInitiallyLoaded(true);
    }
  }, [searchParams.blogId, dispatch, hasInitiallyLoaded]);

  // UPDATE LOCAL STATE WHEN REDUX STATE CHANGES
  useEffect(() => {
    if (currentBlogComments && Array.isArray(currentBlogComments)) {
      console.log(
        "Updating blogComments from Redux:",
        currentBlogComments.length
      );
      setBlogComments(currentBlogComments);
    }
  }, [currentBlogComments]);

  // SCROLL TO SPECIFIC COMMENT AFTER DATA IS LOADED
  useEffect(() => {
    if (
      blogComments?.length > 0 &&
      searchParams.commentId &&
      searchParams.commentId !== "" &&
      flatListRef.current
    ) {
      const commentIndex = blogComments.findIndex(
        (value) => value._id === searchParams.commentId
      );

      if (commentIndex !== -1) {
        console.log("Scrolling to comment index:", commentIndex);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            animated: true,
            index: commentIndex,
          });
        }, 1000); // Increased delay
      }
    }
  }, [blogComments, searchParams.commentId]);

  // FIX 4: Improve refresh handler
  const handleRefresh = () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes

    setRefreshing(true);

    dispatch(getBlogComment(searchParams.blogId)).finally(() => {
      setRefreshing(false);
    });
  };

  const handleInputUserPostComment = (val: string) => {
    setPostCommentContent(val);
  };
  const handlePostUserComment = () => {
    const trimmedPostComment = postCommentContent.trim();
    if (!trimmedPostComment) {
      ToastAndroid.show("Comment cannot be empty or just spaces", ToastAndroid.SHORT);
      return;
    }

    const comment: PostComment = {
      UserID: user._id,
      BlogID: currentUserBlog._id,  
      Content: trimmedPostComment,
      Method: "Post",
    };
    dispatch(commentOnBlog(comment)).then((res) => {
      if (res.payload === true) {
        dispatch(getBlogComment(searchParams.blogId));

        setPostCommentContent("");
        setIsWriteComment(false);

        dispatch(setCommentAdded(true));
      }
    });
  };
  const handleReplyPosted = () => {
    console.log("Reply posted");
    // dispatch(getBlogComment(searchParams.blogId));
  };
  const handleInputUserEditComment = (val: string) => {
    setEditCommentContent(val);
  };
  const handleEditCommentPress = () => {
    if (chosenComment) {
      sheetRef.current?.close();
      setIsEditingComment(true);
    }
  };
  const handleEditCommentSubmit = () => {
    if (chosenComment) {
      // Trim the content before submitting
      const trimmedContent = editCommentContent.trim();
      if (!trimmedContent) {
        ToastAndroid.showWithGravity(
          "Comment cannot be empty or just spaces",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        return;
      }
      if (!chosenChildComment) {
        dispatch(
          editComment({
            BlogID: searchParams.blogId,
            Content: trimmedContent,
            CommentID: chosenComment._id,
          })
        ).then((res) => {
          const result = res.payload as boolean;

          if (result === true) {
            ToastAndroid.showWithGravity(
              "Comment edited",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );

            setIsEditingComment(false);

            let blogCommentsClone = JSON.parse(
              JSON.stringify(blogComments)
            ) as any[];
            const index = blogCommentsClone.findIndex(
              (c) => c._id == chosenComment._id
            );
            if (index != -1) {
              blogCommentsClone[index].Content = trimmedContent;
              setBlogComments(blogCommentsClone);
            }
          }
        });
      } else {
        dispatch(
          editComment({
            BlogID: searchParams.blogId,
            Content: trimmedContent,
            CommentID: chosenChildComment._id,
          })
        ).then((res) => {
          const result = res.payload as boolean;

          if (result === true) {
            ToastAndroid.showWithGravity(
              "Comment edited",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );

            setIsEditingComment(false);

            let blogCommentsClone = JSON.parse(
              JSON.stringify(blogComments)
            ) as UserBlogComment[];
            const index = blogCommentsClone.findIndex(
              (c: UserBlogComment) => c._id == chosenComment._id
            );
            if (index != -1) {
              const innerIndex = blogCommentsClone[
                index
              ].ChildrenComments.findIndex(
                (c: UserBlogChildComment) => c._id == chosenChildComment._id
              );
              if (innerIndex != -1) {
                blogCommentsClone[index].ChildrenComments[innerIndex].Content =
                  trimmedContent;
                setBlogComments(blogCommentsClone);
              }
            }
          }
        });
      }
    }
  };
  const handleDeleteComment = () => {
    if (chosenComment) {
      if (!chosenChildComment) {
        dispatch(
          deleteComment({
            BlogID: searchParams.blogId,
            CommentID: chosenComment._id,
          })
        ).then((res) => {
          const result = res.payload as boolean;

          if (result === true) {
            ToastAndroid.showWithGravity(
              "Comment deleted",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );
            setBlogComments(
              blogComments.filter((c) => c._id != chosenComment._id)
            );
            sheetRef.current?.close();
          }
        });
      } else {
        dispatch(
          deleteComment({
            BlogID: searchParams.blogId,
            CommentID: chosenChildComment._id,
          })
        ).then((res) => {
          const result = res.payload as boolean;

          if (result === true) {
            ToastAndroid.showWithGravity(
              "Comment deleted",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            );

            let blogCommentsClone = JSON.parse(
              JSON.stringify(blogComments)
            ) as UserBlogComment[];
            let index = blogCommentsClone.findIndex(
              (c: UserBlogComment) => c._id == chosenComment._id
            );
            if (index != -1) {
              let editedChild = blogCommentsClone[
                index
              ].ChildrenComments.filter(
                (c: UserBlogChildComment) => c._id != chosenChildComment._id
              );
              blogCommentsClone[index].ChildrenComments = editedChild;
              setBlogComments(blogCommentsClone);
            }

            sheetRef.current?.close();
          }
        });
      }
    }
  };
  useEffect(() => {
    console.log(`Current blog saved: ${isCurrentBlogSaved}`);
  }, [isCurrentBlogSaved]);

  const [isWriteComment, setIsWriteComment] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const [isUserWrittenComment, setIsUserWrittenComment] = useState(false);
  const handleMorePress = (
    isUserWrittenComment: boolean,
    chosenComment: UserBlogComment,
    chosenChildComment?: UserBlogChildComment
  ) => {
    setIsUserWrittenComment(isUserWrittenComment);
    if (sheetRef.current) {
      if (isUserWrittenComment) {
        setChosenComment(chosenComment);
        setChosenChildComment(chosenChildComment);
        sheetRef.current.snapToIndex(0);
      }
    }
  };
  return (
    <GestureHandlerRootView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Add this line
      style={{ flex: 1, backgroundColor: "#1E1E1E" }}
    >
      <View style={[styles.container]}>
        {/* Other user comments */}
        {!isWriteComment && (
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.commentButtonContainer}
              onPress={() => {
                setIsWriteComment(true);
              }}
            >
              <Text style={styles.commentText}>Write a comment...</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* User Comment */}
        {isWriteComment && (
          <View style={styles.commentWriteContainer}>
            <View style={[styles.rowContainer, { alignItems: "center" }]}>
              {/* User avatar */}
              <View style={styles.rowContainer}>
                <Image style={styles.avatar} source={{ uri: user.avatarURL }} />
                {/* name and date */}
                <View>
                  <View>
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.date}>{new Date().toDateString()}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsWriteComment(false)}>
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {/* Input */}
            <TextInput
              style={styles.replyTextInput}
              placeholder="Write a reply..."
              placeholderTextColor="#565656"
              multiline
              numberOfLines={4}
              onChangeText={handleInputUserPostComment}
              textAlignVertical="top"
            />
            <Divider />
            {/* Comment Button */}
            <TouchableOpacity
              style={styles.commentWriteButtonContainer}
              onPress={handlePostUserComment}
            >
              <Text style={styles.commentWriteButtonText}>Comment</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Edit Comment */}
        {isEditingComment && (
          <View style={styles.commentWriteContainer}>
            <View style={[styles.rowContainer, { alignItems: "center" }]}>
              {/* User avatar */}
              <View style={styles.rowContainer}>
                <Image style={styles.avatar} source={{ uri: user.avatarURL }} />
                {/* name and date */}
                <View>
                  <View>
                    <Text style={styles.name}>{user.username}</Text>
                    <Text style={styles.date}>{new Date().toDateString()}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsEditingComment(false)}>
                <AntDesign name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {/* Input */}
            <TextInput
              style={styles.replyTextInput}
              placeholder="Write a reply..."
              placeholderTextColor="#565656"
              multiline
              numberOfLines={4}
              defaultValue={
                chosenChildComment
                  ? chosenChildComment.Content
                  : chosenComment?.Content
              }
              onChangeText={handleInputUserEditComment}
              textAlignVertical="top"
            />
            <Divider />
            {/* Comment Button */}
            <TouchableOpacity
              style={styles.commentWriteButtonContainer}
              onPress={handleEditCommentSubmit}
            >
              <Text style={styles.commentWriteButtonText}>Comment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ flex: 1, backgroundColor: "#1E1E1E", position: "fixed" }}>
        <FlatList
          ref={flatListRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={blogComments}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({ item }) => (
            <BlogCommenter
              comment={item}
              onReplyPosted={handleReplyPosted}
              sheetRef={sheetRef}
              onMorePress={handleMorePress}
            />
          )}
          style={[styles.flatListContainer]}
          contentContainerStyle={[styles.contentContainer]}
          ListFooterComponent={<View style={{ height: 20 }}></View>}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          initialNumToRender={blogComments ? blogComments.length : 100}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      </View>
      <CommentMoreOptionBottomList
        sheetRef={sheetRef}
        isUserWrittenComment={isUserWrittenComment}
        handleEditPressThisComment={handleEditCommentPress}
        handleDeleteThisComment={handleDeleteComment}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },
  container: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#1E1E1E",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  groupName: {
    color: "#898989",
    fontSize: 14,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    paddingVertical: 20,
  },
  scrollViewContent: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 20,
    textAlign: "justify",
  },
  smallText: {
    fontSize: 12,
    color: "#C2C2C2",
  },
  dateAndComment: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  additionalInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    gap: 10,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    alignItems: "center",
    paddingBottom: 20,
  },
  interactSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  likeContainerNo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#3C574960",
    padding: 10,
    borderRadius: 13,
  },
  likeContainerYes: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 13,
  },
  dislikeContainerNo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#3C574960",
    borderRadius: 13,
  },
  dislikeContainerYes: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 13,
  },
  commentContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#3C574960",
  },
  bookmarkContainerYes: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  bookmarkContainerNo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#3C574960",
  },
  commentButtonContainer: {
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#B9FF66",
    padding: 20,
    borderRadius: 90,
    marginTop: 20,
  },
  commentText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 45,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    color: "#fff",
    fontSize: 14,
  },
  comment: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  replyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  replyTextInput: {
    color: "#fff",
    minHeight: 80,
    textAlign: "justify",
  },
  commentWriteContainer: {
    padding: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "#191926",
    marginTop: 20,
  },
  commentWriteButtonContainer: {
    backgroundColor: "#B9FF66",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 90,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start", // ADD: Makes button wrap to content width
  },
  commentWriteButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center", // ADD: Center text
  },
});
