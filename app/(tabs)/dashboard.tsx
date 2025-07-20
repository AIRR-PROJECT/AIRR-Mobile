import { Image, StyleSheet, View, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ButtonGradient from "@/components/ButtonGradient";
import BlogPreview from "@/components/tabs/BlogPreview";
import { UserBlog } from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import GroupSearch from "@/components/tabs/GroupSearch";
import GroupJoin from "@/components/tabs/GroupJoinComponent";
import CareerPathSuggestion from "@/components/tabs/CareerPathSuggestion";
import AITrendingRecommendation from "@/components/tabs/AITrendingRecommendation";
import { router } from "expo-router";

const mockBlog: UserBlog = {
  Title: "How to fix clipboard if it isn’t working",
  BackgroundURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  Description: "Blog Description",
  content: loremIpsum({ count: 50, units: "paragraphs" }),
  timestamp: new Date().toISOString(),
  Author: {
    name: "Name of the Author",
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
    email: "sample_email@gmail.com",
    phoneNumber: "1234567890",
    location: "Location",
    bio: "Bio",
    socials: [],
    groups: [],
    blogs: [],
  },
  tags: ["Frontend", "Backend", "React", "NodeJS", "Express"],
};
export default function DashboardScreen() {
  return (
    // correct the darkColor and lightColor values later
    <ParallaxScrollView style={{ flex: 1 }}>
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
      <BlogPreview blog={mockBlog} />
      {/* Join Group props */}
      <GroupJoin url1="" url2="" url3="" />
      {/* Find group search bar */}
      <GroupSearch />
      {/* Career Path props suggestion */}
      <CareerPathSuggestion />
      {/* Ai Trending tech recommdation */}
      <AITrendingRecommendation />
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
