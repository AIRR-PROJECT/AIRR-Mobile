import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import BlogAuthorComponent from "@/components/blog/BlogAuthorComponent";
import BlogTagButton from "@/components/blog/BlogTagButton";
import { ThemedText } from "@/components/ThemedText";
import QuillRenderer from "@/components/dom-components/QuillRenderer/QuillRenderer";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  commentOnBlog,
  dislikeBlog,
  dislikeToLikeBlog,
  getAIBlogDetail,
  getBlogComment,
  getUserBlogDetail,
  likeBlog,
  likeToDislikeBlog,
  removeDislikeBlog,
  removeLikeBlog,
  saveBlog,
  setCommentAdded,
  unsaveBlog,
} from "@/redux/slices/blogSlice";
import {
  AIBlogSection,
  PostComment,
  UserBlogComment,
  UserBlogGroup,
  UserBlogTag,
} from "@/interfaces/blogInterface";
import {
  getUserBlogDislikeActivities,
  getUserBlogLikeActivities,
  getUserBlogSaveActivities,
} from "@/redux/slices/authSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MoreOptionBottomList from "@/components/blog/MoreOptionBottomList";
import { formatDistanceToNow } from "date-fns";
import { BlogStatus, BlogViewType } from "@/enums/blog_properties.enum";

// TODO: CONSIDER MOVE THIS TO A SEPARATE FILE OR USER ALREADY EXISTING ENUM
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

let isReactOnTimeout = false;
export default function BlogScreen() {
  const searchParams = useLocalSearchParams<{
    aiBlogId: string;
    userBlogId: string;
    userBlogCommentId: string;
  }>();
  // if (searchParams.aiBlogId) {

  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    currentAIBlog,
    currentUserBlog,
    currentBlogComments,
    isCurrentBlogLiked,
    isCurrentBlogDisliked,
    isCurrentBlogSaved,
    commentAdded,
  } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);

  // Shared properties
  const [title, setTitle] = useState("Mock description");
  const [description, setDescription] = useState("Mock description");
  // const [thumbnail, setThumbnail] = useState(mockThumbnail);
  // AI blog properties
  // const [sections, setSections] = useState(mockSections);
  const [conclusion, setConclusion] = useState("This is concluded.");
  // User blog properties
  // const [author, setAuthor] = useState(mockAuthor);
  // const [tags, setTags] = useState(mockTags);
  // const [group, setGroup] = useState(mockGroup);
  const reactTimeout = 500;
  const [likes, setLikes] = useState(123);
  const [dislikes, setDislikes] = useState(123);
  const [comments, setComments] = useState(123);
  const [blogLiked, setBlogLiked] = useState<boolean>(false);
  const [blogDisliked, setBlogDisliked] = useState<boolean>(false);
  const [blogSaved, setBlogSaved] = useState<boolean>(false);
  // const [html, setHtml] = useState(mockHtml);
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (searchParams.aiBlogId) {
      dispatch(getAIBlogDetail(searchParams.aiBlogId));
    } else {
      dispatch(getUserBlogDetail(searchParams.userBlogId));
      dispatch(getUserBlogLikeActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogLiked(data.payload as boolean);
        }
      );
      dispatch(getUserBlogDislikeActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogDisliked(data.payload as boolean);
        }
      );
      dispatch(getUserBlogSaveActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogSaved(data.payload as boolean);
        }
      );
    }
    dispatch(getBlogComment(searchParams.aiBlogId ?? searchParams.userBlogId));
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh

    if (searchParams.aiBlogId) {
      dispatch(getAIBlogDetail(searchParams.aiBlogId));
    } else {
      dispatch(getUserBlogDetail(searchParams.userBlogId));
      dispatch(getUserBlogLikeActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogLiked(data.payload as boolean);
        }
      );
      dispatch(getUserBlogDislikeActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogDisliked(data.payload as boolean);
        }
      );
      dispatch(getUserBlogSaveActivities(searchParams.userBlogId)).then(
        (data) => {
          setBlogSaved(data.payload as boolean);
        }
      );
    }
    dispatch(getBlogComment(searchParams.aiBlogId ?? searchParams.userBlogId));
  };

  const handleBack = () => {
    route.back();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      {/* Back button */}
      <View style={[styles.rowContainer, { width: "100%", paddingBottom: 20 }]}>
        <TouchableOpacity onPress={handleBack}>
          <Entypo name="chevron-small-left" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Divider
        orientation="vertical"
        width={1}
        style={{ borderColor: "white" }}
      />
      <View style={styles.scrollViewContent}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        {/* Status */}
        <View style={{ paddingTop: 20 }} />

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Divider
            orientation="vertical"
            width={1}
            style={{ borderColor: "#B9FF66" }}
          />
          {/* Actual description */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.description]}>
              <Text
                style={[
                  styles.description,
                  { color: "#B9FF66", fontWeight: "bold" },
                ]}
              >
                Description:{" "}
              </Text>
              {description}
            </Text>
          </View>
        </View>
        {/* Blog content (render from html) */}
        {/* <QuillRenderer dom={{ matchContents: true }} content={html} /> */}

        {searchParams.userBlogId && (
          <Divider
            orientation="vertical"
            width={1}
            style={{ borderColor: "white" }}
          />
        )}

        <Divider
          orientation="vertical"
          width={1}
          style={{ borderColor: "white" }}
        />
      </View>
      {/* Write comment button */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
    paddingBottom: 100,
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
    paddingTop: 20,
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
  statusContainer: {
    borderRadius: 25,
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 5,
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
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  commentWriteButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
