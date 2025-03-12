import { View, Text, StyleSheet, FlatList } from "react-native";
import ParallaxFlatView from "@/components/ParallaxFlatView";
import GradientText from "@/components/GradientText";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Blog } from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import AIBlogPreview from "@/components/tabs/feed/AIBlogPreview";
import FeedBlogPreview from "@/components/tabs/feed/FeedBlogPreview";
import { useWatch } from "react-hook-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hook";
import { fetchRecommendedBlogs } from "@/redux/slices/feedSlice";
import { useEffect, useState } from "react";
const mockBlog: Blog = {
  Title: "How to fix clipboard if it isn’t working",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  Description: "Blog Description",
  content: loremIpsum({ count: 50, units: "paragraphs" }),
  timestamp: new Date().toISOString(),
  blogAuthor: {
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
const Data = [mockBlog, mockBlog, mockBlog,mockBlog, mockBlog, mockBlog,mockBlog, mockBlog, mockBlog];
export default function MyFeed() {
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  const { data, error, isSuccess, isError, isPending } = useQuery({
    queryKey: ['feed-recommended', page],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(fetchRecommendedBlogs(page))

      console.log(fetchedBlogs.payload.blogList.blogs)
      return fetchedBlogs.payload.blogList.blogs
    },
    placeholderData: keepPreviousData
  })

  return (
    <ParallaxFlatView>
      {/* Header */}
      <View style={styles.headerContainer}>
        <GradientText
          style={{ fontSize: 24, fontWeight: "bold", fontStyle: "italic" }}
          colors={["#B9FF66", "#9DE8EE"]}
        >
          AI-Recommended Blogs
        </GradientText>
        <Ionicons name="play-forward-circle-outline" size={30} color="#fff" />
      </View>
      {/* Flat list for lazy load */}
      <FlatList
        data={data}
        horizontal={true}
        style={styles.aiBlogContainer}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ columnGap: 25 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return <AIBlogPreview blog={item} />;
        }}
      />
      {/* User Blogs and Button*/}
      <View style={styles.headerContainer}>
        <GradientText
          style={{ fontSize: 24, fontWeight: "bold", fontStyle: "italic" }}
          colors={["#B9FF66", "#9DE8EE"]}
        >
          User Blogs
        </GradientText>
        <FontAwesome6 name="up-down" size={24} color="#B9FF66" />
      </View>
      {/* Flat list for lazy load */}
      <FlatList
        data={Data}
        style={styles.userBlogContainer}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ rowGap: 25 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return <FeedBlogPreview blog={item} />;
        }}
      />
      
    </ParallaxFlatView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aiBlogContainer: {
    flexDirection: "row",
    height: "auto",
    marginHorizontal: -25,
    marginTop: -25,
    flex: 1,
  },
  userBlogContainer: {
    flex: 1,
    rowGap: 25,
  }
});
