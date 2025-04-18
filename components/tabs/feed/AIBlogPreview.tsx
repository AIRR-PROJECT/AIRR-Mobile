import { AIBlog, UserBlog } from "@/interfaces/blogInterface";
import { Dimensions, StyleSheet, View } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";

// TODO:  add thumbnail to the AI Blog interface
const mockThumbnail = "https://picsum.photos/400/200";
export default function AIBlogPreview({ blog }: { blog: AIBlog }) {
  const route = useRouter();
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push({
      pathname: `/blog?aiBlogId=${blog._id}`,
    });
  };
  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* 1st Part: Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{blog.Title}</Text>
        </View>
        {/* 2nd Part: Thumbnail */}
        <ImageBackground
          source={mockThumbnail}
          imageStyle={styles.thumbnailStyle}
          style={styles.thumbnail}
        >
          <Text style={styles.description}>{blog.Description}</Text>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 40,
    overflow: "hidden",
    borderColor: "#48576E",
    borderWidth: 2,
    width: Dimensions.get("window").width,
    height: 280,
  },
  thumbnail: {
    width: Dimensions.get("window").width - 50,
    height: 150,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    overflow: "hidden",
  },
  thumbnailStyle: {
    borderRadius: 16,
  },
  container: {
    alignItems: "center",
    flex: 1,
    padding: 16,
    backgroundColor: "#fff", 
    overflow: "hidden",
  },

  timeSection: {
    flex: 0.5,
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
    width: "90%",
    justifyContent: "center",
    marginBottom: 8,
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
  timeText: {
    color: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 999,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
  },
  tag: {
    marginVertical: 5,
    marginRight: 8,
    padding: 5,
    backgroundColor: "rgba(114, 150, 115, 0.5)",
    borderRadius: 999,
  },
});
