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
} from "react-native";
import { Image } from "expo-image";
import ButtonGradient from "@/components/ButtonGradient";
import {
  Entypo,
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
import { GroupDetailInfo } from "@/interfaces/groupInterface";
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
  const { userCurrentGroupMembershipStage, userCurrentGroupRole  } = useAppSelector(
    (state) => state.user
  );

  const [isGroupJoinModalVisible, setIsGroupJoinModalVisible] = useState(false);
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
  }, [groupID]);

  const handleGroupJoinConfirmCancel = () => {
    setIsGroupJoinModalVisible(false);
  };
  const handleBlogFilterCancel = () => {
    setIsBlogsFilterModalVisible(false);
  };
  const handleTagFilterCancel = () => {
    setIsTagsFilterModalVisible(false);
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
  const handleMoreOptionPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <DetailGroupCardComponent
          {...(groupInfo
            ? { ...groupInfo }
            : mockGroupDetail)}
          moreOptionPress={() => handleMoreOptionPress(0)}
          userRole={userCurrentGroupRole}
        />
      </View>
      {/* Description */}
      <Text style={styles.description}>
        {groupInfo ? groupInfo.Description : mockGroupDetail.Description}
      </Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.infoContainer}
          activeOpacity={0.8}
          onPress={handlePressGroupMemberList}
        >
          {/* Three example user images */}
          <Text style={styles.memberContainer}>
            List of members
          </Text>
          
        </TouchableOpacity>
        {/* render based on user is in group or not */}
        {userCurrentGroupMembershipStage != GroupMembershipStage.JOINED && (
          <ButtonGradient
            disabled={
              userCurrentGroupMembershipStage == GroupMembershipStage.REQUESTED
            }
            label={
              userCurrentGroupMembershipStage == GroupMembershipStage.NOT_JOINED
                ? "Join Group"
                : "Request sent"
            }
            labelStyle={styles.tabButtonText}
            style={styles.tabButton}
            onPress={handlePressJoinGroup}
          />
        )}
        {/* {userCurrentGroupMembershipStage == GroupMembershipStage.JOINED && (
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal-circle-outline"
              size={55}
              color="white"
            />
          </TouchableOpacity>
        )} */}
      </View>
      <Divider color="#242630" width={1} style={{ paddingTop: 20 }} />
      <View style={styles.rowWrapper}>
        {/* Tabs */}
        <View style={styles.tabList}>
          {/* Blogs Tab */}
          <TouchableOpacity
            style={[styles.tabItem, selectedId === 1 && styles.tabItemActive]}
            onPress={() => {
              resetSearchText();
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
              resetSearchText();
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
          {/* Approval Tab */}
          {userCurrentGroupMembershipStage == GroupMembershipStage.JOINED &&
          (groupInfo.Role == GroupRole.Admin ||
            groupInfo.Role == GroupRole.Owner) ? (
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[
                  styles.tabItem,
                  selectedId === 3 && styles.tabItemActive,
                ]}
                onPress={() => {
                  handleApprovalPress();
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: selectedId === 3 ? "#fff" : "#8A94AC",
                    fontWeight: "bold",
                  }}
                >
                  Approvals
                </Text>
              </TouchableOpacity>
              {/* New Blog Button */}
            </View>
          ) : null}
        </View>

        {/* Create Post */}
        {userCurrentGroupMembershipStage == GroupMembershipStage.JOINED ? (
          selectedId === 1 ? (
            <CreatePost onPress={handleNewPostPress} />
          ) : (
            <CreateTags onPress={handleNewTagPress} />
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
            ref={(el) => (textInputRef = el!)}
            onChangeText={handleSearchTextChange}
            onSubmitEditing={handleSearchSubmit}
            numberOfLines={1}
            multiline={false}
          />
        </View>

        {/* {<View style={{ flex: 0.3 }}>
          <TouchableOpacity
            style={[styles.filterButton]}
            activeOpacity={0.8}
            onPress={() => {
              if (selectedId === 1) {
                setIsBlogsFilterModalVisible(true);
              } else {
                setIsTagsFilterModalVisible(true);
              }
            }}
          >
            <FontAwesome6 name="filter" size={24} color="#B9FF66" />
            <Text style={styles.filterButtonText}>
              {selectedId === 1 ? selectedBlogFilter : selectedTagFilter}
            </Text>
          </TouchableOpacity>
        </View>} */}
      </View>

      {/* Modal for group join */}
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
                    LET ME RETHINK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleConfirmJoinGroup();

                    setIsGroupJoinModalVisible(false);
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
      {/* Modal for blogs filter
      <Modal
        transparent={true}
        visible={isBlogsFilterModalVisible}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              handleBlogFilterCancel();
            }
          }}
        >
          <View style={styles.filterContentContainer}>
            {blogsFilters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterOptionsButton}
                onPress={() => {
                  setSelectedBlogFilter(filter);
                  console.log("Selected blog filter:", filter);
                  handleBlogFilterCancel();
                }}
              >
                <Text style={styles.filterOptionsButtonText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
      {/* Modal for Tags Filter */}
      {/*
      <Modal
        transparent={true}
        visible={isTagsFilterModalVisible}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              handleTagFilterCancel();
            }
          }}
        >
          <View style={styles.filterContentContainer}>
            {tagsFilters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={styles.filterOptionsButton}
                onPress={() => {
                  setSelectedTagFilter(filter);
                  handleTagFilterCancel();
                }}
              >
                <Text style={styles.filterOptionsButtonText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal> */}
      
    </GestureHandlerRootView>
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
    gap: 10,
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
});
