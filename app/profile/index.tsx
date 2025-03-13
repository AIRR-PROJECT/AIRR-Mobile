import { View, Text, StyleSheet, FlatList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import UserInfoComponent from "@/components/profile/UserInfoComponent";
import UserStudentInfoComponent from "@/components/profile/UserStudentInfoComponent";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Blog } from "@/interfaces/blogInterface";
import { loremIpsum } from "lorem-ipsum";
import GroupPreviewInfo from "@/components/tabs/GroupPreviewInfo";
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
  return (
    // change light color to #fff later because figma of the app is not ready
    <View style={styles.container}>
      {/* User Info */}
      <UserInfoComponent {...mockUserInfo} />
      {/* User student info */}
      <UserStudentInfoComponent {...mockStudentInfo} />

      {/* Active groups */}
      <ThemedText style={styles.groupLabel}>Active in these group</ThemedText>
      <View style={[styles.rowContainer, ]}>
        <FontAwesome name="plus-circle" size={50} color="white"  style={styles.plusIcon} />
        <FlatList
          data={Data}
          horizontal={true}
          style={styles.groupContainer}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ columnGap: 25 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return <GroupPreviewInfo group={item} />;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
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
  groupContainer: {
   
  },
  plusIcon: {
    alignSelf: "center",
    backgroundColor: "#1E1E1E",
    marginRight: 20,
  },
});
