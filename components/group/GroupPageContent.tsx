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
  Alert,
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
import {
  useLocalSearchParams,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  cancelJoinGroupRequest,
  deleteGroup,
  getGroupInfo,
  leaveGroup,
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
import GroupMoreOptionBottomList from "./GroupMoreOptionBottomList";
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
import { Dimensions } from "react-native";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
const blogsFilters = ["All blogs", "Needs approval"];
const tagsFilters = ["All tags", "Needs approval"];
type GroupPageProps = {
  selectedId: number;
  setSelectedId: (id: number) => void;
  groupID: string;
  sheetRef: React.RefObject<BottomSheet>;
  memberIDNotif?: string;
  tagIDNotif?: string;
  // selectedBlogFilter: string;
  // setSelectedBlogFilter: (filter: string) => void;
  // selectedTagFilter: string;
  // setSelectedTagFilter: (filter: string) => void;
};
export default function GroupPageContent({
  selectedId,
  setSelectedId,
  groupID,
  sheetRef,
  memberIDNotif,
  tagIDNotif,
}: // selectedBlogFilter,
// setSelectedBlogFilter,
// selectedTagFilter,
// setSelectedTagFilter,

GroupPageProps) {
  const route = useRouter();
  const { routes } = useRootNavigationState();
  const dispatch = useAppDispatch();
  const { userCurrentGroupMembershipStage, userCurrentGroupRole } =
    useAppSelector((state) => state.user);

  const [isShowRules, setIsShowRules] = useState(false);
  const [isOwnerTheLastMember, setIsOwnerTheLastMember] = useState(false);
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
  const [groupInfo, setGroupInfo] = useState<GroupDetailInfo>();

  useEffect(() => {
    dispatch(
      getGroupInfo({
        groupID,
      })
    ).then((res) => {
      const groupInfo = res.payload as GroupDetailInfo;

      if (groupInfo == null) {
        ToastAndroid.show(
          "This group doesn't exist or is already deleted",
          ToastAndroid.LONG
        );

        route.dismiss();
      }

      setGroupInfo(groupInfo);
      setIsOwnerTheLastMember(
        groupInfo.NumberOfMembers == 1 && groupInfo.Role == GroupRole.Owner
      );
      const membershipStage =
        groupInfo.UserStatus == "Active"
          ? GroupMembershipStage.JOINED
          : groupInfo.UserStatus == "Pending"
          ? GroupMembershipStage.REQUESTED
          : groupInfo.UserStatus == "Banned"
          ? GroupMembershipStage.BANNED
          : GroupMembershipStage.NOT_JOINED;

      dispatch(setUserMembershipStageInCurrentGroup(membershipStage));
      dispatch(setUserRoleInCurrentGroup(groupInfo.Role));
    });
  }, [groupID]);

  useEffect(() => {
    console.log(userCurrentGroupMembershipStage)
    if (userCurrentGroupMembershipStage === GroupMembershipStage.JOINED) {
      setButtonLabel("Leave Group");
    } else if (
      userCurrentGroupMembershipStage === GroupMembershipStage.REQUESTED
    ) {
      setButtonLabel("Cancel Request");
    } else {
      setButtonLabel("Join Group");
    }
  }, [userCurrentGroupMembershipStage]);

  useEffect(() => {
    if (!groupInfo) return;

    const memberIDCheck =
      memberIDNotif !== undefined && memberIDNotif.length != 0;
    const tagIDCheck = tagIDNotif !== undefined && tagIDNotif.length != 0;
    if (memberIDCheck || tagIDCheck) {
      if (
        userCurrentGroupRole != null &&
        userCurrentGroupRole !== GroupRole.Admin &&
        userCurrentGroupRole !== GroupRole.Owner
      ) {
        Alert.alert(
          "Missing role",
          "Cannot view this because you are currently not an admin or the owner of this group"
        );
        return;
      } else {
        if (memberIDCheck) {
          route.push(
            `/group/group-contents/members?groupID=${groupID}&memberIDNotif=${memberIDNotif}`
          );
        }

        if (tagIDCheck) {
          route.push(
            `/group/group-contents/tags?groupID=${groupID}&tagIDNotif=${tagIDNotif}`
          );
        }
      }
    }
  }, [userCurrentGroupRole, groupInfo, memberIDNotif, tagIDNotif]);

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
      `/group/group-member-list?groupID=${groupID}&fieldID=${groupInfo?.Field._id}`
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
    route.push(`/group/approvals?groupID=${groupID!}`);
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
      }
    });
  };
  const handleCancelRequestConfirm = () => {
    dispatch(cancelJoinGroupRequest({ groupID })).then((res) => {
      const result = res.payload as boolean;

      if (result === true) {
        dispatch(
          setUserMembershipStageInCurrentGroup(GroupMembershipStage.NOT_JOINED)
        );
        dispatch(setUserRoleInCurrentGroup(null));
      }
    });
  };
  const handleLeaveGroupConfirm = () => {
    if (groupInfo?.NumberOfMembers != 1) {
      dispatch(leaveGroup({ groupID })).then((res) => {
        const result = res.payload as boolean;
        if (result == true) {
          route.dismiss();
          route.setParams({
            groupIDToRemove: groupID,
          });
        }
      });
    } else {
      dispatch(deleteGroup(groupID)).then((res) => {
        const result = res.payload as boolean;
        if (result == true) {
          route.dismiss();
          route.setParams({
            groupIDToRemove: groupID,
          });
        }
      });
    }
  };
  const handleLeaveGroupOwnerConfirm = () => {};

  const handleMoreOptionPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleContentButtonPress = () => {
    route.push(`/group/group-contents?groupID=${groupID!}`);
  };
  const ownSheetRef = useRef<BottomSheet>(null);
  const handleActionButtonPress = () => {
    if (
      groupInfo?.NumberOfMembers! > 1 &&
      userCurrentGroupRole === GroupRole.Owner
    ) {
      route.push(`/group/owner-leave?groupID=${groupID}`);
    } else {
      ownSheetRef.current?.snapToIndex(1);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
        <TouchableOpacity style={styles.welcomeContainer} activeOpacity={0.8}>
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
      {userCurrentGroupRole == GroupRole.Member &&
        userCurrentGroupMembershipStage != GroupMembershipStage.REQUESTED &&
        userCurrentGroupMembershipStage != GroupMembershipStage.BANNED && (
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
        {groupInfo?.Rules && (
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
            <Text
              style={{ color: "#B9FF66", fontSize: 16, fontWeight: "bold" }}
            >
              Group Rules
            </Text>

            {/* Use arrow icon */}
            <Entypo
              name={isShowRules ? "chevron-down" : "chevron-right"}
              size={24}
              color="#B9FF66"
            />
          </TouchableOpacity>
        )}

        {isShowRules && (
          <View
            style={{
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {groupInfo?.Rules?.map((rule, index) => (
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
                    {rule.Title}
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
                    <Text style={styles.ruleText}>{rule.Content}</Text>
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
          {groupInfo && groupInfo.CreatedBy && (
            <TouchableOpacity
              style={styles.moderatorContainer}
              activeOpacity={0.8}
              onPress={() => {
                route.push(`/profile?userID=${groupInfo.CreatedBy._id}`);
              }}
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
                  source={{ uri: groupInfo.CreatedBy.AvatarURL }}
                  style={styles.moderatorImage}
                />
                <Text
                  style={[
                    styles.moderatorName,
                    { maxWidth: width * 0.3, flexShrink: 1 },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  @{groupInfo.CreatedBy.Username}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {userCurrentGroupMembershipStage != GroupMembershipStage.BANNED && (
            <ButtonGradient
              label={buttonLabel}
              labelStyle={styles.tabButtonText}
              style={styles.tabButton}
              onPress={handleActionButtonPress}
            />
          )}
        </View>
      </View>
      <View>
        {userCurrentGroupMembershipStage != GroupMembershipStage.REQUESTED &&
          userCurrentGroupMembershipStage != GroupMembershipStage.BANNED &&
          userCurrentGroupMembershipStage !=
            GroupMembershipStage.NOT_JOINED && (
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
          )}
      </View>
      <View
        style={{ height: 1, backgroundColor: "#4A4A4A", marginVertical: 10 }}
      />
      {userCurrentGroupMembershipStage != GroupMembershipStage.BANNED && (
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
      )}
      <BottomSheet
        ref={ownSheetRef}
        index={-1}
        snapPoints={["50%", "100%"]}
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        handleStyle={{ backgroundColor: "#1E1E1E" }}
        style={{ backgroundColor: "#1E1E1E" }}
        backgroundStyle={{ backgroundColor: "#1E1E1E" }}
      >
        <BottomSheetView style={{ backgroundColor: "#1E1E1E" }}>
          {userCurrentGroupMembershipStage ==
            GroupMembershipStage.NOT_JOINED && (
            <View style={styles.modalContentContainer}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Are you ready to join the group?
                  </Text>
                </View>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      ownSheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let me rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleConfirmJoinGroup();

                      ownSheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>
                      Count me in!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {userCurrentGroupMembershipStage ===
            GroupMembershipStage.REQUESTED && (
            <View style={styles.modalContentContainer}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Cancel request to join group?
                  </Text>
                </View>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      ownSheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let me rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleCancelRequestConfirm();

                      ownSheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>
                      Yes, cancel it!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {userCurrentGroupMembershipStage === GroupMembershipStage.JOINED &&
            userCurrentGroupRole !== GroupRole.Owner && (
              <View style={[styles.modalContentContainer]}>
                <Image
                  style={styles.joinConfirmImage}
                  source={joinConfirmImage}
                />
                <View style={{ flex: 1, gap: 10 }}>
                  <View style={{}}>
                    <Text style={styles.joinModalTitle}>
                      Are you sure you want to leave the group?
                    </Text>
                  </View>
                  <View style={[styles.rowContainer, { gap: 20 }]}>
                    <TouchableOpacity
                      onPress={() => {
                        ownSheetRef.current?.close();
                      }}
                      style={styles.joinCancelButton}
                    >
                      <Text style={styles.joinCancelButtonText}>
                        Let me rethink
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleLeaveGroupConfirm();

                        ownSheetRef.current?.close();
                      }}
                      style={styles.joinConfirmButton}
                    >
                      <Text style={styles.joinConfirmButtonText}>
                        Sure, I'm out!
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          {userCurrentGroupMembershipStage === GroupMembershipStage.JOINED &&
            userCurrentGroupRole === GroupRole.Owner &&
            groupInfo?.NumberOfMembers == 1 && (
              <View
                style={[
                  styles.modalContentContainer,
                  {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={styles.joinModalTitle}>
                  Are you sure you want to leave the group?
                </Text>
                <View style={[styles.rowContainer, { width: "100%" }]}>
                  <Entypo name="warning" size={24} color="#FFA500" />
                  <Text style={styles.warningText}>
                    You are the only member left in this group. Want to delete
                    it?
                  </Text>
                </View>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    style={styles.joinCancelButton}
                    onPress={() => {
                      ownSheetRef.current?.close();
                    }}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let me rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.joinConfirmButton}
                    onPress={handleLeaveGroupConfirm}
                  >
                    <Text style={styles.joinConfirmButtonText}>
                      Delete group
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          {userCurrentGroupMembershipStage === GroupMembershipStage.JOINED &&
            userCurrentGroupRole === GroupRole.Owner &&
            !isOwnerTheLastMember && (
              <View
                style={[
                  styles.modalContentContainer,
                  {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={styles.joinModalTitle}>
                  Are you sure you want to leave the group?
                </Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.warningText}>
                    Choose new group owner:
                  </Text>
                </View>
                {/* Search bar */}

                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    style={styles.joinCancelButton}
                    onPress={() => {
                      ownSheetRef.current?.close();
                    }}
                  >
                    <Text style={styles.joinCancelButtonText}>
                      Let me rethink
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.joinConfirmButton}>
                    <Text style={styles.joinConfirmButtonText}>
                      Delete Group
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    flex: 1,
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
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
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 20,
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
    color: "#000",
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
    overflow: "hidden",
  },
  welcomeContainer: {
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
  warningText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#CC0000",
  },
});
