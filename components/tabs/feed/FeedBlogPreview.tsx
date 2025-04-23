import { UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import { Pressable, TouchableOpacity } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomLeftArrowIcon from "@/components/BottomLeftArrowIcon";
const mockGroup = {
  Name: "Group Name",
  CoverURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  NumberOfMembers: 100,
};
export default function FeedBlogPreview({ blog }: { blog: UserBlog }) {
  // default to mock blog for this, but later will be passed as props
  const route = useRouter();
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push({
      pathname: `/blog?userBlogId=${blog._id}`,
    });
  };
  return (
    <TouchableOpacity
      style={styles.outerContainer}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: blog.BackgroundURL }}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <Pressable style={styles.container} onPress={handlePress}>
          {/* 1st Part: User, Group, Button */}
          <View style={styles.topSection}>
            <View style={styles.userSection}>
              {/* TODO: need blog time */}
              <BlogAuthor
                author={{
                  name: blog.Author.Username,
                  avatar: blog.Author.AvatarURL,
                }}
              />
            </View>
            <Entypo name="dots-three-vertical" size={24} color="white" />
          </View>
          {/* 2nd Part: List of Tags */}
          <View style={styles.tagsSection}>
            {blog.Tags.slice(0, 3).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag.TagName}
              </Text>
            ))}
            {blog.Tags.length > 3 && (
              <Text style={styles.tag}>+{blog.Tags.length - 3} more</Text>
            )}
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
        <View style={styles.rowContainer}>
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
        </View>
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
          <Text style={styles.text}>123</Text>
        </View>
        {/* Dislikes */}
        <View style={styles.dislikeContainer}>
          <FontAwesome name="thumbs-down" size={24} color="#000" />
        </View>
        {/* Comment */}
        <View style={styles.commentContainer}>
          <MaterialIcons name="comment" size={28} color="#000" />
          <Text style={styles.text}>123</Text>
        </View>
        {/* Bookmart Button */}
        <View style={styles.bookmarkContainer}>
          <FontAwesome name="bookmark" size={24} color="#000" />
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
    marginHorizontal: 20,
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
