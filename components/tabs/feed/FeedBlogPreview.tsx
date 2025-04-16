import { UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import AnimatedPressable from "@/components/AnimatedPressable";
import { Pressable, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hook";
import { dislikeBlog, dislikeToLikeBlog, likeBlog, likeToDislikeBlog, removeDislikeBlog, removeLikeBlog, saveBlog, unsaveBlog } from "@/redux/slices/blogSlice";
import { getUserBlogDislikeActivities, getUserBlogLikeActivities, getUserBlogSaveActivities } from "@/redux/slices/authSlice";
export default function FeedBlogPreview({ blog }: { blog: UserBlog }) {
  // default to mock blog for this, but later will be passed as props
  const route = useRouter();
  const dispatch = useAppDispatch()
  const handlePress = () => {
    console.log("Blog Pressed");
    route.push({
      pathname: `/blog?userBlogId=${blog._id}`,
    });
  };

  let isReactInProgress = false
  const [likes, setLikes] = useState(123)
  const [dislikes, setDislikes] = useState(123)
  const [comments, setComments] = useState(123)
  const [blogLiked, setBlogLiked] = useState<boolean>(false)
  const [blogDisliked, setBlogDisliked] = useState<boolean>(false)
  const [blogSaved, setBlogSaved] = useState<boolean>(false)

  useEffect(() => {
    setLikes(blog.Reaction.Likes)
    setDislikes(blog.Reaction.Dislikes)
    setComments(blog.Reaction.Comments)
    
    dispatch(getUserBlogLikeActivities(blog._id)).then((data) => {
      setBlogLiked(data.payload as boolean)
    })
    dispatch(getUserBlogDislikeActivities(blog._id)).then((data) => {
      setBlogDisliked(data.payload as boolean)
    })
    dispatch(getUserBlogSaveActivities(blog._id)).then((data) => {
      setBlogSaved(data.payload as boolean)
    })
  }, [])

  const handleLike = () => {
    if (isReactInProgress) {
      console.log("A react is already in progress")
      return
    }

    isReactInProgress = true

    if (blogLiked) {
      dispatch(removeLikeBlog(blog._id)).then(() => {
        setLikes(likes - 1)

        setBlogLiked(false)

        isReactInProgress = false
      })
    }
    else {
      if (blogDisliked) {
        dispatch(dislikeToLikeBlog(blog._id)).then(() => {
          setLikes(likes + 1)
          setDislikes(dislikes - 1)

          setBlogLiked(true)
          setBlogDisliked(false)

          isReactInProgress = false
        })
      }
      else {
        dispatch(likeBlog(blog._id)).then(() => {
          setLikes(likes + 1)

          setBlogLiked(true)

          isReactInProgress = false
        })
      }
    }

  }
  const handleDislike = () => {
    if (isReactInProgress) {
      console.log("A react is already in progress")
      return
    }

    isReactInProgress = true

    if (blogDisliked) {
      dispatch(removeDislikeBlog(blog._id)).then(() => {
        setDislikes(dislikes - 1)

        setBlogDisliked(false)

        isReactInProgress = false
      })
    }
    else {
      if (blogLiked) {
        dispatch(likeToDislikeBlog(blog._id)).then(() => {
          setDislikes(dislikes + 1)
          setLikes(likes - 1)

          setBlogLiked(false)
          setBlogDisliked(true)

          isReactInProgress = false
        })
      }
      else {
        dispatch(dislikeBlog(blog._id)).then(() => {
          setDislikes(dislikes + 1)

          setBlogDisliked(true)

          isReactInProgress = false
        })
      }
    }
  }
  const handleBookmark = () => {
    if (isReactInProgress) {
      console.log("A react is already in progress")
      return
    }

    isReactInProgress = true
    
    if (blogSaved) {
      dispatch(unsaveBlog(blog._id))

      setBlogSaved(false)

      isReactInProgress = false
    }
    else {
      dispatch(saveBlog(blog._id))

      setBlogSaved(true)

      isReactInProgress = false
    }
  }

  return (
    <View style={styles.outerContainer}>
      <Pressable style={styles.container} onPress={handlePress}>
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
                GroupName: `Group's name`,
                GroupCoverURL:
                  "https://groupworkandcommunication2018.wordpress.com/wp-content/uploads/2018/10/group.png",
                TotalMembers: 123,
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
              {blog.Description.slice(0, 100)}...
            </ThemedText>
            <View style={styles.tagsSection}>
              {blog.Tags.slice(0,2).map((tag, index) => (
                <ThemedText
                  key={index}
                  style={styles.tag}
                  type="default"
                  lightColor="#fff"
                  darkColor="#fff"
                >
                  #{tag.TagName}
                </ThemedText>
              ))}
            </View>
          </ImageBackground>
        </View>

        {/* 4th Part: Interactions */}
        <View style={styles.interactSection}>
          {/* Likes */}
          <View style={[styles.rowContainer, { gap: 20 }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={blogLiked ? styles.likeContainerYes : styles.likeContainerNo} onPress={handleLike}>
              <FontAwesome name="thumbs-up" size={24} color={blogLiked ? "#000" : "#fff"} />
              <ThemedText
                style={{ color: blogLiked ? "#000" : "#fff" }}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                {likes}
              </ThemedText>
            </TouchableOpacity>
            {/* Dislikes */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={blogDisliked ? styles.dislikeContainerYes : styles.dislikeContainerNo} onPress={handleDislike}>
              <FontAwesome name="thumbs-down" size={24} color={blogDisliked ? "#000" : "#fff"} />
              {/* <ThemedText
                style={styles.text}
                type="default"
                lightColor="#fff"
                darkColor="#fff">
                123
              </ThemedText> */}
            </TouchableOpacity>
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
              {comments}
            </ThemedText>
          </View>
          {/* Bookmart Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={blogSaved ? styles.bookmarkContainerYes : styles.bookmarkContainerNo} onPress={handleBookmark}>
            <FontAwesome name="bookmark" size={24} color={blogSaved ? "#000" : "#fff"} />
          </TouchableOpacity>
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
  likeContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  likeContainerNo: {
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
  dislikeContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  dislikeContainerNo: {
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
  bookmarkContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  bookmarkContainerNo: {
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
