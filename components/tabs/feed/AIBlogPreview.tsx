import { AIBlog, UserBlog, UserBlogTag } from "@/interfaces/blogInterface";
import { Dimensions, StyleSheet, View } from "react-native";
import { TouchableOpacity, Text } from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomLeftArrowIcon from "@/components/BottomLeftArrowIcon";
import { useState } from "react";

// TODO:  add thumbnail to the AI Blog interface
const mockThumbnail = "https://picsum.photos/400/200";
// TODO: there are 4 colors in the cycle => coressponding to 4 different AI blogs thumbnails => check ticket

export default function AIBlogPreview({
  blog,
  color,
}: {
  blog: AIBlog;
  color?: string;
}) {
  const route = useRouter();
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push({
      pathname: `/blog/ai-blog?aiBlogId=${blog._id}`,
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
        <ImageBackground
          source={mockThumbnail}
          imageStyle={styles.thumbnailStyle}
          style={styles.thumbnail}
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>{blog.Title}</Text>
          </View>
        </ImageBackground>
        <View style={styles.contentSection}>
          <Text
            style={styles.description}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {blog.Description}
          </Text>
          <View style={styles.tagsSection}>
            {blog.Tags &&
              blog.Tags.slice(0, 2).map((tag, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: color || "rgba(114, 150, 115, 0.5)" },
                  ]}
                >
                  #{tag.TagName}
                </Text>
              ))}
            {blog.Tags && blog.Tags.length > 2 && (
              <Text
                style={[
                  styles.tag,
                  { backgroundColor: color || "rgba(114, 150, 115, 0.5)" },
                ]}
              >
                +{blog.Tags.length - 2} more
              </Text>
            )}
          </View>
          {/* Divider */}
          <View
            style={{
              borderBottomColor: "#ccc",
              borderBottomWidth: 1,
              marginVertical: 10,
            }}
          />

          <View style={styles.rowContainer}>
            <MaterialCommunityIcons
              name="lightning-bolt-outline"
              size={24}
              color={color || "black"}
            />
            <Text style={{ marginLeft: 8 }}>Powered by AI</Text>
            <Entypo
              name="dots-three-horizontal"
              size={24}
              color={color || "black"}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        <BottomLeftArrowIcon
          color={"#fff"}
          style={{
            backgroundColor: color || "rgba(114, 150, 115, 0.5)",
          }}
        />
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width * 0.25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 16,
  },
  thumbnailStyle: {},
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  timeSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonSection: {
    justifyContent: "center",
    flexDirection: "row",
  },
  titleSection: {
    flex: 1,
    width: "90%",
    justifyContent: "center",
  },
  contentSection: {
    justifyContent: "center",
    padding: 16,
  },
  tagsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignSelf: "flex-start",
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
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#000",
    textAlign: "justify",
  },
  tag: {
    marginVertical: 5,
    marginRight: 8,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(114, 150, 115, 0.5)",
    borderRadius: 999,
  },
  bottomRightIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 999,
    padding: 8,
    backdropFilter: "transparent",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
