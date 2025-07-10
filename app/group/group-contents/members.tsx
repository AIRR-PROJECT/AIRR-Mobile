import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import MemberApprovalCardComponent from "@/components/group/MemberApprovalCardComponent";
import { RequestOwner } from "@/interfaces/notifInterface";
import { GroupBannedMember, GroupMember, PendingMemberRequest } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  approveMember,
  getBannedMemberList,
  getMemberList,
  getPendingMemberList,
  rejectBlog,
  rejectMember,
} from "@/redux/slices/groupSlice";
import { router, useLocalSearchParams } from "expo-router";
import { GroupRole } from "@/enums/group.enum";
import { Image } from "expo-image";

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
enum TabOptions {
  All = "all",
  NeedApproval = "need-approval",
  Banned = "banned",
}
export default function MemberApprovalsPage() {
  const dispatch = useAppDispatch()
  const displayMembersFlatlistRef = useRef<any>();
  const memberApprovalsFlatlistRef = useRef<any>();
  const { userCurrentGroupRole } = useAppSelector(state => state.user)
  const { groupID, memberID } = useLocalSearchParams<{
    groupID: string;
    memberID: string;
  }>();

  const [displayMembers, setDisplayMembers] = useState<GroupMember[]>([]);
  const [membersApproval, setMembersApproval] = useState<PendingMemberRequest[]>([]);
  const [bannedMembers, setBannedMembers] = useState<GroupBannedMember[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);

  useEffect(() => {
    if (selectedTab == TabOptions.All) {
      dispatch(getMemberList({ groupID })).then((res) => {
        let sortOrder = ["Owner", "Admin", "Member"]
        const groupMembers = res.payload as GroupMember[]
        const sortedGroupMembers = groupMembers.sort((a, b) => sortOrder.indexOf(a.Role) - sortOrder.indexOf(b.Role))

        setDisplayMembers(sortedGroupMembers)
      })
    }
    else if (selectedTab == TabOptions.NeedApproval) {
      dispatch(getPendingMemberList(groupID)).then(res => {
        const list = res.payload as PendingMemberRequest[]
        setMembersApproval(list)
      })
    }
    else {
      dispatch(getBannedMemberList(groupID)).then(res => {
        const list = res.payload as GroupBannedMember[]
        setBannedMembers(list)
      })
    }
  }, [selectedTab])

  useEffect(() => {
    // Scroll to specific index
    if (membersApproval != undefined && memberID != "" && memberID != undefined) {
      membersApproval.forEach((value, index) => {
        if (value.Owner._id == memberID) {
          memberApprovalsFlatlistRef.current.scrollToIndex({ animated: true, index: index });
          return;
        }
      });
    }
  }, [membersApproval, memberID]);

  const onApprove = (id: string) => {
    dispatch(approveMember({ groupID: groupID, userIDToApprove: id })).then(res => {
      if (res.payload === true) {
        console.log("Approve user with id: ", id);
        setMembersApproval((prev) => prev.filter((u) => u.Owner._id !== id));
      }
    })
  };

  const onReject = (id: string) => {
    dispatch(rejectMember({ groupID, userIDToReject: id })).then(res => {
      if (res.payload === true) {
        console.log("Reject user with id: ", id);
        setMembersApproval((prev) => prev.filter((u) => u.Owner._id !== id));
      }
    })
  };

  const handleOnDisplayMemberPress = (userID: string) => {
    router.push(`/profile?userID=${userID}`)
  }

  const renderItem = ({ item }: any) => (
    <MemberApprovalCardComponent
      id={item.Owner._id}
      name={item.Owner.Username}
      avatar={item.Owner.AvatarURL}
      username={item.Owner.Username}
      time={item.RequestDate}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
  return (
    <GestureHandlerRootView style={styles.container}>
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

        {(userCurrentGroupRole == GroupRole.Admin || userCurrentGroupRole == GroupRole.Owner) && (
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
        {(userCurrentGroupRole == GroupRole.Admin || userCurrentGroupRole == GroupRole.Owner) && (
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
      {selectedTab == TabOptions.All ? 
        <FlatList
          data={displayMembers}
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
              onPress={() => handleOnDisplayMemberPress(item.MemberInfo._id)}
            >
              <Image source={item.MemberInfo.AvatarURL} style={styles.avatar} />
              <View>
                <Text style={styles.memberName}>{item.MemberInfo.Username}</Text>
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
                  <FontAwesome6
                    name="bolt"
                    size={24}
                    color={
                      item.Role === "Admin"
                        ? colors.admin
                        : item.Role === "Owner"
                        ? colors.owner
                        : colors.member
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      : (selectedTab == TabOptions.NeedApproval ? 
        <Animated.FlatList
          data={membersApproval}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          itemLayoutAnimation={LinearTransition}
          ref={memberApprovalsFlatlistRef}
        />
      : <FlatList
          data={bannedMembers}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ borderColor: colors.member }}
              onPress={() => handleOnDisplayMemberPress(item.Owner._id)}
            >
              <Image source={item.Owner.AvatarURL} style={styles.avatar} />
              <View>
                <Text style={styles.memberName}>{item.Owner.Username}</Text>
                <View style={styles.roleWrapper}>
                  <FontAwesome6
                    name="bolt"
                    size={24}
                    color={colors.member}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </GestureHandlerRootView>
  );
}

const colors = {
  admin: "#FFBA66",
  owner: "#B9FF66",
  member: "#66DBFF",
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
    borderWidth: 1,
    borderRadius: 20,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  role: {
    fontSize: 14,
    color: "#8A94AC",
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
});
