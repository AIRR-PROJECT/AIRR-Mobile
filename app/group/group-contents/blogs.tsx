import { FontAwesome6 } from "@expo/vector-icons";
import { View, TextInput, StyleSheet } from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import { PendingBlogRequest, PendingMemberRequest } from "@/interfaces/groupInterface";
import { approveBlog, getPendingBlogList, getPendingTagList, rejectBlog } from "@/redux/slices/groupSlice";
import { useAppDispatch } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";

// Initial mock data
// const mockBlog = {
//   blog: {
//     _id: Math.random().toString(),
//     title: "How to build a React Native app",
//     thumbnail: "https://picsum.photos/200",
//   },
//   author: {
//     id: "1",
//     name: "John Doe",
//     avatar: "https://picsum.photos/220",
//   },
//   time: new Date().getTime() - 1000 * 60 * 60 * 24,
// };

// const initialBlogs = [mockBlog, mockBlog, mockBlog].map((b, i) => ({
//   ...b,
//   blog: { ...b.blog, _id: i.toString() },
// }));

export default function BlogsApprovalsPage() {
  // Currently use state to manage the blogs
  // TODO: Khoa: Change to what you want
  const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>()
  const { groupID, blogID, blogIDToRemove } = useLocalSearchParams<{ groupID: string, blogID: string, blogIDToRemove: string }>()
  
  const [blogs, setBlogs] = useState<PendingBlogRequest[]>([]);

  useEffect(() => {
    // dispatch(getPendingBlogList(groupID)).then(res => {
    //   const list = res.payload as PendingBlogRequest[]
    //   setBlogs(list)
    // })
  }, [])

  useEffect(() => {
    // Scroll to specific index
    // if (blogs != undefined && blogID != "" && blogID != undefined) {
    //   blogs.forEach((value, index) => {
    //     if (value.BlogID == blogID) {
    //       flatlistRef.current.scrollToIndex({ animated: true, index: index })
    //       return
    //     }
    //   })
    // }
  }, [blogs, blogID])

  useEffect(() => {
    // if (blogIDToRemove) {
    //   dispatch(getPendingBlogList(groupID)).then(res => {
    //     const list = res.payload as PendingBlogRequest[]
    //     setBlogs(list)
    //   })
    // }
  }, [blogIDToRemove])

  const onApprove = (id: string, blogOwnerId: string) => {
    dispatch(approveBlog({ groupID: groupID, blogIDToApprove: id, blogOwnerID: blogOwnerId })).then(res => {
      if (res.payload === true) {
        console.log("Approve blog with id: ", id);
        setBlogs((prev) => prev.filter((b) => b.BlogID !== id));
      }
    })
  };

  const onReject = (id: string, blogOwnerId: string) => {
    dispatch(rejectBlog({ groupID: groupID, blogIDToReject: id, blogOwnerID: blogOwnerId })).then(res => {
      if (res.payload === true) {
        console.log("Reject blog with id: ", id);
        setBlogs((prev) => prev.filter((b) => b.BlogID !== id));
      }
    })
  };

  const renderItem = ({ item }: any) => (
    <BlogApprovalCardComponent
      {...item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Search Blogs"
            placeholderTextColor="#8A94AC"
          />
        </View>
      </View>

      {/* Animated FlatList */}
      <Animated.FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.BlogID}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
        ref={flatlistRef}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  textInput: {
    padding: 10,
    flex: 1,
    color: "#fff",
    fontSize: 18,
  },
});
