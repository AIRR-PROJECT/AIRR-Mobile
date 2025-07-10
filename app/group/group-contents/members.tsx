import { FontAwesome6 } from "@expo/vector-icons";
import { View, TextInput, StyleSheet } from "react-native";
import BlogApprovalCardComponent from "@/components/group/BlogApprovalCardComponent";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import React, { useEffect, useRef, useState } from "react";
import MemberApprovalCardComponent from "@/components/group/MemberApprovalCardComponent";
import { RequestOwner } from "@/interfaces/notifInterface";
import { PendingMemberRequest } from "@/interfaces/groupInterface";
import { useAppDispatch } from "@/redux/hook";
import { approveMember, getPendingMemberList, rejectBlog, rejectMember } from "@/redux/slices/groupSlice";
import { useLocalSearchParams } from "expo-router";

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

export default function MemberApprovalsPage() {
  // const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>()
  const { groupID, memberID } = useLocalSearchParams<{ groupID: string, memberID: string }>()

  const [members, setMembers] = useState<PendingMemberRequest[]>([]);

  // useEffect(() => {
  //   dispatch(getPendingMemberList(groupID)).then(res => {
  //     const list = res.payload as PendingMemberRequest[]
  //     setMembers(list)
  //   })
  // }, [])

  useEffect(() => {
    // Scroll to specific index
    if (members != undefined && memberID != "" && memberID != undefined) {
      members.forEach((value, index) => {
        if (value.Owner._id == memberID) {
          flatlistRef.current.scrollToIndex({ animated: true, index: index })
          return
        }
      })
    }
  }, [members, memberID])

  const onApprove = (id: string) => {
    // dispatch(approveMember({ groupID: groupID, userIDToApprove: id })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Approve user with id: ", id);
    //     setMembers((prev) => prev.filter((u) => u.Owner._id !== id));
    //   }
    // })
  };

  const onReject = (id: string) => {
    // dispatch(rejectMember({ groupID, userIDToReject: id })).then(res => {
    //   if (res.payload === true) {
    //     console.log("Reject user with id: ", id);
    //     setMembers((prev) => prev.filter((u) => u.Owner._id !== id));
    //   }
    // })
  };

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
      {/* Search Bar */}
      <View style={styles.textInputContainer}>
        <View style={styles.textInputWrapper}>
          <FontAwesome6 name="magnifying-glass" size={20} color="#fff" />
          <TextInput
            style={styles.textInput}
            placeholder="Search Blogs"
            placeholderTextColor="#8A94AC"
          />
        </View>
      </View>

      {/* Animated FlatList */}
      <Animated.FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
        itemLayoutAnimation={LinearTransition}
        ref={flatlistRef}
      />
    </GestureHandlerRootView>
  );
}

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
});
