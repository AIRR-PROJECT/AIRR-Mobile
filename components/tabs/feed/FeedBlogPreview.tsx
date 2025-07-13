import { UserBlog } from "@/interfaces/blogInterface";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import { Pressable, TouchableOpacity } from "react-native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  dislikeBlog,
  dislikeToLikeBlog,
  likeBlog,
  likeToDislikeBlog,
  removeDislikeBlog,
  removeLikeBlog,
  saveBlog,
  unsaveBlog,
} from "@/redux/slices/blogSlice";
import {
  getUserBlogDislikeActivities,
  getUserBlogLikeActivities,
  getUserBlogSaveActivities,
} from "@/redux/slices/authSlice";
import BottomLeftArrowIcon from "@/components/BottomLeftArrowIcon";
import { ThemedText } from "@/components/ThemedText";
import BottomSheet from "@gorhom/bottom-sheet";
import MoreOptionBottomList from "@/components/blog/MoreOptionBottomList";
import BlogStatusComponent from "@/components/blog/BlogStatusComponent";
import { BlogStatus } from "@/enums/blog_properties.enum";
const mockGroup = {
  Name: "Group Name",
  CoverURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  NumberOfMembers: 100,
};

export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export default function FeedBlogPreview({
  blog,
  onPressMoreButton,
  onPressUnsave
}: {
  blog: UserBlog;
  onPressMoreButton?: (isUserWrittenBlog: boolean) => void;
  onPressUnsave?: () => void
}) {
  // default to mock blog for this, but later will be passed as props
  const route = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user)

  const handlePress = () => {
    console.log("Blog Pressed");
    route.push({
      pathname: `/blog?userBlogId=${blog._id}`,
    });
  };

  const reactTimeout = 500;
  const [likes, setLikes] = useState(123);
  const [dislikes, setDislikes] = useState(123);
  const [comments, setComments] = useState(123);
  const [blogLiked, setBlogLiked] = useState<boolean>(false);
  const [blogDisliked, setBlogDisliked] = useState<boolean>(false);
  const [blogSaved, setBlogSaved] = useState<boolean>(false);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);

  useEffect(() => {
    setLikes(blog.Reaction.Likes);
    setDislikes(blog.Reaction.Dislikes);
    setComments(blog.Reaction.Comments);
    setIsUserWrittenBlog(user._id == blog.Author._id)

    dispatch(getUserBlogLikeActivities(blog._id)).then((data) => {
      setBlogLiked(data.payload as boolean);
    });
    dispatch(getUserBlogDislikeActivities(blog._id)).then((data) => {
      setBlogDisliked(data.payload as boolean);
    });
    dispatch(getUserBlogSaveActivities(blog._id)).then((data) => {
      setBlogSaved(data.payload as boolean);
    });
  }, []);

  const handleLike = () => {
    if (blogLiked) {
      setLikes(likes - 1);

      setBlogLiked(false);

      dispatch(removeLikeBlog(blog._id));
    } else {
      if (blogDisliked) {
        setLikes(likes + 1);
        setDislikes(dislikes - 1);

        setBlogLiked(true);
        setBlogDisliked(false);

        dispatch(dislikeToLikeBlog(blog._id));
      } else {
        setLikes(likes + 1);

        setBlogLiked(true);

        dispatch(likeBlog(blog._id));
      }
    }
  };
  const handleDislike = () => {
    if (blogDisliked) {
      setDislikes(dislikes - 1);

      setBlogDisliked(false);

      dispatch(removeDislikeBlog(blog._id));
    } else {
      if (blogLiked) {
        setDislikes(dislikes + 1);
        setLikes(likes - 1);

        setBlogLiked(false);
        setBlogDisliked(true);

        dispatch(likeToDislikeBlog(blog._id));
      } else {
        setDislikes(dislikes + 1);

        setBlogDisliked(true);

        dispatch(dislikeBlog(blog._id));
      }
    }
  };
  const handleBookmark = () => {
    if (blogSaved) {
      dispatch(unsaveBlog(blog._id));

      setBlogSaved(false);

      // Favorite-blog-exclusive feature
      if (onPressUnsave) {
        onPressUnsave()
      }
    } else {
      dispatch(saveBlog(blog._id));

      setBlogSaved(true);
    }
  };

  const debounceHandleLike = debounce(() => {
    handleLike();
  }, 0.5);

  const debounceHandleDislike = debounce(() => {
    handleDislike();
  }, 0.5);

  const debounceHandleBookmark = debounce(() => {
    handleBookmark();
  }, 0.5);

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
        <View style={styles.overlay}></View>
        <Pressable style={styles.container} onPress={handlePress}>
          {/* 1st Part: User, Group, Button */}
          <View style={styles.topSection}>
            <View style={styles.userSection}>
              {/* TODO: need blog time */}
              {blog.Author && <BlogAuthor
                author={{
                  name: blog.Author.Username,
                  avatar: blog.Author.AvatarURL,
                }}
                time={blog.Author.CreateDate}
              />}
            </View>
            {onPressMoreButton && <TouchableOpacity
              onPress={() =>
                onPressMoreButton && onPressMoreButton(isUserWrittenBlog)
              }
            >
              <Entypo name="dots-three-vertical" size={24} color="white" />
            </TouchableOpacity>}
          </View>
          {/* 2nd Part: List of Tags */}
          <View style={styles.tagsSection}>
            {blog.Tags && blog.Tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag.TagName}
              </Text>
            ))}
            {blog.Tags && blog.Tags.length > 2 && (
              <Text style={styles.tag}>+{blog.Tags.length - 2} more</Text>
            )}
          </View>
          <BlogStatusComponent status={blog.Status ?? blog.ViewType}/>
        </Pressable>
      </ImageBackground>
      <View style={{ padding: 20 }}>
        {/* 3nd Part: Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {blog.Title}
          </Text>
        </View>

        {/* 4th Part: Preview of Content */}
        <View style={styles.contentSection}>
          <Text
            style={styles.description}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {blog.Description}
          </Text>
        </View>
        {/* 5th Part: Group Info */}
        {blog.Group && (
          <View style={[styles.rowContainer, { flex: 1 }]}>
            <View style={[styles.groupSection, { width: "80%" }]}>
              <GroupPreviewInfo
                group={{
                  Name: blog.Group.Name,
                  CoverURL: blog.Group.CoverURL,
                  NumberOfMembers: blog.Group.NumberOfMembers,
                }}
              />
            </View>
            <BottomLeftArrowIcon
              style={{ backgroundColor: "black", position: "static" }}
              color="#B9FF66"
            />
          </View>
        )}

        {/* Divider */}
        <View
          style={{
            borderColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 0.5,
            width: "100%",
            marginVertical: 10,
          }}
        />

        {/* 6th Part: Interactions */}
        <View style={styles.interactSection}>
          {/* Likes */}
          <View style={[styles.rowContainer, { gap: 20 }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={
                blogLiked ? styles.likeContainerYes : styles.likeContainerNo
              }
              onPress={debounceHandleLike}
            >
              <FontAwesome
                name="thumbs-up"
                size={24}
                color={blogLiked ? "#fff" : "#000"}
              />
              <Text style={blogLiked ? styles.textYes : styles.textNo}>
                {likes}
              </Text>
              {/* <FontAwesome name="thumbs-up" size={24} color={blogLiked ? "#fff" : "#000"} />
              <ThemedText
                style={{ color: blogLiked ? "#000" : "#fff" }}
                type="default"
                lightColor="#fff"
                darkColor="#fff"
              >
                {likes}
              </ThemedText> */}
            </TouchableOpacity>
            {/* Dislikes */}
            <TouchableOpacity
              activeOpacity={0.7}
              style={
                blogDisliked
                  ? styles.dislikeContainerYes
                  : styles.dislikeContainerNo
              }
              onPress={debounceHandleDislike}
            >
              <FontAwesome
                name="thumbs-down"
                size={24}
                color={blogDisliked ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
          {/* Comment */}
          <View style={styles.commentContainer}>
            <MaterialIcons name="comment" size={28} color="#000" />
            <Text style={styles.text}>{comments}</Text>
          </View>
          {/* Bookmart Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={
              blogSaved
                ? styles.bookmarkContainerYes
                : styles.bookmarkContainerNo
            }
            onPress={debounceHandleBookmark}
          >
            <FontAwesome
              name="bookmark"
              size={24}
              color={blogSaved ? "#fff" : "#000"}
            />
          </TouchableOpacity>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
  textYes: {
    color: "#fff",
  },
  textNo: {
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
  likeContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#000",
  },
  likeContainerNo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  dislikeContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#000",
  },
  dislikeContainerNo: {
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
  bookmarkContainerYes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#000",
  },
  bookmarkContainerNo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
});
