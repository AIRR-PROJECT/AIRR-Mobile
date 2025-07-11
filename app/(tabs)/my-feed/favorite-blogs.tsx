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
import { AIBlog, FavoriteBlog, UserBlog } from "@/interfaces/blogInterface";
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
import { BlogStatus, BlogViewType } from "@/enums/blog_properties.enum";
import { getFavoriteBlogs } from "@/redux/slices/blogSlice";
import { getUserGroupStatus } from "@/redux/slices/groupSlice";
// TODO:
// Fetching user favourite blogs only 
// Also implment refresh control and lazy loading
// remove from favourites now is a option in more option
export default function FavouriteBlog() {
  const dispatch = useAppDispatch()
  const moreOptionRef = useRef<BottomSheet>(null);
  const { user } = useAppSelector(state => state.user)

  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);
  const [isBlogReset, setBlogReset] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    console.log("Refreshing");
    setBlogReset(true);
    favoriteBlogsReset
      .mutateAsync()
      .then(() => setBlogReset(false));
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  }, []);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);
  const [isBlogStatusPendingOrActive, setIsBlogStatusPendingOrActive] = useState(false)
  const [isUserStatusPending, setIsUserStatusPending] = useState(false)
  const [isViewTypePrivateOrInProfile, setIsViewTypePrivateOrInProfile] = useState(false)
  const [moreOptionBlogId, setMoreOptionBlogId] = useState("")
  const [moreOptionGroupId, setMoreOptionGroupId] = useState("")
  const [page, setPage] = useState(1)
  const handlePressMoreOption = (isUserWritten: boolean, blogId: string, groupId: string, isBlogStatusPendingOrActive: boolean, isViewTypePrivateOrInProfile: boolean) => {
    setIsUserWrittenBlog(isUserWritten);
    setIsBlogStatusPendingOrActive(isBlogStatusPendingOrActive)
    setIsViewTypePrivateOrInProfile(isViewTypePrivateOrInProfile)
    setMoreOptionBlogId(blogId)
    setMoreOptionGroupId(groupId)

    // Fetch user status in current group
    dispatch(getUserGroupStatus(groupId)).then((res) => {
      const data = res.payload as string
    })

    setIsUserStatusPending(isUserStatusPending)
    if (moreOptionRef.current) {
      moreOptionRef.current.snapToIndex(0);
    }
    // console.log("More option pressed", isUserWritten)
  };

  const favoriteBlogsQuery = useQuery({
    queryKey: ["feed-favorite"],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(getFavoriteBlogs({ page }));

      return fetchedBlogs.payload as FavoriteBlog[];
    },
    placeholderData: keepPreviousData,
  });
  const favoriteBlogsMutation = useMutation({
    mutationFn: async (page: number) => {
      const moreFetchedBlogs = await dispatch(getFavoriteBlogs({ page }));

      // console.log(moreFetchedBlogs.payload.blogList.blogs)
      return moreFetchedBlogs.payload as FavoriteBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-favorite"], (oldData: any) => {
        return [...oldData, ...data] as FavoriteBlog[];
      });
    },
  });
  const favoriteBlogsReset = useMutation({
    mutationFn: async () => {
      const refetchedBlog = await dispatch(fetchUserBlogs(1));

      return refetchedBlog.payload.blogList.blogs as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-favorite"], (oldData: any) => {
        return [...data] as UserBlog[];
      });
      setPage(1)
    },
  });
  const handleOnUserBlogListEndReached = () => {
    setPage(page + 1);
    favoriteBlogsMutation.mutate(page + 1);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Flat list for lazy load */}
      {/* {userBlogsQuery.isFetching || isUserBlogReset ? (
        <FeedBlogPreviewSkeleton />
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            //data={userBlogsQuery.data}
            style={styles.userBlogContainer}
            scrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            showsVerticalScrollIndicator={false}
            //onEndReached={handleOnUserBlogListEndReached}
            renderItem={({ item }) => {
              return <FeedBlogPreview blog={item} onPressMoreButton={
                () => handlePressMoreOption(item.Author._id === user._id, item._id, item.Group._id)
              }/>;
            }}
            onEndReachedThreshold={0.5}
           
            
          />
        </View>
      )} */}
      
      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={favoriteBlogsQuery.data}
          style={styles.userBlogContainer}
          scrollEnabled={true}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          showsVerticalScrollIndicator={false}
          onEndReached={handleOnUserBlogListEndReached}
          renderItem={({ item }) => {
            return <FeedBlogPreview blog={item as any} onPressMoreButton={
              () => handlePressMoreOption(item.Author._id === user._id, item._id, item.Group._id,
                item.Status == BlogStatus.ACTIVE || item.Status == BlogStatus.PENDING,
                item.ViewType != BlogViewType.IN_GROUP
              )
            }/>;
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
      <MoreOptionBottomList
        sheetRef={moreOptionRef}
        isUserWrittenBlog={isUserWrittenBlog}
        blogId={moreOptionBlogId}
        groupId={moreOptionGroupId}
        isBlogStatusPendingOrActive={isBlogStatusPendingOrActive}
        isUserStatusPending={isUserStatusPending}
        isViewTypePrivateOrInProfile={isViewTypePrivateOrInProfile}
        isFromFeed={true}
        isFromFavourites={true}
        isFromDetail={false}
        handleHideThisBlog={function (): void {
          throw new Error("Function not implemented.");
        } }
        handleDeleteThisBlog={function (): void {
          throw new Error("Function not implemented.");
        } }/>
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
