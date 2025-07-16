import { GroupRole } from "@/enums/group.enum";
import { useAppDispatch } from "@/redux/hook";
import { deleteBlog, updateHideBlog } from "@/redux/slices/blogSlice";
import { deleteGroup } from "@/redux/slices/groupSlice";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ToastAndroid,
  Alert,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { set } from "lodash";
type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  groupID: string;
  userRole?: GroupRole;
};
const joinConfirmImage = require("@/assets/images/group/join_confirm.png");
export default function GroupMoreOptionBottomList({
  sheetRef,
  groupID,
  userRole = GroupRole.Member,
}: MoreOptionComponentProps) {
  const dispatch = useAppDispatch();
  const route = useRouter();
  const handleEditGroup = () => {
    route.push(`/group/edit-group?groupID=${groupID}`);
  };
  // const handleDeleteGroup = () => {
  //   Alert.alert("Are you sure?", "This action cannot be undone.", [
  //     {
  //       text: "Cancel",
  //       style: "cancel",
  //     },
  //     {
  //       text: "Delete",
  //       style: "destructive",
  //       onPress: () => {
  //         // Call delete action here
  //         dispatch(deleteGroup(groupID)).then((res) => {
  //           const result = res.payload as boolean;
  //           if (result == true) {
  //             ToastAndroid.show(
  //               "Group deleted successfully",
  //               ToastAndroid.SHORT
  //             );
  //             route.dismiss();
  //             sheetRef.current?.close();
  //           }
  //         });
  //       },
  //     },
  //   ]);
  // };
  const handleDeleteGroup = () => {
    dispatch(deleteGroup(groupID)).then((res) => {
      const result = res.payload as boolean;
      if (result == true) {
        ToastAndroid.show("Group deleted successfully", ToastAndroid.SHORT);
        route.dismiss();
        route.setParams({
          groupIDToRemove: groupID
        })
        sheetRef.current?.close();
      }
    });
  };
  const [optionState, setOptionState] = useState<"main" | "delete">("main");
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1} // Start closed
      enableDynamicSizing
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: "#1E1E1E" }}
      handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
      style={{ backgroundColor: "#1E1E1E" }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      onClose={() => {
        setOptionState("main");
      }}
    >
      {
        <BottomSheetView style={styles.contentContainer}>
          {optionState === "main" && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              activeOpacity={0.8}
              onPress={() => {
                sheetRef.current?.close();
                handleEditGroup();
            }}
          >
            {/* Remove from favorites */}
            <FontAwesome name="edit" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Edit group</Text>
          </TouchableOpacity>)}
          {optionState === "main" && userRole == GroupRole.Owner && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              activeOpacity={0.8}
              onPress={() => {
                setOptionState("delete");
              }}
            >
              {/* delete */}
              <MaterialIcons name="delete" size={24} color="black" />
              <Text style={styles.bottomOptionText}>Delete group</Text>
            </TouchableOpacity>
          )}

          {optionState === "delete" && (
            <View style={[styles.modalContentContainer]}>
              <Image style={styles.joinConfirmImage} source={joinConfirmImage} />
              <View style={{ flex: 1, gap: 10 }}>
                <View style={{}}>
                  <Text style={styles.joinModalTitle}>
                    The group will be deleted?
                </Text>
              </View>
              <Text style={{ color: "#000", fontSize: 14 }}>
                This action is irreversible. Do you really want to delete this group?
              </Text>
              <View style={[styles.rowContainer, { gap: 20 }]}>
                <TouchableOpacity
                  onPress={() => {
                    sheetRef.current?.close();
                  }}
                  style={styles.joinCancelButton}
                >
                  <Text style={styles.joinCancelButtonText}>
                    Let Me Rethink
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteGroup();

                    sheetRef.current?.close();
                  }}
                  style={styles.joinConfirmButton}
                >
                  <Text style={styles.joinConfirmButtonText}>
                    Delete This Group
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>)}
        </BottomSheetView>
      }
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  bottomOptionButton: {
    flexDirection: "row",
    padding: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginTop: 20,
    gap: 10,
  },
  bottomOptionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
