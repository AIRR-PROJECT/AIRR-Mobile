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
import { loremIpsum } from "lorem-ipsum";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
import { useEffect, useState } from "react";
import TabButton from "@/components/tabs/feed/TabButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ReadmeTab from "@/components/profile/ReadmeTab";
import ParallaxFlatList from "@/components/ParallaxFlatList";
import BlogTab from "@/components/profile/BlogTab";
import { Divider } from "@rneui/themed";
import ActivityTab from "@/components/profile/ActivityTab";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { User } from "@/interfaces/userInterface";
import { getUserPreviewGroups } from "@/redux/slices/authSlice";
// type UserInfo = {
//   username: string;
//   avatar_url: string;
//   firstName: string;
//   lastName: string;
//   // followers: number;
//   // following: number;
// };
// const mockUserInfo: UserInfo = {
//   username: "john_doe",
//   avatar_url: "https://picsum.photos/600",
//   firstName: "John Doe",
//   lastName: "Joined November 2021",
//   // followers: 100,
//   // following: 200,
// };
// type StudentInfo = {
//   studentID: string;
//   department: string;
// };
// const mockStudentInfo: StudentInfo = {
//   studentID: "21121234",
//   department: "Software Engineering",
// };

type UserInfo = Pick<User, "username" | "avatar_url" | "firstName" | "lastName" | "joinDate">
type StudentInfo = Pick<User, "profile">

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

  const { user, userGroups } = useAppSelector(state => state.user);
  const [userInfo, setUserInfo] = useState<UserInfo>(user!)
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(user!)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserPreviewGroups(user!["_id"]))
  }, [])

  useEffect(() => {
    console.log(userGroups)
  }, [userGroups])

  return (
    // change light color to #fff later because figma of the app is not ready

    <ParallaxScrollView style={styles.container}>
      {/* User Info */}
      <UserInfoComponent {...userInfo} />
      {/* User student info */}
      <UserStudentInfoComponent {...studentInfo} />

      {/* Active groups */}
      <ThemedText style={styles.groupLabel}>Active in these group</ThemedText>
      <FlatList
        data={userGroups}
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
      {selectedTab === "Activity" && <ActivityTab/>}
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
