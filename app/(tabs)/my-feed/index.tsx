import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
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
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MoreOptionBottomList from "@/components/blog/MoreOptionBottomList";
export default function MyFeed() {
  const dispatch = useAppDispatch();
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [isRecommendedBlogReset, setRecommendedBlogReset] = useState(false);
  const [isUserBlogReset, setUserBlogReset] = useState(false);
  const [currentTags, setCurrentTags] = useState();
  const { user } = useAppSelector((state) => state.user);

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
  const recommendedBlogsReset = useMutation({
    mutationFn: async () => {
      const refetchedBlog = await dispatch(fetchRecommendedBlogs(1));

      return refetchedBlog.payload.blogList.blogs as AIBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-recommended"], (oldData: any) => {
        return [...data] as AIBlog[];
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
      const refetchedBlog = await dispatch(fetchUserBlogs(1));

      return refetchedBlog.payload.blogList.blogs as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-user"], (oldData: any) => {
        return [...data] as UserBlog[];
      });
    },
  });
  const handleOnUserBlogListEndReached = () => {
    setUserPage(userPage + 1);
    userBlogsMutation.mutate(userPage + 1);
  };
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    console.log("Refreshing");
    setRecommendedBlogReset(true);
    setUserBlogReset(true);
    recommendedBlogsReset
      .mutateAsync()
      .then(() => setRecommendedBlogReset(false));
    userBlogsReset.mutateAsync().then(() => setUserBlogReset(false));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  }, []);

  useEffect(() => {
    console.log("Refetching");
  }, [recommendedBlogsQuery.isFetching]);

  // Update current tags upon successful query
  useEffect(() => {
    if (userBlogsQuery.isSuccess) {
      setCurrentTags((user as any).Survey);
    }
  }, [userBlogsQuery.isSuccess]);
  // If user's tags are updated, update the feed
  useEffect(() => {
    if (user) {
      setUserPage(1);
      setUserBlogReset(true);
      userBlogsReset.mutateAsync().then(() => setUserBlogReset(false));
    }
  }, [user]);
  const progress = useSharedValue(0);

  const carouselRef = useRef<ICarouselInstance>(null);

  const moreOptionRef = useRef<BottomSheet>(null);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);
  const [moreOptionBlogId, setMoreOptionBlogId] = useState("")
  const [moreOptionGroupId, setMoreOptionGroupId] = useState("")
  const handlePressMoreOption = (isUserWritten: boolean, blogId: string, groupId: string) => {
    setIsUserWrittenBlog(isUserWritten);
    setMoreOptionBlogId(blogId)
    setMoreOptionGroupId(groupId)
    if (moreOptionRef.current) {
      moreOptionRef.current.snapToIndex(0);
    }
    // console.log("More option pressed", isUserWritten)
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Flat list for lazy load */}
      {userBlogsQuery.isFetching || isUserBlogReset ? (
        <FeedBlogPreviewSkeleton />
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={userBlogsQuery.data}
            style={styles.userBlogContainer}
            scrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            showsVerticalScrollIndicator={false}
            onEndReached={handleOnUserBlogListEndReached}
            renderItem={({ item }) => {
              return <FeedBlogPreview blog={item} onPressMoreButton={
                () => handlePressMoreOption(item.Author._id === user._id, item._id, item.Group._id)
              }/>;
            }}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <View>
                {/* Header */}
                <View style={styles.headerContainer}>
                  <GradientText
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                    colors={["#B9FF66", "#9DE8EE"]}
                  >
                    AI-Recommended Blogs
                  </GradientText>
                  {/* <Ionicons
                    name="play-forward-circle-outline"
                    size={30}
                    color="#fff"
                  /> */}
                </View>

                {/* Change to carousel for better ux*/}
                {recommendedBlogsQuery.isFetching || isRecommendedBlogReset ? (
                  <AIBlogPreviewSkeleton />
                ) : (
                  <View
                    id="carousel-ai-blog-component"
                    // dataSet={{ kind: "utils", name: "pagination" }}
                    style={{ gap: 10 }}
                  >
                    <Carousel
                      ref={carouselRef}
                      autoPlayInterval={2000}
                      autoPlay={true}
                      data={recommendedBlogsQuery.data as AIBlog[]}
                      loop={true}
                      width={Dimensions.get("window").width}
                      height={Dimensions.get("window").height / 3}
                      pagingEnabled={true}
                      snapEnabled={true}
                      style={{
                        width: Dimensions.get("window").width,
                      }}
                      mode="parallax"
                      modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 50,
                      }}
                      onProgressChange={progress}
                      renderItem={({ item }) => <AIBlogPreview blog={item} />}
                    />
                  </View>
                )}
                {/* Popular Group */}
                {/* Section list for each section */}
                {/* User Blogs and Button*/}
                <View style={styles.headerContainer}>
                  <GradientText
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                    colors={["#B9FF66", "#9DE8EE"]}
                  >
                    User Blogs
                  </GradientText>
                </View>
              </View>
            }
          />
        </View>
      )}
      <MoreOptionBottomList sheetRef={moreOptionRef} isUserWrittenBlog={isUserWrittenBlog} blogId={moreOptionBlogId} groupId={moreOptionGroupId} isFromFeed={true}/>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
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
