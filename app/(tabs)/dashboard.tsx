import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ButtonGradient from "@/components/ButtonGradient";
import BlogPreview from "@/components/tabs/BlogPreview";
import {
  AIBlog,
  RecentPopularBlog,
  UserBlog,
} from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import GroupSearch from "@/components/tabs/GroupSearch";
import GroupJoin from "@/components/tabs/GroupJoinComponent";
import CareerPathSuggestion from "@/components/tabs/CareerPathSuggestion";
import AITrendingRecommendation from "@/components/tabs/AITrendingRecommendation";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getRecentPopularBlogAndGroup } from "@/redux/slices/feedSlice";
import { RecentPopularBlogAndGroup } from "@/interfaces/feedInterface";
import { RecentPopularGroup } from "@/interfaces/groupInterface";
import UserInfoComponent from "@/components/profile/UserInfoComponent";
import { User } from "@/interfaces/userInterface";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ImageBackground, Image } from "expo-image";
import BlogAuthor from "@/components/tabs/BlogAuthor";
import AIBlogPreview from "@/components/tabs/feed/AIBlogPreview";
const VITE_CLOUDINARY_CLOUD_NAME = "your_cloudinary_cloud_name"; // replace with your actual cloud name
const VITE_CLOUDINARY_PRESET = "your_cloudinary_preset"; // replace with
const ai_agent = require("@/assets/images/tabs/index/ai_agent.jpg");
export default function DashboardScreen() {
  const dispatch = useAppDispatch();
  console.log(ai_agent);
  const [aiBlog, setAiBlog] = useState<AIBlog>();
  const [popularBlog, setPopularBlog] = useState<RecentPopularBlog>();
  const [popularGroup, setPopularGroup] = useState<RecentPopularGroup>();

  useEffect(() => {
    dispatch(getRecentPopularBlogAndGroup()).then((res) => {
      const data = res.payload as RecentPopularBlogAndGroup;

      console.log(data.popularBlog.Author);
      setAiBlog(data.AIBlog);
      setPopularBlog(data.popularBlog);
      setPopularGroup(data.popularGroup);
    });
  }, []);
  const { user, isViewingOwnProfile } = useAppSelector((state) => state.user);
  const handlePopularBlogPress = (blog: RecentPopularBlog) => {
    router.push(`/blog?userBlogId=${blog._id}`);
  }
  const handleAIBlogPress = (blog: AIBlog) => {
    router.push(`/blog/ai-blog?aiBlogId=${blog._id}`);
  };
  const handlePopularGroupPress = (group: RecentPopularGroup) => {
    router.push(`/group?groupId=${group._id}`);
  }
  const handleProfilePress = (user: User) => {
   
  }
  return (
    // correct the darkColor and lightColor values later
    <ParallaxScrollView style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => handleProfilePress(user)} activeOpacity={0.7}>
        <UserInfoComponent {...user} isOwnProfile={isViewingOwnProfile} />
      </TouchableOpacity>
      {/* Title */}
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              gap: 10,
              backgroundColor: "black",
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>✨ Create Content</Text>
          </View>
        </View>
        <Text style={styles.titleText}>Let's Post A New Blog</Text>
        <ButtonGradient
          style={[
            styles.titleButton,
            { elevation: 5, alignSelf: "flex-start" },
          ]}
          label="Start Writing ↗"
          onPress={() => router.push("/blog/new-blog")}
        />
      </View>
      {/* Blog Preview */}
      {popularBlog && (
        <TouchableOpacity onPress={() => handlePopularBlogPress(popularBlog)} activeOpacity={0.7}>
          <ImageBackground
            source={{ uri: popularBlog.CoverURL }}
            style={{
              borderRadius: 30,
              padding: 20,
              overflow: "hidden",
            }}
          >
            <View style={styles.overlay}></View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#B9FF66",
                  padding: 10,
                  borderRadius: 20,
                  gap: 10,
                  alignSelf: "flex-start", // keeps the highlight tight
                }}
              >
                <FontAwesome6 name="fire-flame-curved" size={24} color="#000" />
                <Text style={{ fontWeight: "bold", color: "#000" }}>
                  Featured blog
                </Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#e0e0e0",
                borderRadius: 20,
                padding: 20,
              }}
            >
              {popularBlog.Author && (
                <View style={styles.userSection}>
                  <Image
                    source={{ uri: popularBlog.Author.AvatarURL }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                  />
                  <Text style={{ color: "#000", fontWeight: "bold" }}>
                    {popularBlog.Author.Name}
                  </Text>
                </View>
              )}
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#000",
                  fontSize: 20,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {popularBlog.Title ? popularBlog.Title : "No title available"}
              </Text>
              <Text
                style={{ color: "#000" }}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {popularBlog.Description
                  ? popularBlog.Description
                  : "No description available"}
              </Text>
              <View style={styles.tagsSection}>
                {popularBlog.Tags &&
                  popularBlog.Tags.slice(0, 2).map((tag, index) => (
                    <Text key={index} style={styles.tag}>
                      #{tag.TagName}
                    </Text>
                  ))}
                {popularBlog.Tags && popularBlog.Tags.length > 2 && (
                  <Text style={styles.tag}>
                    +{popularBlog.Tags.length - 2} more
                  </Text>
                )}
              </View>
              <View style={styles.interactSection}>
                {/* Likes */}
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.likeContainerNo}
                  >
                    <FontAwesome name="thumbs-up" size={24} color={"#000"} />
                    <Text style={styles.textNo}>
                      {popularBlog.NumberOfLikes || 0}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Comment */}
                <View style={styles.commentContainer}>
                  <MaterialIcons name="comment" size={28} color="#000" />
                  <Text style={styles.text}>
                    {popularBlog.NumberOfComments || 0}
                  </Text>
                </View>
                {/* Bookmart Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.bookmarkContainerNo}
                >
                  <FontAwesome name="bookmark" size={24} color={"#000"} />
                  <Text style={styles.textNo}>
                    {popularBlog.NumberOfSaves || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}

      {/* Ai Blog*/}
      {aiBlog && <TouchableOpacity style={{ backgroundColor: "#fff", borderRadius: 20 }} onPress={() => handleAIBlogPress(aiBlog)} activeOpacity={0.7}>
        <ImageBackground
          source={ai_agent}
          style={{
            borderRadius: 30,
            padding: 20,
            overflow: "hidden",
            gap: 10,
          }}
        >
          <View
            style={{
              gap: 10,
              backgroundColor: "black",
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="lightning-bolt-outline"
              size={24}
              color="#B9FF66"
            />
            <Text style={{ color: "white" }}>Blog Generated by AI ✨ </Text>
            <Entypo name="dots-three-horizontal" size={24} color="#B9FF66" />
          </View>
          
          <View>
            <View
              style={{
                flex: 1,
                backgroundColor: "#e0e0e0",
                borderRadius: 20,
                padding: 20,
                opacity: 0.8,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#000",
                  fontSize: 20,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {aiBlog.Title ? aiBlog.Title : "No title available"}
              </Text>
              <Text
                style={{ color: "#000" }}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {aiBlog.Description
                  ? aiBlog.Description
                  : "No description available"}
              </Text>
              <View style={styles.tagsSection}>
                {aiBlog.Tags &&
                  aiBlog.Tags.slice(0, 2).map((tag, index) => (
                    <Text key={index} style={styles.tag}>
                      #{tag.TagName}
                    </Text>
                  ))}
                {aiBlog.Tags && aiBlog.Tags.length > 2 && (
                  <Text style={styles.tag}>
                    +{aiBlog.Tags.length - 2} more
                  </Text>
                )}
              </View>
            </View>
          </View>
          
        </ImageBackground>
      </TouchableOpacity>}

      {/* Career Path props suggestion */}
      <CareerPathSuggestion />
      {/* Most Popular Group /> */}
      {popularGroup && <TouchableOpacity style={styles.titleContainer} activeOpacity={0.7} onPress={() => handlePopularGroupPress(popularGroup)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              gap: 10,
              backgroundColor: "black",
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
              flexWrap: "wrap",
            }}
          >
            <Text style={{ color: "white" }}>Most Popular Group ✨</Text>
          </View>
        </View>
        <View>
          <ImageBackground
            source={{ uri: popularGroup.CoverURL }}
            style={{
              borderRadius: 30,
              padding: 20,
              overflow: "hidden",
              alignItems: "center",
            }}
            contentFit="none"
          >
            <View style={styles.overlay}></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "80%",
              }}
            >
              <View
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  {popularGroup.NumberOfTag}
                </Text>
                <AntDesign name="tago" size={24} color="#B9FF66" />
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  Tags
                </Text>
              </View>
              <View
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  {popularGroup.NumberOfMembers}
                </Text>
                <FontAwesome6 name="user-group" size={24} color="#B9FF66" />
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  Members
                </Text>
              </View>

              <View
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  {popularGroup.TotalNumberOfBlogsLikes}
                </Text>
                <AntDesign name="hearto" size={24} color="#B9FF66" />
                <Text style={{ fontWeight: "bold", color: "#B9FF66" }}>
                  Likes
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Name */}
          <Text
            style={{
              fontWeight: "bold",
              color: "#000",
              fontSize: 20,
              marginTop: 10,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {popularGroup.Name}
          </Text>

          {/* Description */}
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              marginVertical: 15,
              textAlign: "justify",
            }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {popularGroup.Description}
          </Text>

          {/* Moderator */}
          <View style={[styles.userSection, {backgroundColor: "transparent", }]}>
            <Image
              source={{ uri: popularGroup.CreatedBy.AvatarURL }}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
            />
            <View>
              <Text style={{ color: "#000" }}>Moderator</Text>
              <Text style={{ color: "#000", fontWeight: "bold" }}>
                {popularGroup.CreatedBy.Username}
              </Text>
            </View>
          </View>
          <View style={[styles.rowContainer, {justifyContent: "center", gap: 20, backgroundColor: "black", padding: 5, borderRadius: 20, marginTop: 10}]}>
            <Text style={{color: "#fff", fontWeight: "bold"}}>View Group</Text>
            <FontAwesome6 name="user-group" size={16} color="#fff" />
            </View>
        </View>
      </TouchableOpacity>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    gap: 10,
  },
  titleText: {
    flex: 1,
    flexWrap: "wrap",
    width: "100%",
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
  titleButton: {
    width: 150,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: 10,
  },
  longTextContainer: {
    backgroundColor: "transparent",
    gap: 0,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  tagsSection: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 10,
  },
  tag: {
    padding: 2,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    color: "#fff",
    marginRight: 8,
  },
  interactSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
  text: {
    color: "#000",
  },
  textYes: {
    color: "#fff",
  },
  textNo: {
    color: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 0,
  },
  userSection: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    padding: 5,
  },
});
