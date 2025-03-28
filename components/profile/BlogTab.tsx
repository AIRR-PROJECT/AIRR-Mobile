import { UserBlog } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "../tabs/feed/FeedBlogPreview";
import { View } from "react-native";
import queryClient from "@/redux/api/queryClient";
import { fetchUserBlogs } from "@/redux/slices/feedSlice";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/hook";
import { useState } from "react";
const mockBlog: UserBlog = {
  _id: "123",
  Title: "How to fix clipboard if it isn’t working",
  BackgroundURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  Description: "Blog Description",
  //content: loremIpsum({ count: 50, units: "paragraphs" }),
  //timestamp: new Date().toISOString(),
  Author: {
    Username: "Name of the Author",
    AvatarURL:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg",
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
    CoverURL:
      "https://groupworkandcommunication2018.wordpress.com/wp-content/uploads/2018/10/group.png",
    Name: "Group's name",
    NumberOfMembers: 123,
  },
  UserInteraction: "like",
  Reaction: {
    Likes: 123,
    Dislikes: 123,
    Comments: 123,
  },
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
  const dispatch = useAppDispatch();
  const [userPage, setUserPage] = useState(1);
  const userBlogsQuery = useQuery({
    queryKey: ["feed-user"],
    queryFn: async () => {
      const fetchedBlogs = await dispatch(fetchUserBlogs(userPage));

      console.log(fetchedBlogs.payload.blogList.blogs);
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
  const handleOnUserBlogListEndReached = () => {
    setUserPage(userPage + 1);
    userBlogsMutation.mutate(userPage + 1);
  };

  return (
    <FlashList
      data={userBlogsQuery.data}
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
