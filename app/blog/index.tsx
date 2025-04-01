import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  BackHandler,
  ScrollView,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import {
  router,
  useLocalSearchParams,
  useRouter,
  useSegments,
} from "expo-router";
import RenderHTML from "react-native-render-html";
import { useEffect } from "react";
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
import { color } from "@rneui/base";
import BlogCommenter from "@/components/blog/BlogCommenter";
import QuillRenderer from "@/components/dom-components/QuillRenderer/QuillRenderer";
import * as SplashScreen from "expo-splash-screen";
const mockHtml = `
<p class="ql-align-center">
<strong class="ql-size-large">
<u>Editor test with new text editor</u>
</strong>
</p>`;
const mockGroup = {
  name: "Group Name",
  image: "https://picsum.photos/200",
};

type Author = {
  name: string;
  image: string;
  userName: string;
  streak: number;
};
const mockAuthor: Author = {
  name: "FullName",
  image: "https://picsum.photos/200",
  userName: "user_name",
  streak: 120,
};
const mockTags = [
  "Frontend",
  "Backend",
  "React",
  "Vue",
  "Angular",
  "Node",
  "Express",
  "MongoDB",
  "SQL",
  "GraphQL",
];
type Commenter = {
  name: string;
  image: string;
  date: string;
  comment: string;
};
const mockCommenter: Commenter = {
  name: "FullName",
  image: "https://picsum.photos/200",
  date: "18 Nov 2023",
  comment:
    "I just tried this recipe and it was amazing! The instructions were clear and easy to follow, and the end result was delicious. I will definitely be making this again. Thanks for sharing!",
};
const mockComments = [
  mockCommenter,
  mockCommenter,
  mockCommenter,
  mockCommenter,
  mockCommenter,
];
const mockThumbnail = "https://picsum.photos/400";

export default function BlogScreen() {
  const { width } = useWindowDimensions();
  const route = useRouter();

  const handleBack = () => {
    route.back();
  };
  return (
    <FlatList
      data={mockComments}
      renderItem={({ item }) => <BlogCommenter {...item} />}
      style={styles.flatListContainer}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Back button */}
          <View style={[styles.rowContainer, { width: "100%", paddingBottom: 20,  }]}>
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
            <BlogAuthorComponent {...mockAuthor} />
            {/* Title */}
            <Text style={styles.title}>
              How to fix clipboard if it isn't working
            </Text>
            {/* Date and number of comment */}
            <View style={styles.additionalInfo}>
              {/* Date */}
              <View style={styles.dateAndComment}>
                <FontAwesome6 name="clock" size={24} color="#C2C2C2" />
                <Text style={styles.smallText}>18 Nov 2023</Text>
              </View>
              {/* Number of comment */}
              <View style={styles.dateAndComment}>
                <MaterialIcons name="comment" size={24} color="#C2C2C2" />
                <Text style={styles.smallText}>123 Comments</Text>
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
                  This is a description of the blog post. It is a brief summary
                  of the blog post. It is a description of the blog post. It is
                  a brief summary of the blog post.
                </Text>
              </View>
            </View>

            {/* List of tags */}
            <View style={styles.tagsContainer}>
              {mockTags.map((tag) => (
                <BlogTagButton title={tag} key={tag} />
              ))}
            </View>
            {/* Thumbnail */}
            <Image
              source={mockThumbnail}
              style={{ width: "100%", height: 200, borderRadius: 20 }}
              contentFit="cover"
              transition={1000}
            />
            {/* Blog content (render from html) */}
            <QuillRenderer dom={{matchContents: true}}/>
            <Divider
              orientation="vertical"
              width={1}
              style={{ borderColor: "white" }}
            />
            {/* Like, Dislike, Comment, Markbook */}
            <View style={styles.interactSection}>
              {/* Likes */}
              <View style={[styles.rowContainer, { gap: 20 }]}>
                <View style={styles.likeContainer}>
                  <FontAwesome name="thumbs-up" size={24} color="#fff" />
                  <ThemedText
                    style={{ color: "#fff" }}
                    type="default"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    123
                  </ThemedText>
                </View>
                {/* Dislikes */}
                <View style={styles.dislikeContainer}>
                  <FontAwesome name="thumbs-down" size={24} color="#fff" />
                  {/* <ThemedText
                    style={styles.text}
                    type="default"
                    lightColor="#fff"
                    darkColor="#fff">
                    123
                  </ThemedText> */}
                </View>
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
                  123
                </ThemedText>
              </View>
              {/* Bookmart Button */}
              <View style={styles.bookmarkContainer}>
                <FontAwesome name="bookmark" size={24} color="#fff" />
              </View>
            </View>
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
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
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
  likeContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#3C574960",
    padding: 10,
    borderRadius: 13,
  },
  dislikeContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#3C574960",
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
  bookmarkContainer: {
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
