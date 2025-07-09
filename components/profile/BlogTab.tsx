import { UserBlog } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "../tabs/feed/FeedBlogPreview";
import { View } from "react-native";
import queryClient from "@/redux/api/queryClient";
import { fetchOtherPersonalBlogs, fetchPersonalBlogs, fetchUserBlogs } from "@/redux/slices/feedSlice";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
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

export default function BlogTab() {
  const { userID, blogIdToRemove } = useLocalSearchParams<{ userID: string, blogIdToRemove: string }>()

  const dispatch = useAppDispatch();
  const [personalPage, setPersonalPage] = useState(1);
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
  
  // Handle hiding or deleting blog while viewing that blog
  useEffect(() => {
    if (blogIdToRemove) {
      personalBlogsReset.mutateAsync();
    }
  }, [blogIdToRemove])

  return (
    <FlashList
      data={personalBlogsQuery.data}
      scrollEnabled={false}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
      showsHorizontalScrollIndicator={false}
      onEndReached={handleOnUserBlogListEndReached}
      renderItem={({ item }) => {
        return <FeedBlogPreview blog={item} />;
      }}
     
      estimatedItemSize={400}
    />
  );
}
