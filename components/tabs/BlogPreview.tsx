import { UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import BlogAuthor from "./BlogAuthor";
import GroupPreviewInfo from "./GroupPreviewInfo";
import AnimatedPressable from "../AnimatedPressable";
import { Pressable, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function BlogPreview({ blog }: { blog: UserBlog }) {
  // default to mock blog for this, but later will be passed as props
  const route = useRouter();
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push("/blog");
  };
  return (
    <TouchableOpacity style={styles.outerContainer} onPress={handlePress}>
      <ImageBackground
        source={{ uri: blog.BackgroundURL }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Pressable style={styles.container}>
          {/* 1st Part: User, Group, Button */}
          <View style={styles.topSection}>
            <View style={styles.userSection}>
              <BlogAuthor
                author={{
                  name: "username",
                  avatar: "https://i.pravatar.cc/150",
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
          <View style={styles.contentSection}>
            <ThemedText
              style={styles.description}
              type="default"
              lightColor="#fff"
              darkColor="#fff"
            >
              {blog.content.slice(0, 100)}...
            </ThemedText>
          </View>

          {/* 4th Part: List of Tags */}
          <View style={styles.tagsSection}>
            {blog.tags.map((tag, index) => (
              <Text
                key={index}
                style={styles.tag}
              >
                #{tag}
              </Text>
            ))}
          </View>
        </Pressable>
      </ImageBackground>
    </TouchableOpacity>
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
    flex: 1,
  },
  imageStyle: {
    borderRadius: 16,
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
    flex: 1,
    justifyContent: "center",
  },
  tagsSection: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
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
  },
  tag: {
    margin: 8,
    padding: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
  },
});
