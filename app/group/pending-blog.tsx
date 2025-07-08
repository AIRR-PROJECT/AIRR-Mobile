// This blog is in group only (it in pending state : (approved or rejected))
import { AntDesign, Entypo, FontAwesome6, Fontisto } from "@expo/vector-icons";
import { Divider } from "@rneui/base";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { Image } from "expo-image";
import { AIBlogSection, UserBlogDetail, UserBlogGroup, UserBlogTag } from "@/interfaces/blogInterface";
import BlogAuthorComponent from "@/components/blog/BlogAuthorComponent";
import BlogTagButton from "@/components/blog/BlogTagButton";
import QuillRenderer from "@/components/dom-components/QuillRenderer/QuillRenderer";
import { useEffect, useState } from "react";
import { getUserBlogDetail } from "@/redux/slices/blogSlice";
import { useAppDispatch } from "@/redux/hook";
import { approveBlog, rejectBlog } from "@/redux/slices/groupSlice";

const mockHtml = `
<p>adsada</p><h1>adasdad</h1><ul><li>12313</li></ul><p class="ql-indent-3"><span style="color: rgb(240, 102, 102);">ádasadasda</span></p><pre class="ql-syntax" spellcheck="false">	asdasdsadad
sada
</pre><p>ádasdadab</p>
`;
const mockGroup: UserBlogGroup = {
  _id: "",
  CoverURL: "",
  Name: "",
  NumberOfMembers: 0,
  Description: ""
};

type Author = {
  _id: string;
  Name: string;
  AvatarURL: string;
  Username: string;
  CreateDate: string
};
const mockAuthor: Author = {
  // name: "FullName",
  AvatarURL: "https://picsum.photos/200",
  Username: "user_name",
  _id: "",
  Name: "",
  CreateDate: ""
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

export default function PendingBlogInGroup() {
  const dispatch = useAppDispatch()
  const { blogID } = useLocalSearchParams<{ blogID: string }>()

  const [title, setTitle] = useState("Mock description");
  const [description, setDescription] = useState("Mock description");
  const [thumbnail, setThumbnail] = useState(mockThumbnail);
  const [author, setAuthor] = useState(mockAuthor);
  const [tags, setTags] = useState(mockTags);
  const [group, setGroup] = useState(mockGroup);
  const [html, setHtml] = useState(mockHtml);

  const route = useRouter();
  const handleBack = () => {
    route.back();
  };
  const handleApprove = () => {
    dispatch(approveBlog({ groupID: group._id, blogIDToApprove: blogID, blogOwnerID: author._id })).then(res => {
      if (res.payload === true) {
        console.log("Approve blog");
        router.dismiss()
      }
    })
  };
  const handleReject = () => {
    dispatch(rejectBlog({ groupID: group._id, blogIDToReject: blogID, blogOwnerID: author._id })).then(res => {
      if (res.payload === true) {
        console.log("Reject blog");
        router.dismiss()
      }
    })
  };

  useEffect(() => {
    if (blogID) {
      dispatch(getUserBlogDetail(blogID)).then((res) => {
        const data = res.payload as UserBlogDetail

        setTitle(data.Title)
        setDescription(data.Description)
        setThumbnail(data.BackgroundURL)
        setAuthor(data.Author)
        setTags(data.Tags)
        setGroup(data.Group)
        setHtml(data.Content)
      })
    }
  }, [blogID])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <View style={[styles.rowContainer, { width: "100%", paddingBottom: 20 }]}>
        <TouchableOpacity onPress={handleBack}>
          <Entypo name="chevron-small-left" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApprove}
            activeOpacity={0.7}
          >
            <AntDesign name="checkcircle" size={14} color="black" />
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            activeOpacity={0.7}
          >
            <AntDesign name="closecircle" size={14} color="black" />
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Divider
        orientation="vertical"
        width={1}
        style={{ borderColor: "white" }}
      />
      <View style={styles.scrollViewContent}>
        {/* Group Component */}
        <View style={styles.groupContainer}>
          <Image source={group.CoverURL} style={styles.groupImage} />
          <Text style={styles.groupName}>{group.Name}</Text>
        </View>
        {/* User Component */}
        {<BlogAuthorComponent  {...author} />}
        {/* Title */}
        <Text style={styles.title}>
          {title}
        </Text>

        {/* Blog in need of approval has no  */}
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

        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <BlogTagButton title={tag.TagName} key={tag._id + index} /> // may change key in the future
          ))}
        </View>

        {/* Thumbnail */}

        <Image
          source={thumbnail}
          style={{ width: "100%", height: 200, borderRadius: 20 }}
          contentFit="cover"
          transition={1000}
        />

        {/* Blog content (render from html) */}
        <QuillRenderer dom={{ matchContents: true }} content={html} />

        {/* <Divider
          orientation="vertical"
          width={1}
          style={{ borderColor: "white" }}
        /> */}
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

  approveButton: {
    backgroundColor: "#B9FF66",
    padding: 15,
    paddingBlock: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#FF6E6E",
    padding: 15,
    paddingBlock: 10,
    borderRadius: 20,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
});
