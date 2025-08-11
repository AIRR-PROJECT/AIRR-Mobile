import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Alert,
  RefreshControl,
} from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MemberApprovalCardComponent from "@/components/group/MemberApprovalCardComponent";
import { RequestOwner } from "@/interfaces/notifInterface";
import {
  GroupBannedMember,
  GroupMember,
  PendingMemberRequest,
} from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  approveMember,
  banMember,
  getBannedMemberList,
  getMemberList,
  getPendingMemberList,
  getUserGroupStatus,
  inviteMemberToAdmin,
  kickMember,
  rejectBlog,
  rejectMember,
  unbanMember,
} from "@/redux/slices/groupSlice";
import { router, useLocalSearchParams } from "expo-router";
import { GroupRole } from "@/enums/group.enum";
import { Image } from "expo-image";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

// Initial mock data
// const mockUser: PendingMemberRequest = {
//   _id: "1",
//   Name: "John Doe",
//   AvatarURL: "https://picsum.photos/200/300",
//   Username: "johndoe",

//   CreateDate: (new Date().getTime() - 1000 * 60 * 60 * 24).toLocaleString(),
// };

// const initialUsers = [mockUser, mockUser, mockUser].map((user, index) => ({
//   ...user,
//   id: index.toString(),
// }));
import { format, formatRelative } from "date-fns";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";
import { EmptyContent } from "@/components/EmptyContent";
enum TabOptions {
  All = "all",
  NeedApproval = "need-approval",
  Banned = "banned",
}
const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
export default function MemberApprovalsPage() {
  const dispatch = useAppDispatch();
  const displayMembersFlatlistRef = useRef<any>();
  const memberApprovalsFlatlistRef = useRef<any>();
  const { userCurrentGroupRole, user } = useAppSelector((state) => state.user);
  const { groupID, memberIDNotif } = useLocalSearchParams<{
    groupID: string;
    memberIDNotif: string;
  }>();

  const [displayMembers, setDisplayMembers] = useState<GroupMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<GroupMember[]>([]);
  const [membersApproval, setMembersApproval] = useState<
    PendingMemberRequest[]
  >([]);
  const [filteredMembersApproval, setFilteredMembersApproval] = useState<PendingMemberRequest[]>([]);
  const [bannedMembers, setBannedMembers] = useState<GroupBannedMember[]>([]);
  const [filteredBannedMembers, setFilteredBannedMembers] = useState<GroupBannedMember[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  const [isMemberFetching, setIsMemberFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false)
  const memberIDToScroll = useRef<string | null>(memberIDNotif);
  const [bottomSheetMode, setBottomSheetMode] = useState<
    "main" | "kick" | "ban" | "admin" | "unban" | "approve" | "reject"
  >("main");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    if (groupID.length == 0) return;

    setIsMemberFetching(true);

    if (selectedTab == TabOptions.All) {
      dispatch(getMemberList({ groupID })).then((res) => {
        let sortOrder = ["Owner", "Admin", "Member"];
        const groupMembers = res.payload as GroupMember[];
        const sortedGroupMembers = groupMembers.sort(
          (a, b) => sortOrder.indexOf(a.Role) - sortOrder.indexOf(b.Role)
        );

        setDisplayMembers(sortedGroupMembers);

        setIsMemberFetching(false);
      });
    } else if (selectedTab == TabOptions.NeedApproval) {
      dispatch(getPendingMemberList(groupID)).then((res) => {
        const list = res.payload as PendingMemberRequest[];
        setMembersApproval(list);

        setIsMemberFetching(false);
      });
    } else {
      dispatch(getBannedMemberList(groupID)).then((res) => {
        const list = res.payload as GroupBannedMember[];
        setBannedMembers(list);

        setIsMemberFetching(false);
      });
    }
  }, [selectedTab, groupID]);

  const onRefresh = () => {
    setRefreshing(true);
    
    setIsMemberFetching(true)
    if (selectedTab == TabOptions.All) {
      dispatch(getMemberList({ groupID })).then((res) => {
        let sortOrder = ["Owner", "Admin", "Member"];
        const groupMembers = res.payload as GroupMember[];
        const sortedGroupMembers = groupMembers.sort(
          (a, b) => sortOrder.indexOf(a.Role) - sortOrder.indexOf(b.Role)
        );

        setDisplayMembers(sortedGroupMembers);

        setIsMemberFetching(false);
      });
    } else if (selectedTab == TabOptions.NeedApproval) {
      dispatch(getPendingMemberList(groupID)).then((res) => {
        const list = res.payload as PendingMemberRequest[];
        console.log(list)
        setMembersApproval(list);

        setIsMemberFetching(false);
      });
    } else {
      dispatch(getBannedMemberList(groupID)).then((res) => {
        const list = res.payload as GroupBannedMember[];
        setBannedMembers(list);

        setIsMemberFetching(false);
      });
    }
    
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 seconds refresh
  };

  useEffect(() => {
    // Prevent scroll to member altogether
    if (memberIDToScroll.current == null) return;

    // Scroll to specific index
    if (selectedTab !== TabOptions.NeedApproval) {
      setSelectedTab(TabOptions.NeedApproval);
    } else if (membersApproval != undefined && memberIDToScroll.current != "") {
      membersApproval.forEach((value, index) => {
        if (value.Owner._id == memberIDToScroll.current) {
          memberApprovalsFlatlistRef.current.scrollToIndex({
            animated: true,
            index: index,
          });
          // Turn on prevention
          memberIDToScroll.current = null;
          return;
        }
      });
    }
  }, [membersApproval, memberIDToScroll.current, selectedTab]);

  useEffect(() => {
    if (displayMembers) {
      if (searchQuery.length != 0) {
        setFilteredMembers(displayMembers.filter(m => m.MemberInfo.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
      else {
        setFilteredMembers(displayMembers);
      }
    }
  }, [displayMembers])
  useEffect(() => {
    if (membersApproval) {
      if (searchQuery.length != 0) {
        setFilteredMembersApproval(membersApproval.filter(m => m.Owner.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
      else {
        setFilteredMembersApproval(membersApproval);
      }
    }
  }, [membersApproval])
  useEffect(() => {
    if (bannedMembers) {
      if (searchQuery.length != 0) {
        setFilteredBannedMembers(bannedMembers.filter(m => m.Owner.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
      else {
        setFilteredBannedMembers(bannedMembers);
      }
    }
  }, [bannedMembers])

  const handleSearchSubmit = () => {
    if (searchQuery.length != 0) {
      if (selectedTab === TabOptions.All) {
        setFilteredMembers(displayMembers.filter(m => m.MemberInfo.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
      else if (selectedTab === TabOptions.Banned) {
        setFilteredBannedMembers(bannedMembers.filter(m => m.Owner.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
      else {
        setFilteredMembersApproval(membersApproval.filter(m => m.Owner.Username.toLowerCase().includes(searchQuery.toLowerCase())))
      }
    }
    else {
      if (selectedTab === TabOptions.All) {
        setFilteredMembers(displayMembers)
      }
      else if (selectedTab === TabOptions.Banned) {
        setFilteredBannedMembers(bannedMembers)
      }
      else {
        setFilteredMembersApproval(membersApproval)
      }
    }
  }
  const handleOnSetSearchQuery = (query: string) => {
    setSearchQuery(query);
    handleSearchSubmit();
  };
  const [needApprovalUserID, setNeedApprovalUserID] = useState<string>("");
  
  const onPressApprove = (id: string) => {
    setBottomSheetMode("approve");
    setNeedApprovalUserID(id);
    sheetRef.current?.snapToIndex(0);
  }
  const onApprove = (id: string) => {
    dispatch(approveMember({ groupID: groupID, userIDToApprove: id })).then(
      (res) => {
        if (res.payload === true) {
          ToastAndroid.show("Member approved", ToastAndroid.SHORT);
          console.log("Approve user with id: ", id);
          setMembersApproval((prev) => prev.filter((u) => u.Owner._id !== id));
        }
        else {
          ToastAndroid.show("Failed to approve member", ToastAndroid.LONG);
        }
      }
    );
  };

  const onReject = (id: string) => {
    dispatch(rejectMember({ groupID, userIDToReject: id })).then((res) => {
      if (res.payload === true) {
        ToastAndroid.show("Member rejected", ToastAndroid.SHORT);
        console.log("Reject user with id: ", id);
        setMembersApproval((prev) => prev.filter((u) => u.Owner._id !== id));
      }
      else {
        ToastAndroid.show("Failed to reject member", ToastAndroid.LONG);
      }
    });
  };

  const handleOnDisplayMemberPress = (userID: string) => {
    router.push(`/profile?userID=${userID}`);
  };

  const renderItem = ({ item }: any) => (
    <MemberApprovalCardComponent
      id={item.Owner._id}
      name={item.Owner.Username}
      avatar={item.Owner.AvatarURL}
      username={item.Owner.Username}
      time={item.RequestDate}
      onApprove={onPressApprove}
      onReject={onReject}
    />
  );

  const sheetRef = useRef<BottomSheet>(null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null
  );
  const [selectedBannedMember, setSelectedBannedMember] =
    useState<GroupBannedMember | null>(null);
  const [isSelectedMemberBanned, setIsSelectedMemberBanned] = useState(false);
  const userIsOwner = userCurrentGroupRole === GroupRole.Owner;
  const userIsAdmin = userCurrentGroupRole === GroupRole.Admin;
  const userIsMember = userCurrentGroupRole === GroupRole.Member;

  const isMoreDisabled = (item: GroupMember) => {
    if (item.Role === "Owner") return true;
    if (userIsAdmin && item.Role !== "Member") return true;
    if (userIsMember) return true;
    if (user && item.MemberInfo._id === user._id) return true;
    if (userCurrentGroupRole == null) return true;
    return false;
  };

  const [banReason, setBanReason] = useState<string>("Spamming");
  const [otherReason, setOtherReason] = useState<string>("");

  const handleConfirmBanMember = () => {
    if (selectedMember) {
      dispatch(
        banMember({
          groupID: groupID,
          userIDToBan: selectedMember.MemberInfo._id,
          bannedReason: banReason != "Other" ? banReason : otherReason,
        })
      ).then((res) => {
        const result = res.payload as boolean;

        if (result == true) {
          ToastAndroid.show("User banned", ToastAndroid.SHORT);
          setDisplayMembers(displayMembers.filter(m => m.MemberInfo._id != selectedMember.MemberInfo._id))
        } else {
          ToastAndroid.show("User is already banned", ToastAndroid.LONG);
        }
      });
    }
  };
  const handleConfirmUnbanMember = () => {
    if (selectedBannedMember) {
      dispatch(
        unbanMember({
          groupID: groupID,
          userIDToUnban: selectedBannedMember.Owner._id,
        })
      ).then((res) => {
        const result = res.payload as boolean;

        if (result == true) {
          setBannedMembers(
            bannedMembers.filter((m) => m._id != selectedBannedMember._id)
          );
          ToastAndroid.show("User unbanned", ToastAndroid.SHORT);
        }
      });
    }
  };
  const handleConfirmKickMember = () => {
    if (selectedMember) {
      dispatch(
        kickMember({
          groupID: groupID,
          userID: selectedMember.MemberInfo._id,
        })
      ).then((res) => {
        const result = res.payload as boolean;

        if (result == true) {
          setDisplayMembers(
            displayMembers.filter(
              (m) => m.MemberInfo._id != selectedMember.MemberInfo._id
            )
          );
          ToastAndroid.show("User kicked", ToastAndroid.SHORT);
        }
      });
    }
  };
  const handleConfirmInviteMemberToAdmin = () => {
    if (selectedMember) {
      dispatch(
        inviteMemberToAdmin({
          groupID: groupID,
          userIDToInvite: selectedMember.MemberInfo._id,
        })
      ).then((res) => {
        const result = res.payload as boolean;

        if (result == true) {
          const index = displayMembers.findIndex(
            (m) => m.MemberInfo._id == selectedMember.MemberInfo._id
          );
          if (index != -1) {
            let temp = displayMembers;
            temp[index].Role = GroupRole.Admin;
            console.log(temp);
            setDisplayMembers(temp);
          }
          ToastAndroid.show("User invited to Admin", ToastAndroid.SHORT);
        }
      });
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* search bar */}
      <View style={styles.searchBar}>
        {/* Magnifying glass icon */}
        <MaterialIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={handleOnSetSearchQuery}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>
      <View style={styles.optionBar}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.All && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.All)}
        >
          <Text style={styles.optionText}>All</Text>
        </TouchableOpacity>

        {(userCurrentGroupRole == GroupRole.Admin ||
          userCurrentGroupRole == GroupRole.Owner) && (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTab === TabOptions.NeedApproval &&
                styles.optionButtonActive,
            ]}
            onPress={() => setSelectedTab(TabOptions.NeedApproval)}
          >
            <Text style={styles.optionText}>Need Approval</Text>
          </TouchableOpacity>
        )}
        {/* TODO: ẤN nút này thì copy cái bên approval qua */}
        {(userCurrentGroupRole == GroupRole.Admin ||
          userCurrentGroupRole == GroupRole.Owner) && (
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedTab === TabOptions.Banned && styles.optionButtonActive,
            ]}
            onPress={() => setSelectedTab(TabOptions.Banned)}
          >
            <Text style={styles.optionText}>Banned</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Animated FlatList */}
      {isMemberFetching ? (
        <FeedBlogPreviewSkeleton />
      ) : selectedTab == TabOptions.All ? 
      filteredMembers && filteredMembers.length == 0 ?
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={["1"]}
          renderItem={() => <EmptyContent/>}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      ) :
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredMembers}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.memberContainer,
                item.Role === "Admin"
                  ? { borderColor: colors.admin }
                  : item.Role === "Owner"
                  ? { borderColor: colors.owner }
                  : { borderColor: colors.member },
              ]}
              onPress={() => {
                console.log(item.MemberInfo)
                handleOnDisplayMemberPress(item.MemberInfo._id)
              }}
            >
              <Image source={item.MemberInfo.AvatarURL} style={styles.avatar} />
              <View style={styles.memberInfo}>
                <Text
                  style={styles.memberName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.MemberInfo.Username}
                </Text>
                <View style={styles.roleWrapper}>
                  <Text
                    style={[
                      styles.role,
                      item.Role === "Admin"
                        ? { color: colors.admin }
                        : item.Role === "Owner"
                        ? { color: colors.owner }
                        : { color: colors.member },
                    ]}
                  >
                    {item.Role}
                  </Text>
                </View>
              </View>
              {/* More option */}
              {!isMoreDisabled(item) && <TouchableOpacity
                style={{
                  marginLeft: "auto",
                }}
                onPress={() => {
                  sheetRef.current?.snapToIndex(0);
                  setSelectedMember(item);
                }}
                
              >
                <Feather name="more-vertical" size={24} color="#000" />
              </TouchableOpacity>}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      ) : selectedTab == TabOptions.NeedApproval ? 
      filteredMembersApproval && filteredMembersApproval.length == 0 ?
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={["1"]}
          renderItem={() => <EmptyContent/>}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          itemLayoutAnimation={LinearTransition}
          ref={memberApprovalsFlatlistRef}
        />
      ) :
      (
        <Animated.FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredMembersApproval}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          itemLayoutAnimation={LinearTransition}
          ref={memberApprovalsFlatlistRef}
        />
      ) : 
      filteredBannedMembers && filteredBannedMembers.length == 0 ?
      (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={["1"]}
          renderItem={() => <EmptyContent/>}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      ) :
      (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredBannedMembers}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.memberContainer, { backgroundColor: "#fff" }]}
              onPress={() => handleOnDisplayMemberPress(item.Owner._id)}
            >
              <Image source={item.Owner.AvatarURL} style={styles.avatar} />
              <View style={styles.memberInfo}>
                <Text
                  style={styles.memberName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.Owner.Username}
                </Text>
                <View style={styles.bannedAtWrapper}>
                  <Text style={[styles.role]}>
                    Banned on {formatRelative(item.BannedDate, new Date())}
                  </Text>
                </View>
              </View>
              {/* Unban option */}
              {!userIsMember && (
                <TouchableOpacity
                  style={{
                    marginLeft: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    borderWidth: 2,
                    borderColor: "#000",
                    padding: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setSelectedBannedMember(item);
                    setBottomSheetMode("unban");
                    sheetRef.current?.snapToIndex(0);
                  }}
                >
                  <Feather name="x-circle" size={24} color="black" />
                  <Text style={{ color: "#000", fontSize: 12 }}>Unban</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
      <BottomSheet
        ref={sheetRef}
        index={-1} // Start closed
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
        onClose={() => {
          setBottomSheetMode("main");
        }}
      >
        <BottomSheetView style={{ padding: 20, gap: 20 }}>
          {bottomSheetMode === "main" && (
            <>
              {/* Kick */}
              <TouchableOpacity
                onPress={() => {
                  setBottomSheetMode("kick");
                }}
                style={styles.optionButtonContainer}
              >
                <Feather name="user-x" size={24} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 18 }}>Kick</Text>
              </TouchableOpacity>
              {/* Ban */}
              <TouchableOpacity
                onPress={() => setBottomSheetMode("ban")}
                style={styles.optionButtonContainer}
              >
                <FontAwesome5 name="ban" size={24} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 18 }}>Ban</Text>
              </TouchableOpacity>
              {/* Invite to Admin */}
              {selectedMember?.Role !== "Admin" && userIsOwner && (
                <TouchableOpacity
                  onPress={() => setBottomSheetMode("admin")}
                  style={styles.optionButtonContainer}
                >
                  <Feather name="user-plus" size={24} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    Invite to Admin
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {bottomSheetMode === "kick" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Are you sure to kick this member?
                  </Text>
                </View>
                <Text>They will not belong to this group anymore.</Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleConfirmKickMember();
                      sheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Kick</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {bottomSheetMode === "ban" && (
            <View style={[styles.modalContentContainer]}>
              <View style={{ flex: 1, gap: 10 }}>
                <View>
                  <Text style={styles.joinModalTitle}>Ban Member</Text>
                </View>
                <Text style={{ color: "#888", fontSize: 16, flexWrap: "wrap" }}>
                  Reason for Ban{" "}
                  <Text style={{ fontWeight: "bold", color: "#77a340ff" }}>
                    {selectedMember
                      ? selectedMember.MemberInfo.Username
                      : "this member"}
                  </Text>
                </Text>
                {/* Here */}
                <View style={{ marginVertical: 10 }}>
                  {[
                    "Spamming",
                    "Harassment",
                    "Offensive Language",
                    "Rule Violation",
                    "Other",
                  ].map((reason, idx) => (
                    <TouchableOpacity
                      key={reason}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                      onPress={() => setBanReason(reason)}
                    >
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#77a340ff",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                        }}
                      >
                        {banReason === reason && (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              borderRadius: 5,
                              backgroundColor: "#77a340ff",
                            }}
                          />
                        )}
                      </View>
                      <Text style={{ color: "#222", fontSize: 16 }}>
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {banReason === "Other" && (
                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={{
                          marginBottom: 4,
                          color: "#222",
                          fontWeight: "bold",
                        }}
                      >
                        Please specify the reason
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: "#77a340ff",
                          borderRadius: 10,
                          padding: 10,
                          color: "#222",
                          backgroundColor: "#f5f5f5",
                        }}
                        placeholder="Enter your reason....."
                        placeholderTextColor="#888"
                        value={otherReason}
                        onChangeText={setOtherReason}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  )}
                </View>
                <Text style={{ fontWeight: "bold" }}>
                  Are you sure you want to ban this member?
                </Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // handle ban logic here, use banReason and otherReason if needed
                      handleConfirmBanMember();
                      sheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {bottomSheetMode === "admin" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Are you sure to invite this member to be Admin?
                  </Text>
                </View>
                <Text>They will have all admin access.</Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleConfirmInviteMemberToAdmin();
                      sheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Invite</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {bottomSheetMode === "unban" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>Unban this member?</Text>
                </View>
                <Text>
                  They will regain access to the group and its content.
                </Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleConfirmUnbanMember();
                      sheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Unban</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {bottomSheetMode === "approve" && (
            <View style={[styles.modalContentContainer]}>
              <Image
                style={styles.joinConfirmImage}
                source={joinConfirmImage}
              />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    Approve this member?
                  </Text>
                </View>
                <Text>
                  They will be able to join the group and access its content.
                </Text>
                <View style={[styles.rowContainer, { gap: 20 }]}>
                  <TouchableOpacity
                    onPress={() => {
                      sheetRef.current?.close();
                    }}
                    style={styles.joinCancelButton}
                  >
                    <Text style={styles.joinCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onApprove(needApprovalUserID);
                      console.log(
                        "Approving member with ID: ",
                        needApprovalUserID
                      );
                      sheetRef.current?.close();
                    }}
                    style={styles.joinConfirmButton}
                  >
                    <Text style={styles.joinConfirmButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const colors = {
  admin: "#c4791dff",
  owner: "#69b40dff",
  member: "#32aed4ff",
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  textInput: {
    padding: 10,
    flex: 1,
    color: "#fff",
    fontSize: 18,
  },
  optionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    borderRadius: 14,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B4C55",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionButtonActive: {
    backgroundColor: "#5CA0D3", // Active tab color
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  role: {
    fontSize: 14,
    color: "#8A94AC",
    fontWeight: "bold",
  },
  roleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  optionButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#3B4C55",
    padding: 20,
    borderRadius: 10,
  },
  modalContentContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
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
    padding: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinConfirmButton: {
    backgroundColor: "#B9FF66",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bannedAtWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    padding: 10,
    flex: 1,
    color: "#000",
    fontSize: 18,
  },
});
