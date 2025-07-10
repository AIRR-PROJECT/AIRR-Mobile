import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useEffect, useRef, useState } from "react";
import {
  PendingBlogRequest,
  PendingMemberRequest,
} from "@/interfaces/groupInterface";
import {
  approveBlog,
  getPendingBlogList,
  getPendingTagList,
  rejectBlog,
} from "@/redux/slices/groupSlice";
import { useAppDispatch } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";

// Initial mock data
const mockBlog = {
  blog: {
    _id: Math.random().toString(),
    title: "How to build a React Native app",
    thumbnail: "https://picsum.photos/200",
  },
  author: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};

const initialBlogs = [mockBlog, mockBlog, mockBlog].map((b, i) => ({
  ...b,
  blog: { ...b.blog, _id: i.toString() },
}));

enum TabOptions {
  All = "all",
  MyBlogs = "my-blogs",
  NeedApproval = "need-approval",
}

export default function BlogsApprovalsPage() {
  // Currently use state to manage the blogs

  // const dispatch = useAppDispatch()
  // const flatlistRef = useRef<any>()
  // const { groupID, blogID, blogIDToRemove } = useLocalSearchParams<{ groupID: string, blogID: string, blogIDToRemove: string }>()

  // const [blogs, setBlogs] = useState<PendingBlogRequest[]>([]);

  // useEffect(() => {
  //   dispatch(getPendingBlogList(groupID)).then(res => {
  //     const list = res.payload as PendingBlogRequest[]
  //     setBlogs(list)
  //   })
  // }, [])

  // useEffect(() => {
  //   // Scroll to specific index
  //   if (blogs != undefined && blogID != "" && blogID != undefined) {
  //     blogs.forEach((value, index) => {
  //       if (value.BlogID == blogID) {
  //         flatlistRef.current.scrollToIndex({ animated: true, index: index })
  //         return
  //       }
  //     })
  //   }
  // }, [blogs, blogID])

  // useEffect(() => {
  //   if (blogIDToRemove) {
  //     dispatch(getPendingBlogList(groupID)).then(res => {
  //       const list = res.payload as PendingBlogRequest[]
  //       setBlogs(list)
  //     })
  //   }
  // }, [blogIDToRemove])

  const onApprove = (id: string, blogOwnerId: string) => {
    // dispatch(approveBlog({ groupID: groupID, blogIDToApprove: id, blogOwnerID: blogOwnerId })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Approve blog with id: ", id);
    //     setBlogs((prev) => prev.filter((b) => b.BlogID !== id));
    //   }
    // })
  };

  const onReject = (id: string, blogOwnerId: string) => {
    // dispatch(rejectBlog({ groupID: groupID, blogIDToReject: id, blogOwnerID: blogOwnerId })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Reject blog with id: ", id);
    //     setBlogs((prev) => prev.filter((b) => b.BlogID !== id));
    //   }
    // })
  };

  const renderItem = ({ item }: any) => (
    <BlogApprovalCardComponent
      {...item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
  const flatlistRef = useRef<any>(null);

  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  // TODO: Replace with actual logic to check if the user is admin or owner
  const isUserAdminOrOwner = true; // This should be replaced with actual logic to check if the user is admin or owner
  // 2 lựa chọn trên thì là cái feed blog preview
  // Còn cái lựa chọn thứ 3 là cái approval blog như bên approval 
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.optionBar}>
     
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.All && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.All)}
        >
          <Text style={styles.optionText}>{isUserAdminOrOwner ? "All Published Blogs" : "All Blogs"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.MyBlogs && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.MyBlogs)}
        >
          <Text style={styles.optionText}>My Blogs</Text>
        </TouchableOpacity>
        {/* TODO: ẤN nút này thì copy cái bên approval qua */}
        {isUserAdminOrOwner && (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTab === TabOptions.NeedApproval &&
                styles.optionButtonActive,
            ]}
            onPress={() => setSelectedTab(TabOptions.NeedApproval)}
          >
            <Text style={styles.optionText}>Need Approval</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Animated FlatList */}
      {/* <Animated.FlatList
        data={mockBlog}
        renderItem={renderItem}
        keyExtractor={(item) => item.BlogID}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
        ref={flatlistRef}
      /> */}
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
  optionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    borderRadius: 14,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B4C55",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionButtonActive: {
    backgroundColor: "#5CA0D3", // Active tab color
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
});
