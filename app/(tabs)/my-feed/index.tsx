import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import ParallaxFlatList from "@/components/ParallaxFlatList";
import ParallaxFlashList from "@/components/ParallaxFlashList";
import GradientText from "@/components/GradientText";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { AIBlog, UserBlog } from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import AIBlogPreview from "@/components/tabs/feed/AIBlogPreview";
import FeedBlogPreview from "@/components/tabs/feed/FeedBlogPreview";
import { useWatch } from "react-hook-form";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchRecommendedBlogs,
  fetchUserBlogs,
} from "@/redux/slices/feedSlice";
import { useCallback, useEffect, useState } from "react";
import queryClient from "@/redux/api/queryClient";
// const mockBlog: UserBlog = {
//   Title: "How to fix clipboard if it isn’t working",
//   BackgroundURL:
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
//   Description: "Blog Description",
//   content: loremIpsum({ count: 50, units: "paragraphs" }),
//   timestamp: new Date().toISOString(),
//   Author: {
//     name: "Name of the Author",
//     avatar:
//       "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
//     email: "sample_email@gmail.com",
//     phoneNumber: "1234567890",
//     location: "Location",
//     bio: "Bio",
//     socials: [],
//     groups: [],
//     blogs: [],
//   },
//   tags: ["Frontend", "Backend", "React", "NodeJS", "Express"],
// };
// const Data = [mockBlog, mockBlog, mockBlog,mockBlog, mockBlog, mockBlog,mockBlog, mockBlog, mockBlog];

import { FlashList } from "@shopify/flash-list";
import AIBlogPreviewSkeleton from "@/components/tabs/feed/AIBlogPreviewSkeleton";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import { useSegments } from "expo-router";
export default function MyFeed() {
  const dispatch = useAppDispatch();
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [currentTags, setCurrentTags] = useState()
  const { user } = useAppSelector(state => state.user)

  const recommendedBlogsQuery = useQuery({
    queryKey: ["feed-recommended"],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(
        fetchRecommendedBlogs(recommendedPage)
      );

      // console.log(fetchedBlogs.payload.blogList.blogs)
      return fetchedBlogs.payload.blogList.blogs as AIBlog[];
    },
    placeholderData: keepPreviousData,
  });
  const recommendedBlogsMutation = useMutation({
    mutationFn: async (page: number) => {
      const moreFetchedBlogs = await dispatch(fetchRecommendedBlogs(page));

      // console.log(moreFetchedBlogs.payload.blogList.blogs)
      return moreFetchedBlogs.payload.blogList.blogs as AIBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-recommended"], (oldData: any) => {
        return [...oldData, ...data] as AIBlog[];
      });
    },
  });
  const handleOnRecommendedBlogListEndReached = () => {
    setRecommendedPage(recommendedPage + 1);
    recommendedBlogsMutation.mutate(recommendedPage + 1);
  };

  const userBlogsQuery = useQuery({
    queryKey: ["feed-user"],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(fetchUserBlogs(userPage));

      return fetchedBlogs.payload.blogList.blogs as UserBlog[];
    },
    placeholderData: keepPreviousData,
  });
  const userBlogsMutation = useMutation({
    mutationFn: async (page: number) => {
      const moreFetchedBlogs = await dispatch(fetchUserBlogs(page));

      // console.log(moreFetchedBlogs.payload.blogList.blogs)
      return moreFetchedBlogs.payload.blogList.blogs as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-user"], (oldData: any) => {
        return [...oldData, ...data] as UserBlog[];
      });
    },
  });
  const userBlogsReset = useMutation({
    mutationFn: async () => {
      const refetchedBlog = await dispatch(fetchUserBlogs(1))

      return refetchedBlog.payload.blogList.blogs as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-user"], (oldData: any) => {
        return [...data] as UserBlog[];
      });
    }
  })
  const handleOnUserBlogListEndReached = () => {
    setUserPage(userPage + 1);
    userBlogsMutation.mutate(userPage + 1);
  };
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  }, []);
  
  // Update current tags upon successful query
  useEffect(() => {
    console.log(userBlogsQuery.isSuccess)
    if (userBlogsQuery.isSuccess) {
      setCurrentTags((user as any).Survey)
    }
  }, [userBlogsQuery.isSuccess])
  // If user's tags are updated, update the feed 
  useEffect(() => {
    if (user) {
      setUserPage(1)
      userBlogsReset.mutate()
    }
  }, [user])

  return (
    <ParallaxFlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
      {recommendedBlogsQuery.isPending ?
        <AIBlogPreviewSkeleton/> :
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={recommendedBlogsQuery.data}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            onEndReached={handleOnRecommendedBlogListEndReached}
            renderItem={({ item }) => {
              return <AIBlogPreview blog={item} />;
            }}
            ItemSeparatorComponent={() => <View style={{ width: 25 }} />}
          />
        </View>
      }
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
      {userBlogsQuery.isPending ?
        <FeedBlogPreviewSkeleton/> :
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={userBlogsQuery.data}
            style={styles.userBlogContainer}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            showsHorizontalScrollIndicator={false}
            onEndReached={handleOnUserBlogListEndReached}
            renderItem={({ item }) => {
              return <FeedBlogPreview blog={item} />;
            }}
          />
        </View>
      }
    </ParallaxFlatList>
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
    flex: 1,
  },
  userBlogContainer: {
    flex: 1,
  },
});
