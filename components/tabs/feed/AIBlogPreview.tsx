import { Blog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AnimatedPressable from "@/components/AnimatedPressable";
import { Pressable, TouchableOpacity } from "react-native";
import { formatISODate, formatUnixDate } from "@/utils/dateConvert";
export default function AIBlogPreview({ blog }: { blog: Blog }) {
  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={{ uri: blog.image }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Pressable style={styles.container}>
          {/* 1st Part: Date  */}

          <View style={styles.timeSection}>
            <ThemedText
              style={styles.timeText}
              type="default"
              lightColor="#fff"
              darkColor="#fff"
            >
              {formatISODate(blog.timestamp)}
            </ThemedText>
          </View>

          {/* 2nd Part: List of Tags */}
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
          {/* 3rd Part: Title */}
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
        </Pressable>
      </ImageBackground>
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
    width: 300,
    height: 250,
  },
  imageStyle: {
    borderRadius: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
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
  timeText:{
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#fff",
  },
  tag: {
    marginVertical: 5,
    marginRight: 8,
    padding: 5 ,
    backgroundColor: "rgba(114, 150, 115, 0.5)",
    borderRadius: 999,
 
  },
});
