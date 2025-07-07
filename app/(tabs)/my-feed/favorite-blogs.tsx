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
// TODO:
// Fetching user favourite blogs only 
// Also implment refresh control and lazy loading
// remove from favourites now is a option in more option
export default function FavouriteBlog() {

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
