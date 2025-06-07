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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

import BlogCommenter from "@/components/blog/BlogCommenter";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  commentOnBlog,
  getAIBlogDetail,
  getBlogComment,
  getUserBlogDetail,
  setCommentAdded,
} from "@/redux/slices/blogSlice";
import {
  AIBlogSection,
  PostComment,
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
const mockHtml = `
<p>adsada</p><h1>adasdad</h1><ul><li>12313</li></ul><p class="ql-indent-3"><span style="color: rgb(240, 102, 102);">ádasadasda</span></p><pre class="ql-syntax" spellcheck="false">	asdasdsadad
sada
</pre><p>ádasdadab</p>
`;
const mockGroup = {
  name: "Group Name",
  image: "https://picsum.photos/200",
};

type Author = {
  // name: string;
  AvatarURL: string;
  Username: string;
  // streak: number;
};
const mockAuthor: Author = {
  // name: "FullName",
  AvatarURL: "https://picsum.photos/200",
  Username: "user_name",
  // streak: 120,
};
const mockTags: UserBlogTag[] = [
  { TagName: "Frontend", _id: "1" },
  { TagName: "Backend", _id: "2" },
  { TagName: "React", _id: "3" },
  { TagName: "Vue", _id: "4" },
  { TagName: "Angular", _id: "5" },
  { TagName: "Node", _id: "6" },
  { TagName: "Express", _id: "7" },
  { TagName: "MongoDB", _id: "8" },
  { TagName: "SQL", _id: "9" },
  { TagName: "GraphQL", _id: "10" },
];
type Commenter = {
  name: string;
  image: string;
  date: string;
  comment: string;
};
const mockCommenter: UserBlogComment = {
  User: {
    _id: "abc",
    UserName: "FullName",
    AvatarURL: "https://picsum.photos/200",
  },
  createdAt: new Date("18 Nov 2023"),
  updatedAt: new Date("18 Nov 2023"),
  Content:
    "I just tried this recipe and it was amazing! The instructions were clear and easy to follow, and the end result was delicious. I will definitely be making this again. Thanks for sharing!",
  _id: "123",
};
const mockComments = [
  mockCommenter,
  mockCommenter,
  mockCommenter,
  mockCommenter,
  mockCommenter,
];
const mockThumbnail = "https://picsum.photos/400";
const mockSections: AIBlogSection[] = [
  {
    Heading: "BetterStack Monitoring and Incident Management",
    Content: [
      {
        SubHeading: "Uptime Monitoring",
        Details:
          "BetterStack offers free usage of their uptime monitoring tools, allowing users to have up to 10 monitors and a status page, aiding in user trust during downtimes.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "",
      },
      {
        SubHeading: "Incident Management",
        Details:
          "The platform provides incident management tools, including incident silencing to reduce alert noise and Slack integration for direct incident resolution.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "",
      },
      {
        SubHeading: "Infrastructure Monitoring and Insights",
        Details:
          "BetterStack utilizes OpenTelemetry for native infrastructure monitoring, providing observability dashboards to analyze metrics and gather insights.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "",
      },
    ],
  },
  {
    Heading: "Key Features of Express 5",
    Content: [
      {
        SubHeading: "Async/Await Enhancements",
        Details:
          "Express 5 simplifies promise rejection handling by forwarding rejected promises to error-handling middleware.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "app.get('/data', async (req, res, next) => { try { const result = await fetchData(); res.send(result); } catch (err) { next(err); } });",
      },
      {
        SubHeading: "Route Matching Improvements",
        Details:
          "Improvements enhance security and clarity in route matching, including the removal of inline regex.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "app.get('/user(.*)', (req, res) => res.send('User'));",
      },
      {
        SubHeading: "Error Handling",
        Details:
          "Stricter enforcement of HTTP status codes improves error visibility and prevents silent failures.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "res.status(978).send('Invalid status');",
      },
      {
        SubHeading: "Body Parsing Enhancements",
        Details:
          "The updated configuration enhances security against deep nested objects while simplifying body parsing.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "app.use(express.urlencoded({ depth: 10 }));",
      },
      {
        SubHeading: "Removed Deprecated Features",
        Details:
          "Express 5 eliminates outdated methods, ensuring modern JavaScript compatibility.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "",
      },
      {
        SubHeading: "Long-Term Support",
        Details:
          "Express 5 requires Node.js 18 or higher, improving performance and longevity.",
        Source:
          "https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/",
        Code: "",
      },
    ],
  },
];

const mockUser = {
  _id: "testUserId",
  UserName: "John Doe",
  AvatarURL:
    "https://images.unsplash.com/photo-1502685104226-e9df14d4d9f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjE3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400",
};

const mockContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const mockCreatedAt = new Date();
const mockUserBlogComment = {
  _id: "testCommentId",
  User: mockUser,
  Content: mockContent,
  createdAt: mockCreatedAt,
} as UserBlogComment;
const mockUserBlogCommentList = [
  mockUserBlogComment,
  mockUserBlogComment,
  mockUserBlogComment,
];

export default function CommentBlogScreen() {
  const searchParams = useLocalSearchParams<{
    blogId: string;
    commentId: string;
  }>();
  // if (searchParams.aiBlogId) {

  const dispatch = useAppDispatch();
  const {
    currentAIBlog,
    currentUserBlog,
    currentBlogComments,
    isCurrentBlogSaved,
  } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);
  // Post comment
  const [postComment, setPostComment] = useState("");
  const [commentText, setCommentText] = useState("");
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    dispatch(getBlogComment(searchParams.blogId));
  }, []);

  useEffect(() => {
    if (currentBlogComments.length != 0 && searchParams.commentId != undefined && searchParams.commentId != "") {
      currentBlogComments.forEach((value, index) => {
        if (value._id == searchParams.commentId) {
          flatListRef.current?.scrollToIndex({ animated: true, index: index })
          return
        }
      })
    }
  }, [currentBlogComments, searchParams.commentId])

  // // Handle keyboard events
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       // Scroll to the bottom when keyboard shows
  //       scrollViewRef.current?.scrollToEnd({ animated: true });
  //     }
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh

    dispatch(getBlogComment(searchParams.blogId));
  };

  const handleInputUserComment = (val: string) => {
    setPostComment(val);
  };
  const handlePostUserComment = () => {
    const comment: PostComment = {
      UserID: user._id,
      BlogID: currentUserBlog._id,
      Content: postComment,
      Method: "Post",
    };
    dispatch(commentOnBlog(comment)).then((res) => {
      if (res.payload === true) {
        dispatch(getBlogComment(searchParams.blogId));

        setPostComment("");
        setIsWriteComment(false);

        dispatch(setCommentAdded(true));
      }
    });
  };
  const handleReplyPosted = () => {
    console.log("Reply posted");
    // dispatch(getBlogComment(searchParams.blogId));
  };
  useEffect(() => {
    console.log(`Current blog saved: ${isCurrentBlogSaved}`);
  }, [isCurrentBlogSaved]);

  const [isWriteComment, setIsWriteComment] = useState(false);

  return (
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Add this line
      style={{ flex: 1 }}
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
                <Image
                  style={styles.avatar}
                  source={{ uri: mockUser.AvatarURL }}
                />
                {/* name and date */}
                <View>
                  <View>
                    <Text style={styles.name}>Username</Text>
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
              onChangeText={handleInputUserComment}
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
      </View>
      <View style={{ flex: 1, backgroundColor: "#1E1E1E", position: "fixed" }}>
        <FlatList
          ref={flatListRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={currentBlogComments}
          keyExtractor={(item, index) => item._id + index}
          renderItem={({ item }) => (
            <BlogCommenter
              {...item}
              replies={item.ChildrenComments}
              onReplyPosted={handleReplyPosted}
            />
          )}
          style={[styles.flatListContainer]}
          contentContainerStyle={[styles.contentContainer]}
          ListFooterComponent={<View style={{ height: 20 }}></View>}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </View>
    </View>
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
