import { GroupRole } from "@/enums/group.enum";
import { useAppDispatch } from "@/redux/hook";
import { deleteBlog, updateHideBlog } from "@/redux/slices/blogSlice";
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
import { TouchableOpacity, StyleSheet, Text, ToastAndroid, Alert } from "react-native";
import { G } from "react-native-svg";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  userRole?: GroupRole;
};
export default function BlogMoreOptionBottomList({
  sheetRef,
  userRole = GroupRole.Member,
}: MoreOptionComponentProps) {
  const route = useRouter();
  const handleEditGroup = () => {
    route.push("/group/edit-group");
  }
  const handleDeleteGroup = () => {
    Alert.alert("Are you sure?", "This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // Call delete action here
          // dispatch(deleteBlog(blogId));
          ToastAndroid.show("Group deleted successfully", ToastAndroid.SHORT);
          sheetRef.current?.close();
        },
      },
    ]);
  }
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
    >
      {userRole == GroupRole.Owner && (
        <BottomSheetView style={styles.contentContainer}>
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
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            activeOpacity={0.8}
            onPress={() => {
              sheetRef.current?.close();
              handleDeleteGroup();
            }}
          >
            {/* delete */}
            <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Delete group</Text>
          </TouchableOpacity>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
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
});
