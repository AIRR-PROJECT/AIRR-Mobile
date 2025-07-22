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
import { SetStateAction, useEffect, useRef, useState } from "react";
import TabButton from "@/components/tabs/feed/TabButton";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SocialTab from "@/components/profile/SocialTab";
import ParallaxFlatList from "@/components/ParallaxFlatList";
import BlogTab from "@/components/profile/BlogTab";
import { Divider } from "@rneui/themed";
import ActivityTab from "@/components/profile/ActivityTab";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { PartialUser, User } from "@/interfaces/userInterface";
import {
  getPartialUserInfo,
  getUserPreviewGroups,
} from "@/redux/slices/authSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { signOut } from "@react-native-firebase/auth";
import { setIsViewingOwnProfile } from "@/redux/slices/userSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MoreOptionBottomList from "@/components/blog/MoreOptionBottomList";
import BottomSheet from "@gorhom/bottom-sheet";
import { getAllJoinedGroups } from "@/redux/slices/groupSlice";
import { Group } from "@/interfaces/groupInterface";
import ProfileGroupPreviewInfo from "@/components/group/ProfileGroupPreviewInfo";
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

type UserInfo = Pick<
  User,
  "username" | "avatarURL" | "firstName" | "lastName" | "dateOfBirth"
>;
type StudentInfo = Pick<User, "profile">;

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
  const { userID } = useLocalSearchParams<{ userID: string }>();

  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("");

  const { user, isViewingOwnProfile } = useAppSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState<UserInfo>(user!);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(user!);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);

  const moreOptionRef = useRef<BottomSheet>(null);
  const [isUserWrittenBlog, setIsUserWrittenBlog] = useState(false);
  const [role, setRole] = useState("");
  const [blogStatus, setBlogStatus] = useState("");
  const [isViewTypePrivateOrInProfile, setIsViewTypePrivateOrInProfile] =
    useState(false);
  const [isAlreadyReported, setIsAlreadyReported] = useState(false);
  const [moreOptionBlogId, setMoreOptionBlogId] = useState("");
  const [moreOptionGroupId, setMoreOptionGroupId] = useState("");
  const handleHideBlog = useRef<() => void>(() => {});
  const handleDeleteBlog = useRef<() => void>(() => {});

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userID) {
      dispatch(setIsViewingOwnProfile(false));
      dispatch(getPartialUserInfo(userID)).then((res) => {
        const currentUserInfo = res.payload as PartialUser;
        if (res.payload) {
          setUserInfo(currentUserInfo);
          setStudentInfo(currentUserInfo);
        }
      });
    } else {
      dispatch(setIsViewingOwnProfile(true));
    }

    dispatch(getAllJoinedGroups()).then((res) => {
      const data = res.payload as Group[];

      setJoinedGroups(data);
    });
  }, []);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  useEffect(() => {
    console.log(joinedGroups);
  }, [joinedGroups]);

  useEffect(() => {
    if (isViewingOwnProfile) {
      setSelectedTabs(["Social", "Blog", "Activity"]);
    } else {
      setSelectedTabs(["Social", "Blog"]);
    }
    setSelectedTab("Social");
  }, [isViewingOwnProfile]);

  const route = useRouter();
  const handleCreateGroup = () => {
    route.push("/group/create-group");
  };
  return (
    // change light color to #fff later because figma of the app is not ready

    <GestureHandlerRootView>
      <ParallaxFlatList style={styles.container} contentStyle={{ padding: 0 }}>
        {/* User Info */}
        <View style={{ padding: 20, gap: 20 }}>
          <UserInfoComponent {...userInfo} isOwnProfile={isViewingOwnProfile} />

          {/* User student info */}

          <UserStudentInfoComponent {...studentInfo} />

          {/* Active groups */}
          {/* TODO: Integrate API when have */}
          <ThemedText style={styles.groupLabel}>
            Active in these group
          </ThemedText>
          {joinedGroups && joinedGroups.length > 0 ? (
            <FlatList
              data={joinedGroups}
              horizontal={true}
              style={styles.groupContainer}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ columnGap: 25 }}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCreateGroup}
                >
                  <FontAwesome
                    name="plus-circle"
                    size={50}
                    color="white"
                    style={styles.plusIcon}
                  />
                </TouchableOpacity>
              }
              renderItem={({ item }) => {
                return <ProfileGroupPreviewInfo group={item} />;
              }}
            />
          ) : (
            <View style={{ alignItems: "center", flexDirection: "row", }}>
              <TouchableOpacity activeOpacity={0.7} onPress={handleCreateGroup}>
                <FontAwesome
                  name="plus-circle"
                  size={50}
                  color="white"
                  style={styles.plusIcon}
                />
              </TouchableOpacity>
              <Text style={{ color: "#ACACAC", fontSize: 16, flex: 1 }}>
                No groups joined. Press the plus icon to create a group.
              </Text>
            </View>
          )}

          {/* Social , Blog, Activity */}
          <View style={styles.rowContainer}>
            {selectedTab && selectedTabs.length != 0 &&
              selectedTabs.map((tab) => {
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      {
                        backgroundColor:
                          selectedTab === tab ? "#2F2F2F" : "#1E1E1E",
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
        </View>
        <Divider
          orientation="horizontal"
          style={{ width: "100%", borderColor: "#fff", borderWidth: 1 }}
        />

        {/* Readme if tab == readme */}
        <View style={{ padding: 20 }}>
          {selectedTab === "Social" &&
            (user && user.profile && user.profile.link ? (
              <SocialTab
                link={""}
                facebookLink={user.profile.link.Facebook}
                linkedInLink={user.profile.link.LinkedIn}
                githubLink={user.profile.link.Github}
                showSignOut={isViewingOwnProfile}
              />
            ) : (
              <SocialTab
                link={""}
                facebookLink={"No information"}
                linkedInLink={"No information"}
                githubLink={"No information"}
                showSignOut={isViewingOwnProfile}
              />
            ))}
          {selectedTab === "Activity" && <ActivityTab />}
        </View>
        {selectedTab === "Blog" && (
          <BlogTab
            moreOptionRef={moreOptionRef}
            setIsUserWrittenBlog={setIsUserWrittenBlog}
            setRole={setRole}
            setBlogStatus={setBlogStatus}
            setIsViewTypePrivateOrInProfile={setIsViewTypePrivateOrInProfile}
            setIsAlreadyReported={setIsAlreadyReported}
            setMoreOptionBlogId={setMoreOptionBlogId}
            setMoreOptionGroupId={setMoreOptionGroupId}
            handleHideBlog={handleHideBlog}
            handleDeleteBlog={handleDeleteBlog}
          />
        )}
      </ParallaxFlatList>

      <MoreOptionBottomList
        sheetRef={moreOptionRef}
        isUserWrittenBlog={isUserWrittenBlog}
        blogId={moreOptionBlogId}
        groupId={moreOptionGroupId}
        role={role}
        blogStatus={blogStatus}
        isFromFeed={true}
        isFromDetail={false}
        isViewTypePrivateOrInProfile={isViewTypePrivateOrInProfile}
        isAlreadyReported={isAlreadyReported}
        handleHideThisBlog={handleHideBlog.current}
        handleDeleteThisBlog={handleDeleteBlog.current}
      />
    </GestureHandlerRootView>
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
