import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import GroupPageContent from "@/components/group/GroupPageContent";
import { loremIpsum } from "lorem-ipsum";
import FeedBlogPreview from "@/components/tabs/feed/FeedBlogPreview";
import { SectionGrid } from "react-native-super-grid";
const mockBlog = {
  Title: "How to fix clipboard if it isn’t working",
  BackgroundURL:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0jQPcLR2zDp6yPjuN6OqywK4v0ybNPxu1kw&s",
  Description: "Blog Description",
  content: loremIpsum({ count: 50, units: "paragraphs" }),
  timestamp: new Date().toISOString(),
  Author: {
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
  Tags: ["Frontend", "Backend", "React", "NodeJS", "Express"],
};
const Data = Array(10).fill(mockBlog);
const mockTags = [
  { id: "A", data: ["Artificial Intelligence", "Agile", "Android", "AWS"] },
  { id: "B", data: ["Blockchain", "Bootstrap", "Babel", "Bitbucket"] },
  { id: "C", data: ["C++", "CSS", "C#", "CI/CD", "Cloud Computing"] },
  { id: "D", data: ["Docker", "Django", "Dart", "DNS", "Data Science"] },
  {
    id: "E",
    data: ["Ethereum", "Elixir", "Express.js", "Electron", "ECMAScript"],
  },
  { id: "F", data: ["Firebase", "Flutter", "Figma", "FastAPI", "F#"] },
  { id: "G", data: ["Git", "Go", "GraphQL", "Gatsby", "GCP"] },
  { id: "H", data: ["HTML", "Heroku", "Hibernate", "Hadoop", "HTTP"] },
  { id: "I", data: ["IoT", "iOS", "InVision", "Infrastructure", "Ionic"] },
  { id: "J", data: ["JavaScript", "Java", "Jenkins", "Jest", "JQuery"] },
  { id: "K", data: ["Kubernetes", "Kafka", "Kotlin", "Knex.js", "Kivy"] },
  { id: "L", data: ["Linux", "Laravel", "Lua", "Load Balancer", "Logstash"] },
  {
    id: "M",
    data: ["MongoDB", "MySQL", "Machine Learning", "Markdown", "MUI"],
  },
  { id: "N", data: ["Node.js", "Next.js", "NestJS", "Nginx", "NoSQL"] },
  { id: "O", data: ["OpenAI", "OAuth", "OpenCV", "OpenGL", "Objective-C"] },
  { id: "P", data: ["Python", "PostgreSQL", "PHP", "Perl", "Pandas"] },
  { id: "Q", data: ["Quantum Computing", "QML", "QUnit", "Qlik", "Quasar"] },
  { id: "R", data: ["React", "Redis", "Rust", "Ruby", "Redux"] },
  { id: "S", data: ["SQL", "Sass", "Spring Boot", "Scala", "Swift"] },
  {
    id: "T",
    data: ["TypeScript", "Tailwind CSS", "TensorFlow", "Terraform", "Tauri"],
  },
  { id: "U", data: ["Unity", "Ubuntu", "UI/UX", "Unreal Engine", "UML"] },
  { id: "V", data: ["Vue.js", "Vite", "Vercel", "VS Code", "Vagrant"] },
  { id: "W", data: ["WebAssembly", "Webpack", "WebRTC", "WordPress", "Web3"] },
  { id: "X", data: ["Xamarin", "XML", "Xcode", "XSS", "XAMPP"] },
  { id: "Y", data: ["YAML", "Yarn", "YouTube API", "YAGNI"] },
  { id: "Z", data: ["Zig", "Zustand", "Zod", "Zookeeper", "Zigbee"] },
];

export default function GroupPage() {
  const [selectedId, setSelectedId] = useState(1);
  return (
    <View style={styles.container}>
      {selectedId === 1 ? (
        <FlatList
          ListHeaderComponent={
            <GroupPageContent
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          }
          data={Data}
          renderItem={({ item }) => <FeedBlogPreview blog={item} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        />
      ) : (
        <SectionGrid
          ListHeaderComponent={
            <GroupPageContent
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          }
          sections={mockTags}
          itemDimension={150} // Controls column width
          spacing={10} // Spacing between items
          style={styles.gridView}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tagContainer}>
              <Text style={styles.tag}>{item}</Text>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.title}>{section.id}</Text>
          )}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  tagContainer: {
    padding: 10,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    marginVertical: 5,
    width: 160,
  },
  tag: {
    fontSize: 16,
    color: "#fff",
  },
  gridView: {
    flex: 1,
  },
});
