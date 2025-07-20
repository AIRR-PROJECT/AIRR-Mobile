import { UserBlog } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "../tabs/feed/FeedBlogPreview";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import queryClient from "@/redux/api/queryClient";
import { fetchOtherPersonalBlogs, fetchPersonalBlogs, fetchUserBlogs } from "@/redux/slices/feedSlice";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { Dispatch, MutableRefObject, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { getUserGroupStatus } from "@/redux/slices/groupSlice";
import { BlogViewType } from "@/enums/blog_properties.enum";
import MoreOptionBottomList from "../blog/MoreOptionBottomList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeedBlogPreviewSkeleton from "../tabs/feed/FeedBlogPreviewSkeleton";
import { EmptyContent } from "../EmptyContent";
const mockBlog: UserBlog = {
  _id: "123",
  Title: "How to fix clipboard if it isn’t working",
  BackgroundURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  Description: "Blog Description",
  //content: loremIpsum({ count: 50, units: "paragraphs" }),
  //timestamp: new Date().toISOString(),
  Author: {
    Username: "Name of the Author",
    AvatarURL: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
    _id: "123",
    CreateDate: "2021-09-01",
  },
  Tags: [
    {
      _id: "123",
      TagName: "Frontend",
    },
    {
      _id: "123",
      TagName: "Backend",
    },
    {
      _id: "123",
      TagName: "React",
    },
    {
      _id: "123",
      TagName: "NodeJS",
    },
    {
      _id: "123",
      TagName: "Express",
    },
  ],
  Group: {
    CoverURL: "https://groupworkandcommunication2018.wordpress.com/wp-content/uploads/2018/10/group.png",
    Name: "Group's name",
    NumberOfMembers: 123,
    _id: "",
    Description: ""
  },
  UserInteraction: "like",
  Reaction: {
    Likes: 123,
    Dislikes: 123,
    Comments: 123,
  },
  IsSavedByUser: false
};
const Data = [
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
  mockBlog,
];

type BlogTabProps = {
  moreOptionRef: RefObject<BottomSheet>,
  setIsUserWrittenBlog: Dispatch<SetStateAction<boolean>>
  setRole: Dispatch<SetStateAction<string>>
  setBlogStatus: Dispatch<SetStateAction<string>>
  setIsViewTypePrivateOrInProfile: Dispatch<SetStateAction<boolean>>
  setIsAlreadyReported: Dispatch<SetStateAction<boolean>>
  setMoreOptionBlogId: Dispatch<SetStateAction<string>>
  setMoreOptionGroupId: Dispatch<SetStateAction<string>>
  handleHideBlog: MutableRefObject<() => void>
  handleDeleteBlog: MutableRefObject<() => void>
}

export default function BlogTab({ moreOptionRef, setIsUserWrittenBlog, setRole, setBlogStatus, setIsViewTypePrivateOrInProfile, setIsAlreadyReported, setMoreOptionBlogId, setMoreOptionGroupId, handleHideBlog, handleDeleteBlog }: BlogTabProps) {
  const { userID, blogIdToRemove } = useLocalSearchParams<{ userID: string, blogIdToRemove: string }>()
  const { user } = useAppSelector(state => state.user)

  const dispatch = useAppDispatch();
  const [personalPage, setPersonalPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false)

  const handlePressMoreOption = (isUserWritten: boolean, blogId: string, groupId: string, role: string, blogStatus: string, isViewTypePrivateOrInProfile: boolean, isAlreadyReported: boolean) => {
    setIsUserWrittenBlog(isUserWritten);
    setIsViewTypePrivateOrInProfile(isViewTypePrivateOrInProfile)
    setIsAlreadyReported(isAlreadyReported)
    setMoreOptionBlogId(blogId)
    setMoreOptionGroupId(groupId)
    setRole(role)
    setBlogStatus(blogStatus)

    handleHideBlog.current = () => {personalBlogsReset.mutateAsync();}
    handleDeleteBlog.current = () => {personalBlogsReset.mutateAsync();}

    if (moreOptionRef.current) {
      moreOptionRef.current.snapToIndex(0);
    }
    // console.log("More option pressed", isUserWritten)
  };

  const personalBlogsQuery = useQuery({
    queryKey: ["feed-personal"],
    queryFn: async () => {
      if (!userID) {
        const fetchedBlogs = await dispatch(fetchPersonalBlogs(personalPage));
  
        return fetchedBlogs.payload.blogList.blogs as UserBlog[];
      }
      else {
        const fetchedBlogs = await dispatch(fetchOtherPersonalBlogs({ otherUserID: userID, page: personalPage }));
  
        return fetchedBlogs.payload.blogList.blogs as UserBlog[];
      }
    },
    placeholderData: keepPreviousData,
  });
  const personalBlogsMutation = useMutation({
    mutationFn: async (page: number) => {
      if (!userID) {
        const moreFetchedBlogs = await dispatch(fetchPersonalBlogs(page));

        return moreFetchedBlogs.payload.blogList.blogs as UserBlog[];
      }
      else {
        const moreFetchedBlogs = await dispatch(fetchOtherPersonalBlogs({ otherUserID: userID, page: personalPage }));
  
        return moreFetchedBlogs.payload.blogList.blogs as UserBlog[];
      }
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-personal"], (oldData: any) => {
        console.log(data)
        return [...oldData, ...data] as UserBlog[];
      });
    },
  });
  const personalBlogsReset = useMutation({
    mutationFn: async () => {
      const refetchedBlog = await dispatch(fetchPersonalBlogs(1));

      return refetchedBlog.payload.blogList.blogs as UserBlog[];
    },
    onSuccess: (data: any) => {
      queryClient.setQueryData(["feed-personal"], (oldData: any) => {
        return [...data] as UserBlog[];
      });
      setPersonalPage(1)
    },
  });
  const handleOnUserBlogListEndReached = () => {
    console.log("End reached")
    setPersonalPage(personalPage + 1);
    personalBlogsMutation.mutate(personalPage + 1);
  };
  
  useEffect(() => {
    setIsFetching(true)
    personalBlogsReset.mutateAsync().then(() => setIsFetching(false))
  }, [])
  
  // Handle hiding or deleting blog while viewing that blog
  useEffect(() => {
    if (blogIdToRemove) {
      setIsFetching(true)
      personalBlogsReset.mutateAsync().then(() => setIsFetching(false));

      router.setParams({
        blogIdToRemove: undefined
      })
    }
  }, [blogIdToRemove])

  return (
    isFetching ?
    <FeedBlogPreviewSkeleton/> :
    personalBlogsQuery.data?.length == 0 ?
    <EmptyContent/> :
    user && <View>
      <FlashList
        data={personalBlogsQuery.data}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        renderItem={({ item }) => {
          console.log(item)
          return <FeedBlogPreview blog={item} onPressMoreButton={
            () => handlePressMoreOption(item.Author._id === user._id, item._id, item.Group?._id,
              item.UserGroupStatus,
              item.Status,
              item.ViewType != BlogViewType.IN_GROUP,
              item.IsReportedByUser
            )
          }/>;
        }}
      
        estimatedItemSize={400}
      />
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleOnUserBlogListEndReached}>
        <Text style={styles.loadMoreText}>Load more blogs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadMoreButton: {
    backgroundColor: "#B9FF66",
    marginHorizontal: 30,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#000",
    fontWeight: "bold",
  },
});
