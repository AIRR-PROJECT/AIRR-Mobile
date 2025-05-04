import DetailGroupCardComponent from "@/components/group/DetailGroupCardComponent";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import ButtonGradient from "@/components/ButtonGradient";
import {
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Divider } from "@rneui/base";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/redux/hook";
import { getGroupInfo } from "@/redux/slices/groupSlice";
import { GroupDetailInfo } from "@/interfaces/groupInterface";
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
const mockGroupDetail: GroupDetailInfo = {
  Name: "The Data-Driven Minds Collective",
  _id: "data_minds",
  CoverURL: "https://picsum.photos/325",
  Field: {
    _id: "web-dev",
    FieldName: "Web Development"
  },
  posts: 100,
  views: 2000,
  TotalNumberOfBlogsLikes: 500,
  Description:
    "This group is for React developers of all levels to share knowledge, ask questions, and discuss best practices. Stay updated on the latest features, libraries, and trends in the React ecosystem. Happy coding...",
  threeUserAvatar: [
    "https://picsum.photos/350",
    "https://picsum.photos/350",
    "https://picsum.photos/350",
  ],
  NumberOfMembers: 100,
  isJoined: false,
};
type GroupPageProps = {
  selectedId: number;
  setSelectedId: (id: number) => void;
  groupID: string
};

const joinConfirmImage = require("@/assets/images/group/join_confirm.png");

export default function GroupPageContent({
  selectedId,
  setSelectedId,
  groupID
}: GroupPageProps) {
  const route = useRouter();
  const dispatch = useAppDispatch()

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupDetailInfo>()

  useEffect(() => {
    dispatch(getGroupInfo({
      groupID
    })).then((res) => {
      setGroupInfo(res.payload as GroupDetailInfo)
    })
  }, [groupID])

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handlePressGroupMemberList = () => {
    // Handle the press event for the group member list
    route.push("/group/group-member-list");
  };
  return (
    <View style={styles.container}>
      <View>
        <DetailGroupCardComponent {...groupInfo ? {...groupInfo, posts: 1, views: 1} : mockGroupDetail} />
      </View>
      {/* Description */}
      <Text style={styles.description}>{groupInfo ? groupInfo.Description : mockGroupDetail.Description}</Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.infoContainer}
          activeOpacity={0.8}
          onPress={handlePressGroupMemberList}
        >
          {/* Three example user images */}
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
          {/* Number of member */}
          <Text style={styles.member}>+{mockGroupDetail.NumberOfMembers}</Text>
        </TouchableOpacity>
        {/* render based on user is in group or not */}
        {!mockGroupDetail.isJoined ? (
          <ButtonGradient
            label="Join Group"
            labelStyle={styles.tabButtonText}
            style={styles.tabButton}
            onPress={() => {
              setIsModalVisible(true);
            }}
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
          {/* Blogs Tab */}
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
          {/* Tags Tab */}
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
        {mockGroupDetail.isJoined ? (
          selectedId === 1 ? (
            <CreatePost />
          ) : (
            <CreateTags />
          )
        ) : null}
      </View>
      <Divider color="#242630" width={1} style={{ paddingTop: 0 }} />
      {/* Search Bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={24} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder={selectedId === 1 ? "Search Blog" : "Search Tag"}
            placeholderTextColor={"#8A94AC"}
          />
        </View>
      </View>

      {/* Modal for group join */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        {/* Modal overlay */}
        <Pressable
          style={styles.modalOverlay}
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              handleCancel();
            }
          }}
        >
          <View style={styles.groupJoinModal}>
            <Image style={styles.joinConfirmImage} source={joinConfirmImage} />
            <View style={{ flex: 1 }}>
              <View style={{}}>
                <Text style={styles.joinModalTitle}>
                  Are You Ready to Join the Group?
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                  style={styles.joinCancelButton}
                >
                  <Text style={styles.joinCancelButtonText}>
                    LET ME RETHINK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                  style={styles.joinConfirmButton}
                >
                  <Text style={styles.joinConfirmButtonText}>COUNT ME IN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    backgroundColor: "#1E1E1E",
  },
  description: {
    color: "#fff",
    marginTop: 8,
    textAlign: "justify",
    fontSize: 14,
    lineHeight: 25,
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
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 9999,
  },
  textInput: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
  },
  textInputContainer: {
    paddingTop: 20,
  },
  groupJoinModal: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  joinConfirmImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  joinCancelButton: {
    backgroundColor: "#1B1F26",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  joinCancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  joinConfirmButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(36, 87, 75, 0.5)", // Semi-transparent dark background
  },
  joinModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
