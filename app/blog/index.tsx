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
import { green } from "react-native-reanimated/lib/typescript/Colors";
import BlogStatusComponent from "@/components/blog/BlogStatusComponent";
const mockHtml = `
<p>adsada</p><h1>adasdad</h1><ul><li>12313</li></ul><p class="ql-indent-3"><span style="color: rgb(240, 102, 102);">ádasadasda</span></p><pre class="ql-syntax" spellcheck="false">	asdasdsadad
sada
</pre><p>ádasdadab</p>
`;
const mockGroup: UserBlogGroup = {
  _id: "",
  CoverURL: "https://picsum.photos/200",
  Name: "Group Name",
  NumberOfMembers: 0,
  Description: "",
};

type Author = {
  _id: string;
  Name: string;
  AvatarURL: string;
  Username: string;
  CreateDate: string
  // streak: number;
};
const mockAuthor: Author = {
  _id: "",
  Name: "FullName",
  AvatarURL: "https://picsum.photos/200",
  Username: "user_name",
  CreateDate: "",
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
  const [thumbnail, setThumbnail] = useState(mockThumbnail);
  // AI blog properties
  const [sections, setSections] = useState(mockSections);
  const [conclusion, setConclusion] = useState("This is concluded.");
  // User blog properties
  const [author, setAuthor] = useState(mockAuthor);
  const [tags, setTags] = useState(mockTags);
  const [group, setGroup] = useState(mockGroup);
  const [status, setStatus] = useState<BlogStatus>(BlogStatus.ACTIVE)
  const [viewType, setViewType] = useState<string>(BlogViewType.IN_GROUP)
  const reactTimeout = 500;
  const [likes, setLikes] = useState(123);
  const [dislikes, setDislikes] = useState(123);
  const [comments, setComments] = useState(123);
  const [blogLiked, setBlogLiked] = useState<boolean>(false);
  const [blogDisliked, setBlogDisliked] = useState<boolean>(false);
  const [blogSaved, setBlogSaved] = useState<boolean>(false);
  const [html, setHtml] = useState(mockHtml);
  const [commentsDetail, setCommentsDetail] = useState(mockComments);
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
      console.log(currentUserBlog)
      setTitle(currentUserBlog.Title);
      setDescription(currentUserBlog.Description);
      setThumbnail(currentUserBlog.BackgroundURL);
      setGroup(currentUserBlog.Group)
      setTags(currentUserBlog.Tags);
      setAuthor(currentUserBlog.Author);
      setViewType(currentUserBlog.ViewType)
      setStatus(currentUserBlog.Status)
      setLikes(currentUserBlog.Reaction.Likes);
      setDislikes(currentUserBlog.Reaction.Dislikes);
      setComments(currentUserBlog.Reaction.Comments);
      setHtml(currentUserBlog.Content);
      setIsUserWrittenBlog(user._id == currentUserBlog.Author._id);
    }
  }, [currentUserBlog]);

  useEffect(() => {
    setCommentsDetail(currentBlogComments);
  }, [currentBlogComments]);

  useEffect(() => {
    if (
      currentBlogComments != null &&
      currentBlogComments != undefined &&
      currentBlogComments.length != 0 &&
      searchParams.userBlogCommentId != undefined &&
      searchParams.userBlogCommentId != ""
    )
      route.push(
        `/blog/comment-page?blogId=${searchParams.userBlogId}&commentId=${searchParams.userBlogCommentId}`
      );
  }, [currentBlogComments, searchParams.userBlogCommentId]);

  useEffect(() => {
    console.log(`Comment added: ${commentAdded}`);
    if (commentAdded) {
      setComments(comments + 1);

      dispatch(setCommentAdded(false));
    }
  }, [commentAdded]);

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

  const handleLike = () => {
    if (blogLiked) {
      setLikes(likes - 1);

      setBlogLiked(false);

      dispatch(removeLikeBlog(searchParams.userBlogId));
    } else {
      if (blogDisliked) {
        setLikes(likes + 1);
        setDislikes(dislikes - 1);

        setBlogLiked(true);
        setBlogDisliked(false);

        dispatch(dislikeToLikeBlog(searchParams.userBlogId));
      } else {
        setLikes(likes + 1);

        setBlogLiked(true);

        dispatch(likeBlog(searchParams.userBlogId));
      }
    }
  };
  const handleDislike = () => {
    if (blogDisliked) {
      setDislikes(dislikes - 1);

      setBlogDisliked(false);

      dispatch(removeDislikeBlog(searchParams.userBlogId));
    } else {
      if (blogLiked) {
        setDislikes(dislikes + 1);
        setLikes(likes - 1);

        setBlogLiked(false);
        setBlogDisliked(true);

        dispatch(likeToDislikeBlog(searchParams.userBlogId));
      } else {
        setDislikes(dislikes + 1);

        setBlogDisliked(true);

        dispatch(dislikeBlog(searchParams.userBlogId));
      }
    }
  };
  const handleBookmark = () => {
    if (blogSaved) {
      dispatch(unsaveBlog(searchParams.userBlogId));

      setBlogSaved(false);
    } else {
      dispatch(saveBlog(searchParams.userBlogId));

      setBlogSaved(true);
    }
  };

  const debounceHandleLike = debounce(() => {
    handleLike();
  }, 0.5);

  const debounceHandleDislike = debounce(() => {
    handleDislike();
  }, 0.5);

  const debounceHandleBookmark = debounce(() => {
    handleBookmark();
  }, 0.5);

  const handleOnPressGroup = () => {
    router.push(`/group?groupId=${currentUserBlog.Group._id}`)
  }

  useEffect(() => {
    console.log(`Current blog saved: ${isCurrentBlogSaved}`);
  }, [isCurrentBlogSaved]);

  const [isWriteComment, setIsWriteComment] = useState(false);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);

  const handleCommentPress = () => {
    route.push(`/blog/comment-page?blogId=${searchParams.userBlogId}`);
  };
  // print the blog id for me to test
  useEffect(() => {
    console.log(`Blog ID: ${searchParams.userBlogId}`);
  }, [searchParams.userBlogId]);

  const refMoreSheet = useRef<BottomSheet>(null);
  // callbacks
  const handleSnapPress = useCallback((index: any) => {
    refMoreSheet.current?.snapToIndex(index);
  }, []);

  const handleHideBlog = () => {
    router.back()
    router.setParams({
      blogIdToRemove: currentUserBlog._id
    })
  }
  const handleDeleteBlog = () => {
    router.back()
    router.setParams({
      blogIdToRemove: currentUserBlog._id
    })
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <View
          style={[styles.rowContainer, { width: "100%", paddingBottom: 20 }]}
        >
          <TouchableOpacity onPress={handleBack}>
            <Entypo name="chevron-small-left" size={30} color="white" />
          </TouchableOpacity>
          {!searchParams.aiBlogId && (
            <TouchableOpacity onPress={() => handleSnapPress(0)}>
              <Fontisto name="more-v-a" size={30} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <Divider
          orientation="vertical"
          width={1}
          style={{ borderColor: "white" }}
        />
        <View style={styles.scrollViewContent}>
          {/* Group Component */}
          {viewType == BlogViewType.IN_GROUP && group && searchParams.userBlogId && 
            <TouchableOpacity style={styles.groupContainer} onPress={handleOnPressGroup}>
              <Image source={group.CoverURL} style={styles.groupImage} />
              <Text style={styles.groupName}>{group.Name}</Text>
            </TouchableOpacity>
          }
          <View style={{paddingTop : 20}}/>
          {/* User Component */}
          {searchParams.userBlogId && <BlogAuthorComponent {...author} />}
          {/* Title */}
          <Text style={styles.title}>{title}</Text>
          {/* Status */}
          {/* TODO: Send status here */}
          <BlogStatusComponent status={status} />
          <View style={{paddingTop : 20}}/>
          {/* Date and number of comment */}
          <View style={styles.additionalInfo}>
            {/* Date */}
            <View style={styles.dateAndComment}>
              <FontAwesome6 name="clock" size={24} color="#C2C2C2" />
              <Text style={styles.smallText}>
                {/* Why this is commentDetail time, not blog createdAt time */}
                {/* {commentsDetail && commentsDetail.length > 0
                  ? formatDistanceToNow(new Date(commentsDetail[0].createdAt), {
                      addSuffix: true,
                    })
                  : "No records"} */}
                {new Date(author.CreateDate).toDateString()}
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
                    blogLiked ? styles.likeContainerYes : styles.likeContainerNo
                  }
                  onPress={debounceHandleLike}
                >
                  <FontAwesome
                    name="thumbs-up"
                    size={24}
                    color={blogLiked ? "#000" : "#fff"}
                  />
                  <ThemedText
                    style={{ color: blogLiked ? "#000" : "#fff" }}
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
                    blogDisliked
                      ? styles.dislikeContainerYes
                      : styles.dislikeContainerNo
                  }
                  onPress={debounceHandleDislike}
                >
                  <FontAwesome
                    name="thumbs-down"
                    size={24}
                    color={blogDisliked ? "#000" : "#fff"}
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
              <TouchableOpacity
                style={styles.commentContainer}
                activeOpacity={0.7}
                onPress={handleCommentPress}
              >
                <MaterialIcons name="comment" size={28} color="#fff" />
                <ThemedText
                  style={{ color: "#fff" }}
                  type="default"
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  {comments}
                </ThemedText>
              </TouchableOpacity>
              {/* Bookmart Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={
                  isCurrentBlogSaved
                    ? styles.bookmarkContainerYes
                    : styles.bookmarkContainerNo
                }
                onPress={debounceHandleBookmark}
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
        </View>
        {/* Write comment button */}
      </ScrollView>
      {/* Bottom sheet for more button */}
      {searchParams.userBlogId && currentUserBlog && (
        <MoreOptionBottomList
          sheetRef={refMoreSheet}
          isUserWrittenBlog={isUserWrittenBlog}
          blogId={currentUserBlog._id}
          groupId={currentUserBlog.Group ? currentUserBlog.Group._id : undefined}
          isFromDetail={true}
          isBlogStatusPendingOrActive={currentUserBlog.Status == BlogStatus.ACTIVE || currentUserBlog.Status == BlogStatus.PENDING}
          isUserStatusPending={currentUserBlog.UserGroupStatus == "Pending"}
          isViewTypePrivateOrInProfile={currentUserBlog.ViewType != BlogViewType.IN_GROUP}
          handleHideThisBlog={handleHideBlog}
          handleDeleteThisBlog={handleDeleteBlog}/>
      )}
    </GestureHandlerRootView>
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
    alignSelf: 'flex-start',
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
