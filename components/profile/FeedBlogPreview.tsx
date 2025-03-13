import { UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import AnimatedPressable from "@/components/AnimatedPressable";
import { Pressable, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
export default function FeedBlogPreview({ blog }: { blog: UserBlog }) {
  return (
    <View style={styles.outerContainer}>
      <Pressable style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.userSection}>
            <BlogAuthor
              author={{
                name: "username",
                avatar: "https://i.pravatar.cc/150",
              }}
            />
          </View>
          <View style={styles.groupSection}>
            <GroupPreviewInfo
              style={{}}
              group={{
                name: `Group's name`,
                avatar:
                  "https://groupworkandcommunication2018.wordpress.com/wp-content/uploads/2018/10/group.png",
                numberOfMembers: 123,
              }}
            />
          </View>
        </View>

        {/* 2nd Part: Title */}
        <View style={styles.titleSection}>
          <ThemedText
            style={styles.title}
            type="title"
            lightColor="#fff"
            darkColor="#fff"
          >
            {blog.Title}
          </ThemedText>
        </View>

        {/* 3rd Part: Preview of Content */}
        {/* <View style={styles.contentSection}>
          <ImageBackground
            source={{ uri: blog.BackgroundURL }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          >
            <ThemedText
              style={styles.description}
              type="default"
              lightColor="#fff"
              darkColor="#fff"
            >
              {blog.content.slice(0, 100)}...
            </ThemedText>
            <View style={styles.tagsSection}>
              {blog.tags.map((tag, index) => (
                <ThemedText
                  key={index}
                  style={styles.tag}
                  type="default"
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  #{tag}
                </ThemedText>
              ))}
            </View>
          </ImageBackground>
        </View> */}

        {/* 4th Part: Interactions */}
        <View style={styles.interactSection}>
          {/* Likes */}
          <View style={styles.likeContainer}>
            <FontAwesome name="thumbs-up" size={24} color="#fff" />
            <ThemedText
              style={styles.text}
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
          {/* Comment */}
          <View style={styles.commentContainer}>
            <MaterialIcons name="comment" size={28} color="#fff" />
            <ThemedText
              style={styles.text}
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
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 40,
    overflow: "hidden",
    borderColor: "#48576E",
    borderWidth: 2,
  },
  imageBackground: {
    width: "100%",
    height: 200,
    opacity: 0.8,
  },
  imageStyle: {
    borderRadius: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  topSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    gap: 10,
  },
  userSection: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  groupSection: {
    flex: 1.2,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  titleSection: {
    flex: 1,
    justifyContent: "center",
  },
  contentSection: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingVertical: 8,
  },
  tagsSection: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "justify",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    padding: 8,
  },
  tag: {
    margin: 8,
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  interactSection: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  likeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "rgba(60, 87, 73, 0.6)",
  },
  dislikeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "rgba(60, 87, 73, 0.6)",
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "rgba(60, 87, 73, 0.6)",
  },
  bookmarkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 13,
    backgroundColor: "rgba(60, 87, 73, 0.6)",
  },
});
