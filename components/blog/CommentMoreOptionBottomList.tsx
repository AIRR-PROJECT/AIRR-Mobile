import { useAppDispatch } from "@/redux/hook";
import { deleteBlog, updateHideBlog } from "@/redux/slices/blogSlice";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text, ToastAndroid } from "react-native";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  isUserWrittenComment?: boolean;
};
export default function CommentMoreOptionBottomList({
  sheetRef,
  isUserWrittenComment = true,
}: MoreOptionComponentProps) {
  const handleEditPress = () => {
    // Handle edit action
  };
  const handleDeleteBlog = () => {
    // Handle delete action
  };
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
      {isUserWrittenComment && (
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            {/* Edit */}
            <FontAwesome name="edit" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Edit comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleDeleteBlog}
            activeOpacity={0.8}
          >
            {/* delete */}
            <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Delete comment</Text>
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
