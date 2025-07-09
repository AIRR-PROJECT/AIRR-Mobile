import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
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
import BlogMoreOptionBottomList from "@/components/group/BlogMoreOptionBottomList";
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
  const dispatch = useAppDispatch();

  const { groupId, blogIdToRemove } = useLocalSearchParams<{
    groupId: string;
    blogIdToRemove: string;
  }>();
  const { user, userCurrentGroupRole } = useAppSelector((state) => state.user);
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

  useEffect(() => {
    // Reset saved search bar state
    dispatch(setGroupBlogsSearchText(""));
    dispatch(setGroupTagsSearchText(""));

    dispatch(
      getGroupTagsByID({
        groupID: groupId,
      })
    ).then((res) => {
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
      setTags(categorizedTagsList);
    });
  }, []);

  // Filter blogs search result
  useEffect(() => {
    if (groupBlogsSearchText) {
      if (selectedId == 1) {
        const data = JSON.parse(
          JSON.stringify(groupBlogsQuery.data)
        ) as UserBlog[];
        data.forEach((item) => {
          const title = item.Title;

          if (
            !title.toLowerCase().includes(groupBlogsSearchText.toLowerCase())
          ) {
            data.splice(data.indexOf(item));
          }
        });

        setDisplayBlogs(data);
      }
    } else {
      setDisplayBlogs(groupBlogsQuery.data as UserBlog[]);
    }
  }, [groupBlogsSearchText]);

  // Filter tags search result
  useEffect(() => {
    if (groupTagsSearchText) {
      if (selectedId == 2) {
        const data = JSON.parse(JSON.stringify(tags)) as {
          id: string;
          data: GroupTag[];
        }[];
        data.forEach((item) => {
          item.data.forEach((inner_item) => {
            if (
              !inner_item.TagName.toLowerCase().includes(
                groupTagsSearchText.toLowerCase()
              )
            ) {
              item.data.splice(item.data.indexOf(inner_item));
            }
          });

          if (item.data.length == 0) {
            data.splice(data.indexOf(item));
          }
        });

        setDisplayTags(data);
      }
    } else {
      setDisplayTags(tags);
    }
  }, [groupTagsSearchText]);

  const groupBlogsQuery = useQuery({
    queryKey: ["feed-group-blogs"],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(
        getGroupBlogsByID({
          groupID: groupId,
          userID: user._id,
          page: blogPage,
        })
      );

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
      const moreFetchedBlogs = await dispatch(
        getGroupBlogsByID({
          groupID: groupId,
          userID: user._id,
          page: blogPage,
        })
      );

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
      const refetchedBlog = await dispatch(
        getGroupBlogsByID({
          groupID: groupId,
          userID: user._id,
          page: 1,
        })
      );

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
    setDisplayBlogs(groupBlogsQuery.data as UserBlog[]);
  }, [groupBlogsQuery.data]);

  useEffect(() => {
    setDisplayTags(tags);
  }, [tags]);

  // Handle hiding or deleting blog while viewing that blog
  useEffect(() => {
    if (blogIdToRemove) {
      console.log(`blogIdToRemove: ${blogIdToRemove}`);
      groupBlogsReset.mutateAsync();
    }
  }, [blogIdToRemove]);

  const renderContent = () => {
    switch (selectedId) {
      case 1:
        return (
          <FlatList
            data={displayBlogs}
            renderItem={({ item }) => <GroupBlogPreview blog={item} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.list, {}]}
            style={{ paddingBottom: 80 }}
            onEndReached={handleBlogListEndReached}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          />
        );
      case 2:
        return (
          <SectionGrid
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
            contentContainerStyle={styles.list}
          />
        );
      default:
        return null;
    }
  };
  const sheetRef = useRef(null);
  return (
    <GestureHandlerRootView>
      <ParallaxFlatList contentStyle={styles.contentStyle}>
        <GroupPageContent
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          groupID={groupId}
          sheetRef={sheetRef}
          // setSelectedBlogFilter={setSelectedBlogFilter}
          // setSelectedTagFilter={setSelectedTagFilter}
          // selectedBlogFilter={selectedBlogFilter}
          // selectedTagFilter={selectedTagFilter}
        />
        <View>{renderContent()}</View>
      </ParallaxFlatList>
      <BlogMoreOptionBottomList
        sheetRef={sheetRef}
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
    padding: 20,
    paddingTop: 0,
    flex: 1,
  },
});
