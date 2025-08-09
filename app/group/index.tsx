import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { memo, useEffect, useRef, useState } from "react";
import GroupPageContent from "@/components/group/GroupPageContent";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "@/components/tabs/feed/FeedBlogPreview";
import { SectionGrid } from "react-native-super-grid";
import ParallaxFlatList from "@/components/ParallaxFlatList";
import { UserBlog } from "@/interfaces/blogInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getGroupBlogsByID,
  getGroupTagsByID,
  setGroupBlogsSearchText,
  setGroupTagsSearchText,
} from "@/redux/slices/groupSlice";
import { useLocalSearchParams } from "expo-router";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "@/redux/api/queryClient";
import { GroupTag } from "@/interfaces/groupInterface";
import { FontAwesome6 } from "@expo/vector-icons";
import { Divider } from "@rneui/base";
import GroupBlogPreview from "@/components/group/GroupBlogPreview";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import GroupMoreOptionBottomList from "@/components/group/GroupMoreOptionBottomList";
// const mockBlog = {
//   Title: "How to fix clipboard if it isn’t working",
//   BackgroundURL:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
//   Description: "Blog Description",
//   content: loremIpsum({ count: 50, units: "paragraphs" }),
//   timestamp: new Date().toISOString(),
//   Author: {
//     name: "Name of the Author",
//     avatar:
//       "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
//     email: "sample_email@gmail.com",
//     phoneNumber: "1234567890",
//     location: "Location",
//     bio: "Bio",
//     socials: [],
//     groups: [],
//     blogs: [],
//   },
//   Tags: ["Frontend", "Backend", "React", "NodeJS", "Express"],
// };
// const Data = Array(10).fill(mockBlog);
// const mockTags = [
//   { id: "a", data: ["Artificial Intelligence", "Agile", "Android", "AWS"] },
//   { id: "b", data: ["Blockchain", "Bootstrap", "Babel", "Bitbucket"] },
//   { id: "c", data: ["C++", "CSS", "C#", "CI/CD", "Cloud Computing"] },
//   { id: "d", data: ["Docker", "Django", "Dart", "DNS", "Data Science"] },
//   {
//     id: "e",
//     data: ["Ethereum", "Elixir", "Express.js", "Electron", "ECMAScript"],
//   },
//   { id: "f", data: ["Firebase", "Flutter", "Figma", "FastAPI", "F#"] },
//   { id: "g", data: ["Git", "Go", "GraphQL", "Gatsby", "GCP"] },
//   { id: "h", data: ["HTML", "Heroku", "Hibernate", "Hadoop", "HTTP"] },
//   { id: "i", data: ["IoT", "iOS", "InVision", "Infrastructure", "Ionic"] },
//   { id: "j", data: ["JavaScript", "Java", "Jenkins", "Jest", "JQuery"] },
//   { id: "k", data: ["Kubernetes", "Kafka", "Kotlin", "Knex.js", "Kivy"] },
//   { id: "l", data: ["Linux", "Laravel", "Lua", "Load Balancer", "Logstash"] },
//   {
//     id: "m",
//     data: ["MongoDB", "MySQL", "Machine Learning", "Markdown", "MUI"],
//   },
//   { id: "n", data: ["Node.js", "Next.js", "NestJS", "Nginx", "NoSQL"] },
//   { id: "o", data: ["OpenAI", "OAuth", "OpenCV", "OpenGL", "Objective-C"] },
//   { id: "p", data: ["Python", "PostgreSQL", "PHP", "Perl", "Pandas"] },
//   { id: "q", data: ["Quantum Computing", "QML", "QUnit", "Qlik", "Quasar"] },
//   { id: "r", data: ["React", "Redis", "Rust", "Ruby", "Redux"] },
//   { id: "s", data: ["SQL", "Sass", "Spring Boot", "Scala", "Swift"] },
//   {
//     id: "t",
//     data: ["TypeScript", "Tailwind CSS", "TensorFlow", "Terraform", "Tauri"],
//   },
//   { id: "u", data: ["Unity", "Ubuntu", "UI/UX", "Unreal Engine", "UML"] },
//   { id: "v", data: ["Vue.js", "Vite", "Vercel", "VS Code", "Vagrant"] },
//   { id: "w", data: ["WebAssembly", "Webpack", "WebRTC", "WordPress", "Web3"] },
//   { id: "x", data: ["Xamarin", "XML", "Xcode", "XSS", "XAMPP"] },
//   { id: "y", data: ["YAML", "Yarn", "YouTube API", "YAGNI"] },
//   { id: "z", data: ["Zig", "Zustand", "Zod", "Zookeeper", "Zigbee"] },
// ];

export default function GroupPage() {

  const { groupId, memberIDNotif, tagIDNotif } = useLocalSearchParams<{
    groupId: string;
    blogIdToRemove: string;
    memberIDNotif: string
    tagIDNotif: string
  }>();
  const { userCurrentGroupRole } = useAppSelector((state) => state.user);
  const { groupBlogsSearchText, groupTagsSearchText } = useAppSelector(
    (state) => state.group
  );

  const [selectedId, setSelectedId] = useState(1);
  const [tags, setTags] = useState<{ id: string; data: GroupTag[] }[]>([]);

  const [blogPage, setBlogPage] = useState(1);
  const [displayBlogs, setDisplayBlogs] = useState<UserBlog[]>([]);
  const [displayTags, setDisplayTags] = useState<
    { id: string; data: GroupTag[] }[]
  >([]);
  
  const sheetRef = useRef(null);
  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.contentStyle}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1}}
        showsVerticalScrollIndicator={false}
      >
        <GroupPageContent
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          groupID={groupId}
          sheetRef={sheetRef}
          memberIDNotif={memberIDNotif}
          tagIDNotif={tagIDNotif}
          // setSelectedBlogFilter={setSelectedBlogFilter}
          // setSelectedTagFilter={setSelectedTagFilter}
          // selectedBlogFilter={selectedBlogFilter}
          // selectedTagFilter={selectedTagFilter}
        />
      </ScrollView>
      <GroupMoreOptionBottomList
        sheetRef={sheetRef}
        groupID={groupId}
        userRole={userCurrentGroupRole}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  list: {},
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
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 9999,
  },
  textInput: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
  },
  textInputContainer: {
    paddingTop: 20,
  },
  gridView: {
    flex: 1,
    paddingBottom: 40,
  },
  contentStyle: {
    flex: 1,
    padding: 20,
  },
});
