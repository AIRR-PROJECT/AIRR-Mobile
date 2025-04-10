import DetailGroupCardComponent from "@/components/group/DetailGroupCardComponent";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import ButtonGradient from "@/components/ButtonGradient";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Divider } from "@rneui/base";
type GroupDetailProps = {
  name: string;
  id: string;
  avatar: string;
  tag: string;
  posts: number;
  views: number;
  likes: number;
  description: string;
  threeUserAvatar: string[];
  numberOfMembers: number;
  isUserInGroup?: boolean;
};
const mockGroupDetail: GroupDetailProps = {
  name: "The Data-Driven Minds Collective",
  id: "data_minds",
  avatar: "https://picsum.photos/325",
  tag: "Web Development",
  posts: 100,
  views: 2000,
  likes: 500,
  description:
    "This group is for React developers of all levels to share knowledge, ask questions, and discuss best practices. Stay updated on the latest features, libraries, and trends in the React ecosystem. Happy coding...",
  threeUserAvatar: [
    "https://picsum.photos/350",
    "https://picsum.photos/350",
    "https://picsum.photos/350",
  ],
  numberOfMembers: 100,
  isUserInGroup: true,
};

export default function GroupPage() {
  const [selectedId, setSelectedId] = useState(1);
  return (
    <View style={styles.container}>
      <View style={{ padding: 20 }}>
        <DetailGroupCardComponent {...mockGroupDetail} />
      </View>
      {/* Description */}
      <Text style={styles.description}>{mockGroupDetail.description}</Text>
      <View style={styles.rowContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={mockGroupDetail.threeUserAvatar[0]}
              style={[styles.memberImage, { marginLeft: 0 }]}
            />
            <Image
              source={mockGroupDetail.threeUserAvatar[1]}
              style={[styles.memberImage, { marginLeft: -5 }]}
            />
            <Image
              source={mockGroupDetail.threeUserAvatar[2]}
              style={[styles.memberImage, { marginLeft: -5 }]}
            />
          </View>
          <Text style={styles.member}>+{mockGroupDetail.numberOfMembers}</Text>
        </View>
        {!mockGroupDetail.isUserInGroup ? (
          <ButtonGradient
            label="Join Group"
            labelStyle={styles.tabButtonText}
            style={styles.tabButton}
          />
        ) : null}
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={55}
          color="white"
        />
      </View>
      <Divider color="#242630" width={1} style={{ paddingTop: 20 }} />
      <View style={styles.rowWrapper}>
        {/* Tabs */}
        <View style={styles.tabList}>
          <TouchableOpacity
            style={[styles.tabItem, selectedId === 1 && styles.tabItemActive]}
            onPress={() => {
              setSelectedId(1);
            }}
          >
            <Text
              style={{
                color: selectedId === 1 ? "#fff" : "#8A94AC",
                fontWeight: "bold",
              }}
            >
              Blogs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabItem, selectedId === 2 && styles.tabItemActive]}
            onPress={() => {
              setSelectedId(2);
            }}
          >
            <Text
              style={{
                color: selectedId === 2 ? "#fff" : "#8A94AC",
                fontWeight: "bold",
              }}
            >
              Tags
            </Text>
          </TouchableOpacity>
        </View>

        {/* Create Post */}
        {mockGroupDetail.isUserInGroup ? (
          selectedId === 1 ? (
            <CreatePost />
          ) : (
            <CreateTags />
          )
        ) : null}
      </View>
      <Divider color="#242630" width={1} style={{ paddingTop: 0 }} />
    </View>
  );
}
function CreatePost() {
  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity style={styles.tabButton}>
        <Text style={styles.tabButtonText}>+ Create Post</Text>
      </TouchableOpacity>
      <Entypo name="select-arrows" size={24} color="#B9FF66" />
    </View>
  );
}
function CreateTags() {
  return (
    <View>
      <TouchableOpacity style={styles.tabButton}>
        <Text style={styles.tabButtonText}>+ Request Tag</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  description: {
    color: "#fff",
    marginTop: 8,
    textAlign: "justify",
    fontSize: 14,
    lineHeight: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: "#373B43",
  },
  memberImage: {
    width: 30,
    height: 30,
    borderRadius: 90,
  },
  member: {
    fontSize: 16,
    color: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  tabButton: {
    width: 140,
    height: 40,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B9FF66",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  tabList: {
    flexDirection: "row",
    paddingVertical: 20,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  tabItemActive: {
    backgroundColor: "#363B47",
  },
});
