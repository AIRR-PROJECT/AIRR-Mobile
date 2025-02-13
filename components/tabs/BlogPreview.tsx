import { Blog } from "@/interfaces/blogInterface";
import { Pressable, ImageBackground, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function BlogPreview({ blog }: { blog: Blog }) {
  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={{ uri: blog.image }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Pressable style={styles.container} onPress={null}>
          {/* 1st Part: User, Group, Button */}
          <View style={styles.topSection}>
            <View style={styles.userSection}>
              <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                User
              </ThemedText>
            </View>
            <View style={styles.groupSection}>
              <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                Group
              </ThemedText>
            </View>
            <View style={styles.buttonSection}>
              <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                Button
              </ThemedText>
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
              {blog.title}
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
              {blog.content.slice(0, 50)}...
            </ThemedText>
          </View>

          {/* 4th Part: List of Tags */}
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
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 30,
    overflow: "hidden",
  },
  imageBackground: {
    width: "100%",
    height: 350,
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
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userSection: {
    flex: 1,
    justifyContent: "center",
  },
  groupSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  titleSection: {
    flex: 2,
    justifyContent: "center",
  },
  contentSection: {
    flex: 2,
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
    marginRight: 8,
    padding: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
});
