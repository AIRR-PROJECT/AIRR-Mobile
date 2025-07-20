import { Image, StyleSheet, View, Text } from "react-native";
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
import { FontAwesome6 } from "@expo/vector-icons";

export default function DashboardScreen() {
  const dispatch = useAppDispatch();

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

  return (
    // correct the darkColor and lightColor values later
    <ParallaxScrollView style={{ flex: 1 }}>
      <UserInfoComponent {...user} isOwnProfile={isViewingOwnProfile} />
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
      {/*  */}
      {/* Blog Preview */}
      <View style={{ borderWidth: 1, borderColor: "#B9FF66", padding: 10, borderRadius: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#B9FF66",
            padding: 10,
            borderRadius: 20,
            gap: 10,
            alignSelf: "flex-start", // keeps the highlight tight
            marginBottom: 10,
          }}
        >
          <FontAwesome6 name="fire-flame-curved" size={24} color="#000" />
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            Featured blog
          </Text>
        </View>
        {popularBlog && <BlogPreview blog={popularBlog} />}
      </View>

      {/* Career Path props suggestion */}
      <CareerPathSuggestion />
      {/* Ai Trending tech recommdation */}
      {/* Most Popular Group /> */}
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
            }}
          >
            <Text style={{ color: "white" }}>Most Popular Group ✨</Text>
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
});
