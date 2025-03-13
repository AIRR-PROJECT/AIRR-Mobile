import { Blog } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "../tabs/feed/FeedBlogPreview";
import { View } from "react-native";
const mockBlog: Blog = {
  title: "How to fix clipboard if it isn’t working",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  description: "Blog Description",
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
  return (
    <FlashList
      data={Data}
      scrollEnabled={false}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        return <FeedBlogPreview blog={item} />;
      }}
      estimatedItemSize={400}
    />
  );
}
