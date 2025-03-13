import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import UserInfoComponent from "@/components/profile/UserInfoComponent";
import UserStudentInfoComponent from "@/components/profile/UserStudentInfoComponent";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Blog } from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import { useState } from "react";
import TabButton from "@/components/tabs/feed/TabButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ReadmeTab from "@/components/profile/ReadmeTab";
import ParallaxFlatList from "@/components/ParallaxFlatList";
import BlogTab from "@/components/profile/BlogTab";
import { Divider } from "@rneui/themed";
type MockUserInfo = {
  username: string;
  avatar: string;
  fullName: string;
  dateJoined: string;
  followers: number;
  following: number;
};
const mockUserInfo: MockUserInfo = {
  username: "john_doe",
  avatar: "https://picsum.photos/600",
  fullName: "John Doe",
  dateJoined: "Joined November 2021",
  followers: 100,
  following: 200,
};
type MockStudentInfo = {
  studentId: string;
  departure: string;
};
const mockStudentInfo: MockStudentInfo = {
  studentId: "21121234",
  departure: "Software Engineering",
};

const mockGroup = {
  name: "Group's name",
  avatar: "https://picsum.photos/300",
  numberOfMembers: 123,
};
const Data = [
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
];
export default function ProfileScreen() {
  const selectedTabs = ["Readme", "Blog", "Activity"];
  const [selectedTab, setSelectedTab] = useState(selectedTabs[0]);

  return (
    // change light color to #fff later because figma of the app is not ready

    <ParallaxScrollView style={styles.container}>
      {/* User Info */}
      <UserInfoComponent {...mockUserInfo} />
      {/* User student info */}
      <UserStudentInfoComponent {...mockStudentInfo} />

      {/* Active groups */}
      <ThemedText style={styles.groupLabel}>Active in these group</ThemedText>
      <FlatList
        data={Data}
        horizontal={true}
        style={styles.groupContainer}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ columnGap: 25 }}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={
          <FontAwesome
            name="plus-circle"
            size={50}
            color="white"
            style={styles.plusIcon}
          />
        }
        renderItem={({ item }) => {
          return <GroupPreviewInfo group={item} />;
        }}
      />

      {/* Readme , Blog, Activity */}
      <View style={styles.rowContainer}>
        {selectedTabs.map((tab) => {
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                {
                  backgroundColor: selectedTab === tab ? "#2F2F2F" : "#1E1E1E",
                  borderRadius: 10,
                  borderBottomWidth: selectedTab === tab ? 1 : 0,
                  borderBottomColor: "#fff",
                },
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab ? "#fff" : "#8A94AC",
                  },
                ]}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
      <Divider orientation="horizontal" style={{ width: "100%", borderColor: "#fff", borderWidth: 1 }}/>
      {/* Readme if tab == readme */}
      {selectedTab === "Readme" && <ReadmeTab />}
      {selectedTab === "Blog" && <BlogTab />}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    gap: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ACACAC",
  },
  groupContainer: {},
  plusIcon: {
    alignSelf: "center",
    backgroundColor: "#1E1E1E",
    padding: 10,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabText: {
    color: "#8A94AC",
    fontWeight: "bold",
  },
});
