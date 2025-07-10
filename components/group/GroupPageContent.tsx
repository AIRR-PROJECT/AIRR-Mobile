import DetailGroupCardComponent from "@/components/group/DetailGroupCardComponent";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import ButtonGradient from "@/components/ButtonGradient";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "@rneui/base";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getGroupInfo,
  requestJoinGroup,
  setGroupBlogsSearchText,
  setGroupTagsSearchText,
} from "@/redux/slices/groupSlice";
import { GroupDetailInfo, GroupRule } from "@/interfaces/groupInterface";
import {
  setUserMembershipStageInCurrentGroup,
  setUserRoleInCurrentGroup,
} from "@/redux/slices/userSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GroupMembershipStage, GroupRole } from "@/enums/group.enum";
import Scroll from "quill/blots/scroll";
import BlogMoreOptionBottomList from "./BlogMoreOptionBottomList";
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
    FieldName: "Web Development",
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
  groupID: string;
  sheetRef: React.RefObject<BottomSheet>;

  // selectedBlogFilter: string;
  // setSelectedBlogFilter: (filter: string) => void;
  // selectedTagFilter: string;
  // setSelectedTagFilter: (filter: string) => void;
};

const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
const blogsFilters = ["All blogs", "Needs approval"];
const tagsFilters = ["All tags", "Needs approval"];
export default function GroupPageContent({
  selectedId,
  setSelectedId,
  groupID,
  sheetRef,
}: // selectedBlogFilter,
// setSelectedBlogFilter,
// selectedTagFilter,
// setSelectedTagFilter,

GroupPageProps) {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const { userCurrentGroupMembershipStage, userCurrentGroupRole } =
    useAppSelector((state) => state.user);
  const [isShowRules, setIsShowRules] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Join Group");
  const [isGroupJoinModalVisible, setIsGroupJoinModalVisible] = useState(false);
  const [isCancelRequestModalVisible, setIsCancelRequestModalVisible] =
    useState(false);
  const [isLeaveGroupModalVisible, setIsLeaveGroupModalVisible] =
    useState(false);
  const searchText = useRef("");
  let textInputRef: TextInput;
  const [isBlogsFilterModalVisible, setIsBlogsFilterModalVisible] =
    useState(false);
  const [isTagsFilterModalVisible, setIsTagsFilterModalVisible] =
    useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupDetailInfo>(mockGroupDetail);

  useEffect(() => {
    dispatch(
      getGroupInfo({
        groupID,
      })
    ).then((res) => {
      const groupInfo = res.payload as GroupDetailInfo;

      setGroupInfo(groupInfo);

      const membershipStage =
        groupInfo.UserStatus == "Active"
          ? GroupMembershipStage.JOINED
          : groupInfo.UserStatus == "Pending"
          ? GroupMembershipStage.REQUESTED
          : GroupMembershipStage.NOT_JOINED;
      dispatch(setUserMembershipStageInCurrentGroup(membershipStage));
      dispatch(setUserRoleInCurrentGroup(groupInfo.Role));
    });
    if (userCurrentGroupMembershipStage === GroupMembershipStage.JOINED) {
      setButtonLabel("Leave Group");
    } else if (
      userCurrentGroupMembershipStage === GroupMembershipStage.REQUESTED
    ) {
      setButtonLabel("Cancel Request");
    } else {
      setButtonLabel("Join Group");
    }
  }, [groupID]);

  const handleGroupJoinConfirmCancel = () => {
    setIsGroupJoinModalVisible(false);
  };
  const handlePressCancelRequest = () => {
    setIsCancelRequestModalVisible(true);
  };
  const handlePressLeaveGroup = () => {
    setIsLeaveGroupModalVisible(true);
  };

  const handlePressButton = () => {
    if (userCurrentGroupMembershipStage === GroupMembershipStage.JOINED) {
      handlePressLeaveGroup();
    } else if (
      userCurrentGroupMembershipStage === GroupMembershipStage.REQUESTED
    ) {
      handlePressCancelRequest();
    } else {
      handlePressJoinGroup();
    }
  };
  const handlePressGroupMemberList = () => {
    // Handle the press event for the group member list
    // I don't know what the id for current group is
    // so I just use the mock data for now
    // modify this url to /group/{groupID}/group-member-list if needed
    // route.push(`/group/${groupID}/group-member-list`);
    route.push(
      `/group/group-member-list?groupID=${groupID}&fieldID=${groupInfo.Field._id}`
    );
  };
  const handleSearchTextChange = (val: string) => {
    searchText.current = val;
  };
  const handleSearchSubmit = () => {
    if (selectedId == 1) {
      dispatch(setGroupBlogsSearchText(searchText.current));
    } else {
      dispatch(setGroupTagsSearchText(searchText.current));
    }
  };
  const resetSearchText = () => {
    dispatch(setGroupBlogsSearchText(""));
    dispatch(setGroupTagsSearchText(""));
    searchText.current = "";
    textInputRef.clear();
  };

  const handleNewPostPress = () => {
    // Handle the new post button press
    // When Press it should carry a parameter of groupID or groupName
    // so that the new blog will automatically be assigned to the group
    route.push(`/blog/new-blog?groupID=${groupID}`);
  };
  const handleNewTagPress = () => {
    route.push(`/group/create-tag?groupID=${groupID}`);
  };
  const handleApprovalPress = () => {
    // Handle the approval button press
    // When Press it should carry a parameter of groupID or groupName
    // so that the new blog will automatically be assigned to the group
    route.push(`/group/approvals?groupID=${groupID}`);
  };

  const handlePressJoinGroup = () => {
    setIsGroupJoinModalVisible(true);
  };

  const handleConfirmJoinGroup = () => {
    dispatch(requestJoinGroup({ groupID })).then((res) => {
      if (res.payload === true) {
        dispatch(
          setUserMembershipStageInCurrentGroup(GroupMembershipStage.REQUESTED)
        );

        setTimeout(() => {
          dispatch(
            setUserMembershipStageInCurrentGroup(GroupMembershipStage.JOINED)
          );
        }, 5000);
      }
    });
  };
  //  TODO: Handle Here
  const handleCancelRequestConfirm = () => {};
  const handleLeaveGroupConfirm = () => {};
  const handleMoreOptionPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  // Delete this after the group rules are fetched from the server
  const groupRules: GroupRule[] = [
    {
      _id: "rule1",
      RuleName: "Respect all members",
      RuleDescription:
        "All members should be treated with respect and kindness.",
    },
    {
      _id: "rule2",
      RuleName: "No spamming",
      RuleDescription:
        "Spamming or posting irrelevant content is not allowed in this group.",
    },
    {
      _id: "rule3",
      RuleName: "Stay on topic",
      RuleDescription:
        "Please keep discussions relevant to the group's theme and purpose.",
    },
  ];
  const handleContentButtonPress = () => {
    route.push(`/group/group-contents?groupID=${groupID}`);
  };
  return (
    <View style={styles.container}>
      <View>
        <DetailGroupCardComponent
          {...(groupInfo ? { ...groupInfo } : mockGroupDetail)}
          moreOptionPress={() => handleMoreOptionPress(0)}
          userRole={userCurrentGroupRole}
        />
      </View>
      <View style={{ marginTop: 20 }} />
      {/* There should only one of this appear on the screen, if multiple of this appear, then database is wrong */}
      {userCurrentGroupRole == GroupRole.Owner && (
        <TouchableOpacity style={styles.welcomContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#1327", "#111A1A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.welcomeName}>
              Welcome, <Text style={{ fontWeight: "bold" }}>Boss!</Text>
            </Text>
            <FontAwesome5 name="fire" size={24} color="#B9FF66" />
          </LinearGradient>
        </TouchableOpacity>
      )}
      {userCurrentGroupRole == GroupRole.Member && (
        <TouchableOpacity style={styles.moderatorContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#1327", "#111A1A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.welcomeName}>
              Welcome, <Text style={{ fontWeight: "bold" }}>Member!</Text>
            </Text>
            <FontAwesome5 name="fire" size={24} color="#B9FF66" />
          </LinearGradient>
        </TouchableOpacity>
      )}
      {userCurrentGroupRole == GroupRole.Admin && (
        <TouchableOpacity style={styles.moderatorContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#1327", "#111A1A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.welcomeName}>
              Welcome, <Text style={{ fontWeight: "bold" }}>Admin!</Text>
            </Text>
            <FontAwesome5 name="fire" size={24} color="#B9FF66" />
          </LinearGradient>
        </TouchableOpacity>
      )}
      {userCurrentGroupMembershipStage == GroupMembershipStage.REQUESTED && (
        <TouchableOpacity style={styles.moderatorContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#ffe259", "#ffa751"]} // Yellow gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={[styles.welcomeName, { color: "#000" }]}>
              Pending Approval!
            </Text>
            <Feather name="clock" size={24} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      )}
      {userCurrentGroupMembershipStage == GroupMembershipStage.BANNED && (
        <TouchableOpacity style={styles.moderatorContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#ffe259", "#ffa751"]} // Yellow gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              gap: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={[styles.welcomeName, { color: "#000" }]}>
              You're banned!
            </Text>
            <FontAwesome name="ban" size={24} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <Entypo name="info-with-circle" size={24} color="#B9FF66" />
          <Text style={{ color: "#B9FF66", fontSize: 16, fontWeight: "bold" }}>
            Group Description
          </Text>
        </View>
        <Text style={styles.description}>
          {groupInfo ? groupInfo.Description : mockGroupDetail.Description}
        </Text>
        {/* Rules */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
          onPress={() => setIsShowRules(!isShowRules)}
          activeOpacity={0.8}
        >
          <FontAwesome5 name="shield-alt" size={24} color="#B9FF66" />
          <Text style={{ color: "#B9FF66", fontSize: 16, fontWeight: "bold" }}>
            Group Rules
          </Text>

          {/* Use arrow icon */}
          <Entypo
            name={isShowRules ? "chevron-down" : "chevron-right"}
            size={24}
            color="#B9FF66"
          />
        </TouchableOpacity>

        {isShowRules && (
          <View
            style={{
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {groupRules?.map((rule, index) => (
              <View key={index} style={styles.ruleOuterContainer}>
                <View
                  style={[
                    styles.rowContainer,
                    { marginBottom: 5, justifyContent: "flex-start", gap: 10 },
                  ]}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: "#B9FF66",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={[styles.headingTitle, {}]} numberOfLines={2}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#B9FF66",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "justify",
                    }}
                  >
                    {rule.RuleName}
                  </Text>
                </View>
                <View
                  style={[
                    styles.container,
                    {
                      backgroundColor: "transparent",
                      padding: 0,
                    },
                  ]}
                >
                  <View style={styles.ruleContainer}>
                    {/* Input for rule description */}
                    <Text style={styles.ruleText}>{rule.RuleDescription}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={{ paddingBottom: 20 }}>
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            paddingHorizontal: 20,
          }}
        >
          Moderated by
        </Text>
        {/* Go to moderator profile */}
        <View
          style={[
            styles.rowContainer,
            {
              marginTop: 10,
              paddingHorizontal: 20,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "center",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.moderatorContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#1327", "#111A1A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 20,
                gap: 10,
              }}
            >
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.moderatorImage}
              />
              <Text style={styles.moderatorName}>@John Doe</Text>
            </LinearGradient>
          </TouchableOpacity>

          <ButtonGradient
            label={buttonLabel}
            labelStyle={styles.tabButtonText}
            style={styles.tabButton}
            onPress={handlePressButton}
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
        style={styles.contentButton}
        onPress={handleNewPostPress}
      >
        <Text
          style={{
            color: "#000",
            fontWeight: "bold",
          }}
        >
          Create Blog 
        </Text>
      </TouchableOpacity>
      </View>
      {/* <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.infoContainer}
          activeOpacity={0.8}
          onPress={handlePressGroupMemberList}
        ></TouchableOpacity>
      </View> */}
      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#4A4A4A", marginVertical: 10 }} />
      {/* Button to go to tab for Content */}
      
      {/* Button to go to tab for Content */}
      <TouchableOpacity
        style={styles.contentButton}
        onPress={handleContentButtonPress}
      >
        <Text
          style={{
            color: "#000",
            fontWeight: "bold",
          }}
        >
          See Group Content
        </Text>
      </TouchableOpacity>
  
      <Modal
        transparent={true}
        visible={isGroupJoinModalVisible}
        animationType="fade"
        onRequestClose={handleGroupJoinConfirmCancel}
      >
        {/* Modal overlay */}
        <Pressable
          style={styles.modalOverlay}
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              handleGroupJoinConfirmCancel();
            }
          }}
        >
          <View style={styles.modalContentContainer}>
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
                    setIsGroupJoinModalVisible(false);
                  }}
                  style={styles.joinCancelButton}
                >
                  <Text style={styles.joinCancelButtonText}>
                    Let Me Rethink
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleConfirmJoinGroup();

                    setIsGroupJoinModalVisible(false);
                  }}
                  style={styles.joinConfirmButton}
                >
                  <Text style={styles.joinConfirmButtonText}>Count Me In!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
      {userCurrentGroupMembershipStage === GroupMembershipStage.REQUESTED && (
        <Modal
          transparent={true}
          visible={isCancelRequestModalVisible}
          animationType="fade"
          onRequestClose={() => setIsCancelRequestModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={(event) => {
              if (event.target === event.currentTarget) {
                setIsCancelRequestModalVisible(false);
              }
            }}
          >
            <View style={styles.modalContentContainer}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Cancel Request to Join Group?
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsCancelRequestModalVisible(false);
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let Me Rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleCancelRequestConfirm();

                      setIsCancelRequestModalVisible(false);
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>
                      Yes, Cancel it!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}

      {userCurrentGroupMembershipStage === GroupMembershipStage.JOINED && (
        <Modal
          transparent={true}
          visible={isLeaveGroupModalVisible}
          animationType="fade"
          onRequestClose={() => setIsLeaveGroupModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={(event) => {
              if (event.target === event.currentTarget) {
                setIsLeaveGroupModalVisible(false);
              }
            }}
          >
            <View style={styles.modalContentContainer}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Are You Sure You Want to Leave the Group?
                  </Text>
                </View>
                <View style={styles.rowContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsLeaveGroupModalVisible(false);
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let Me Rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleLeaveGroupConfirm();

                      setIsLeaveGroupModalVisible(false);
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>
                      Sure, I'm Out!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

function CreatePost({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity
        style={styles.tabButton}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Text style={styles.tabButtonText}>+ Create Post</Text>
      </TouchableOpacity>
      {/* <Entypo name="select-arrows" size={24} color="#B9FF66" /> */}
    </View>
  );
}
function CreateTags({ onPress }: { onPress: () => void }) {
  return (
    <View>
      <TouchableOpacity
        style={styles.tabButton}
        activeOpacity={0.8}
        onPress={onPress}
      >
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
  memberContainer: {
    fontSize: 16,
    color: "#B9FF66",
    fontWeight: "bold",
    textAlign: "center",
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
  },
  tabButton: {
    width: 110,
    height: 40,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B9FF66",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scrollrow: {
    flex: 1,
    width: "70%",
  },
  tabList: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    flex: 1,
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
    flex: 0.9,
  },
  textInput: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
    fontSize: 16,
  },
  textInputContainer: {
    paddingTop: 20,
  },
  modalContentContainer: {
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
    width: 50,
    height: 50,
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
  createBlogButton: {
    backgroundColor: "#B9FF66",
    padding: 15,
    paddingBlock: 10,
    borderRadius: 20,
  },
  createBlogButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  filterButton: {
    width: 140,
    height: 40,
    borderRadius: 80,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#B9FF66",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#B9FF66",
  },
  filterContentContainer: {
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "90%",
  },
  filterOptionsButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#2E3B40",
    marginVertical: 5,
    width: "100%",
  },
  filterOptionsButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  ruleOuterContainer: {
    padding: 20,
    paddingBottom: 0,
    borderRadius: 20,
  },
  headingTitle: {
    fontSize: 16,
    color: "#000",
  },
  ruleContainer: {
    backgroundColor: "#252525",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    flex: 1,
  },
  ruleText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
    textAlign: "justify",
  },
  ruleTitle: {
    color: "#B9FF66",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descriptionContainer: {
    backgroundColor: "#242630",
    borderRadius: 20,
    marginVertical: 20,
    paddingBottom: 20,
  },
  moderatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moderatorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  moderatorName: {
    color: "#B9FF66",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 20,
  },
  welcomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeName: {
    color: "#B9FF66",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 10,
  },
  contentButton: {
    backgroundColor: "#B9FF66",
    padding: 15,
    paddingBlock: 10,
    borderRadius: 20,
    alignItems: "center",
  },
});
