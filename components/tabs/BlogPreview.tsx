import { RecentPopularBlog, UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import BlogAuthor from "./BlogAuthor";
import GroupPreviewInfo from "./GroupPreviewInfo";
import AnimatedPressable from "../AnimatedPressable";
import { Pressable, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomLeftArrowIcon from "../BottomLeftArrowIcon";
import { color } from "@rneui/base";

export default function BlogPreview({ blog }: { blog: RecentPopularBlog }) {
  // default to mock blog for this, but later will be passed as props
  const route = useRouter();
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push("/blog");
  };
  return (
    <TouchableOpacity
      style={styles.outerContainer}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: blog.CoverURL }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Pressable style={styles.container}>
          {/* 1st Part: User, Group, Button */}
          <View style={styles.topSection}>
            <View style={styles.userSection}>
              <BlogAuthor
                author={{
                  name: blog.Author.UserName,
                  avatar: blog.Author.AvatarURL,
                }}
                time={blog.Author.CreateDate}
              />
            </View>
            <Entypo name="dots-three-vertical" size={24} color="white" />
            <View style={styles.groupSection}>
              {/* <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                Group
              </ThemedText> */}
              {/* <GroupPreviewInfo style={{}} group={{Name:`Group's name`, CoverURL: 'https://groupworkandcommunication2018.wordpress.com/wp-content/uploads/2018/10/group.png', NumberOfMembers: 123} }/> */}
            </View>
            {/* Ask later because it take to much space */}
            {/* <View style={styles.buttonSection}>
              <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                Button
              </ThemedText>
            </View> */}
          </View>
          {/* 2nd Part: List of Tags */}
          <View style={styles.tagsSection}>
            {blog.Tags && blog.Tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag.TagName}
              </Text>
            ))}
          </View>
        </Pressable>
      </ImageBackground>
      <View style={{ padding: 20 }}>
        {/* 3nd Part: Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{blog.Title}</Text>
        </View>
        {/* 4th Part: Preview of Content */}
        <View style={styles.contentSection}>
          <Text style={styles.description}>
            {blog.Description.slice(0, 115)}...
          </Text>
        </View>
        {/* 5th Part: Group Info */}
        {/* <View style={styles.rowContainer}>
          <View style={styles.groupSection}>
            <GroupPreviewInfo
              group={{
                name: mockGroup.Name,
                avatar: mockGroup.CoverURL,
              }}
            />
          </View>
          <BottomLeftArrowIcon
            style={{ backgroundColor: "black", position: "static" }}
            color="#B9FF66"
          />
        </View> */}
      </View>
      {/* Divider */}
      <View
        style={{
          borderColor: "rgba(0, 0, 0, 0.5)",
          borderWidth: 0.5,
          width: "100%",
          marginVertical: 10,
        }}
      />
      {/* Reaction */}
      {/* 4th Part: Interactions */}
      <View style={styles.interactSection}>
        {/* Likes */}
        <View style={styles.likeContainer}>
          <FontAwesome name="thumbs-up" size={24} color="#000" />
          <Text style={styles.text}>{blog.NumberOfLikes}</Text>
        </View>
        {/* Dislikes */}
        {/* <View style={styles.dislikeContainer}>
          <FontAwesome name="thumbs-down" size={24} color="#000" />
        </View> */}
        {/* Comment */}
        <View style={styles.commentContainer}>
          <MaterialIcons name="comment" size={28} color="#000" />
          <Text style={styles.text}>{blog.NumberOfComments}</Text>
        </View>
        {/* Bookmart Button */}
        <View style={styles.bookmarkContainer}>
          <FontAwesome name="bookmark" size={24} color="#000" />
          <Text style={styles.text}>{blog.NumberOfSaves}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 40,
    overflow: "hidden",
    borderColor: "#48576E",
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  imageBackground: {
    height: 200,
    padding: 16,
    margin: 20,
    marginBottom: 0,
  },
  imageStyle: {
    borderRadius: 30,
  },
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  userSection: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  groupSection: {
    flexDirection: "row",
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
    marginBottom: 8,
  },
  contentSection: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 16,
  },
  tagsSection: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  text: {
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    textAlign: "justify",
  },
  tag: {
    margin: 8,
    padding: 2,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    color: "#fff",
  },
  interactSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  dislikeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  commentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  bookmarkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
});
