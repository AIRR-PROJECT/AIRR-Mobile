import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { useEffect, useRef, useState } from "react";
import {
  Entypo,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import BlogAuthorComponent from "@/components/blog/BlogAuthorComponent";
import BlogTagButton from "@/components/blog/BlogTagButton";
import { ThemedText } from "@/components/ThemedText";
import BlogCommenter from "@/components/blog/BlogCommenter";
import QuillRenderer from "@/components/dom-components/QuillRenderer/QuillRenderer";
import * as SplashScreen from "expo-splash-screen";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
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
  unsaveBlog,
} from "@/redux/slices/blogSlice";
import {
  AIBlogSection,
  UserBlogComment,
  UserBlogTag,
} from "@/interfaces/blogInterface";
import {
  getUserBlogDislikeActivities,
  getUserBlogLikeActivities,
  getUserBlogSaveActivities,
} from "@/redux/slices/authSlice";
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

export default function BlogScreen() {
  const searchParams = useLocalSearchParams<{
    aiBlogId: string;
    userBlogId: string;
  }>();
  // if (searchParams.aiBlogId) {

  const { width } = useWindowDimensions();
  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    currentAIBlog,
    currentUserBlog,
    currentBlogComments,
    isCurrentBlogLiked,
    isCurrentBlogDisliked,
    isCurrentBlogSaved,
  } = useAppSelector((state) => state.blog);

  // Shared properties
  const [title, setTitle] = useState("Mock description");
  const [description, setDescription] = useState("Mock description");
  const [thumbnail, setThumbnail] = useState(mockThumbnail);
  // AI blog properties
  const [sections, setSections] = useState(mockSections);
  const [conclusion, setConclusion] = useState("This is concluded.");
  // User blog properties
  const [author, setAuthor] = useState(mockAuthor);
  const [tags, setTags] = useState(mockTags);
  const [likes, setLikes] = useState(123);
  const [dislikes, setDislikes] = useState(123);
  const [comments, setComments] = useState(123);
  const [html, setHtml] = useState(mockHtml);
  const [commentsDetail, setCommentsDetail] = useState(mockComments);
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (searchParams.aiBlogId) {
      dispatch(getAIBlogDetail(searchParams.aiBlogId));
    } else {
      dispatch(getUserBlogDetail(searchParams.userBlogId));
      dispatch(getUserBlogLikeActivities(searchParams.userBlogId));
      dispatch(getUserBlogDislikeActivities(searchParams.userBlogId));
      dispatch(getUserBlogSaveActivities(searchParams.userBlogId));
    }
    dispatch(getBlogComment(searchParams.aiBlogId ?? searchParams.userBlogId));
  }, []);

  useEffect(() => {
    if (currentAIBlog) {
      setTitle(currentAIBlog.Title);
      setDescription(currentAIBlog.Description);
      setSections(currentAIBlog.Sections);
      setConclusion(currentAIBlog.Conclusion);
    }
  }, [currentAIBlog]);

  useEffect(() => {
    if (currentUserBlog) {
      setTitle(currentUserBlog.Title);
      setDescription(currentUserBlog.Description);
      setThumbnail(currentUserBlog.BackgroundURL);
      setTags(currentUserBlog.Tags);
      setAuthor(currentUserBlog.Author);
      setLikes(currentUserBlog.Reaction.Likes);
      setDislikes(currentUserBlog.Reaction.Dislikes);
      setComments(currentUserBlog.Reaction.Comments);
      setHtml(currentUserBlog.Content);
    }
  }, [currentUserBlog]);

  useEffect(() => {
    setCommentsDetail(currentBlogComments);
  }, [currentBlogComments]);

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
      dispatch(getUserBlogLikeActivities(searchParams.userBlogId));
      dispatch(getUserBlogDislikeActivities(searchParams.userBlogId));
      dispatch(getUserBlogSaveActivities(searchParams.userBlogId));
    }
    dispatch(getBlogComment(searchParams.aiBlogId ?? searchParams.userBlogId));
  };

  const handleBack = () => {
    route.back();
  };
  const handleLike = () => {
    console.log("Pressed Like button");

    if (isCurrentBlogLiked) {
      dispatch(removeLikeBlog(searchParams.userBlogId)).then(() => {
        setLikes(likes - 1);
      });
    } else {
      if (isCurrentBlogDisliked) {
        dispatch(dislikeToLikeBlog(searchParams.userBlogId)).then(() => {
          setLikes(likes + 1);
          setDislikes(dislikes - 1);
        });
      } else {
        dispatch(likeBlog(searchParams.userBlogId)).then(() => {
          setLikes(likes + 1);
        });
      }
    }
  };
  const handleDislike = () => {
    console.log("Pressed Dislike button");

    if (isCurrentBlogDisliked) {
      dispatch(removeDislikeBlog(searchParams.userBlogId)).then(() => {
        setDislikes(dislikes - 1);
      });
    } else {
      if (isCurrentBlogLiked) {
        dispatch(likeToDislikeBlog(searchParams.userBlogId)).then(() => {
          setDislikes(dislikes + 1);
          setLikes(likes - 1);
        });
      } else {
        dispatch(dislikeBlog(searchParams.userBlogId)).then(() => {
          setDislikes(dislikes + 1);
        });
      }
    }
  };
  const handleBookmark = () => {
    console.log("Pressed Bookmark");

    if (isCurrentBlogSaved) {
      dispatch(unsaveBlog(searchParams.userBlogId));
    } else {
      dispatch(saveBlog(searchParams.userBlogId));
    }
  };

  useEffect(() => {
    console.log(`Current blog saved: ${isCurrentBlogSaved}`);
  }, [isCurrentBlogSaved]);

  const flatListRef = useRef<FlatList>(null);

  return (
    <FlatList
      ref={flatListRef}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      data={currentBlogComments}
      keyExtractor={(item, index) => item._id + index}
      renderItem={({ item }) => (
        <BlogCommenter {...item} replies={mockUserBlogCommentList} />
      )}
      style={styles.flatListContainer}
      contentContainerStyle={styles.contentContainer}
      ListFooterComponent={<View style={{ height: 20 }}></View>}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Back button */}
          <View
            style={[styles.rowContainer, { width: "100%", paddingBottom: 20 }]}
          >
            <TouchableOpacity onPress={handleBack}>
              <Entypo name="chevron-small-left" size={30} color="white" />
            </TouchableOpacity>
            <Fontisto name="more-v-a" size={30} color="white" />
          </View>
          <Divider
            orientation="vertical"
            width={1}
            style={{ borderColor: "white" }}
          />
          <View style={styles.scrollViewContent}>
            {/* Group Component */}
            <View style={styles.groupContainer}>
              <Image source={mockGroup.image} style={styles.groupImage} />
              <Text style={styles.groupName}>{mockGroup.name}</Text>
            </View>
            {/* User Component */}
            {searchParams.userBlogId && <BlogAuthorComponent {...author} />}
            {/* Title */}
            <Text style={styles.title}>{title}</Text>
            {/* Date and number of comment */}
            <View style={styles.additionalInfo}>
              {/* Date */}
              <View style={styles.dateAndComment}>
                <FontAwesome6 name="clock" size={24} color="#C2C2C2" />
                <Text style={styles.smallText}>
                  {commentsDetail && commentsDetail.length > 0
                    ? new Date(commentsDetail[0].createdAt).toDateString()
                    : "No records"}
                </Text>
              </View>
              {/* Number of comment */}
              <View style={styles.dateAndComment}>
                <MaterialIcons name="comment" size={24} color="#C2C2C2" />
                <Text style={styles.smallText}>{comments} Comments</Text>
              </View>
            </View>
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
            {/* List of tags */}
            {searchParams.userBlogId && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <BlogTagButton title={tag.TagName} key={tag._id + index} /> // may change key in the future
                ))}
              </View>
            )}

            {/* Thumbnail */}
            {searchParams.userBlogId && (
              <Image
                source={thumbnail}
                style={{ width: "100%", height: 200, borderRadius: 20 }}
                contentFit="cover"
                transition={1000}
              />
            )}
            {/* Blog content (render from html) */}
            <QuillRenderer dom={{ matchContents: true }} content={html} />

            {searchParams.userBlogId && (
              <Divider
                orientation="vertical"
                width={1}
                style={{ borderColor: "white" }}
              />
            )}
            {/* Like, Dislike, Comment, Markbook */}
            {searchParams.userBlogId && (
              <View style={styles.interactSection}>
                {/* Likes */}
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={
                      isCurrentBlogLiked
                        ? styles.likeContainerYes
                        : styles.likeContainerNo
                    }
                    onPress={handleLike}
                  >
                    <FontAwesome
                      name="thumbs-up"
                      size={24}
                      color={isCurrentBlogLiked ? "#000" : "#fff"}
                    />
                    <ThemedText
                      style={{ color: isCurrentBlogLiked ? "#000" : "#fff" }}
                      type="default"
                      lightColor="#fff"
                      darkColor="#fff"
                    >
                      {likes}
                    </ThemedText>
                  </TouchableOpacity>
                  {/* Dislikes */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={
                      isCurrentBlogDisliked
                        ? styles.dislikeContainerYes
                        : styles.dislikeContainerNo
                    }
                    onPress={handleDislike}
                  >
                    <FontAwesome
                      name="thumbs-down"
                      size={24}
                      color={isCurrentBlogDisliked ? "#000" : "#fff"}
                    />
                    {/* <ThemedText
                      style={styles.text}
                      type="default"
                      lightColor="#fff"
                      darkColor="#fff">
                      123
                    </ThemedText> */}
                  </TouchableOpacity>
                </View>
                {/* Comment */}
                <View style={styles.commentContainer}>
                  <MaterialIcons name="comment" size={28} color="#fff" />
                  <ThemedText
                    style={{ color: "#fff" }}
                    type="default"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    {comments}
                  </ThemedText>
                </View>
                {/* Bookmart Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={
                    isCurrentBlogSaved
                      ? styles.bookmarkContainerYes
                      : styles.bookmarkContainerNo
                  }
                  onPress={handleBookmark}
                >
                  <FontAwesome
                    name="bookmark"
                    size={24}
                    color={isCurrentBlogSaved ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
            )}
            <Divider
              orientation="vertical"
              width={1}
              style={{ borderColor: "white" }}
            />
            {/* Other user comments */}
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.commentButtonContainer}
              >
                <Text style={styles.commentText}>Write a comment...</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Write comment button */}
        </View>
      }
    />
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
});
