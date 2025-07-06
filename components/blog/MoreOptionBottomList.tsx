import { useAppDispatch } from "@/redux/hook";
import { deleteBlog } from "@/redux/slices/blogSlice";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text, ToastAndroid } from "react-native";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  isUserWrittenBlog: boolean;
  blogId: string;
  isFromFeed?: boolean; // Optional prop to indicate if the blog is from feed
};
export default function MoreOptionBottomList({
  sheetRef,
  isUserWrittenBlog,
  blogId,
  isFromFeed = false, // Default to false if not provided
}: MoreOptionComponentProps) {
  const route = useRouter();
  const handleHideBlog = () => {
    // Handle hiding the blog
    ToastAndroid.show("Blog hidden", ToastAndroid.SHORT);
  };
  const handleReportBlog = () => {
    // Handle reporting the blog
    route.push("/options/report-blog");
    // Check if user check any option in report blog screen
    // If yes, then report the blog
    ToastAndroid.show("Blog reported", ToastAndroid.SHORT);
  };
  const handleEditBlog = () => {
    // Handle editing the blog
    route.push("/blog/edit-blog");
    // Pass the blogId to the edit blog screen
  };
  const handleDeleteBlog = () => {
    // Handle deleting the blog
    ToastAndroid.show("Blog deleted", ToastAndroid.SHORT);
    // Dispatch the deleteBlog action with the blogId
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
      {isUserWrittenBlog ? (
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleEditBlog}
            activeOpacity={0.8}
          >
            {/* Edit */}
            <FontAwesome name="edit" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Edit blog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleHideBlog}
            activeOpacity={0.8}
          >
            {/* delete */}
            <MaterialIcons
              name="delete"
              size={24}
              color="black"
              onPress={handleDeleteBlog}
            />
            <Text style={styles.bottomOptionText}>Delete blog</Text>
          </TouchableOpacity>
        </BottomSheetView>
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleReportBlog}
            activeOpacity={0.8}
          >
            {/* Hide */}
            <Entypo name="circle-with-minus" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Hide blog</Text>
          </TouchableOpacity>
          {isFromFeed && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              onPress={handleHideBlog}
              activeOpacity={0.8}
            >
              {/* Report */}
              <MaterialIcons name="report" size={24} color="black" />
              <Text style={styles.bottomOptionText}>Report blog</Text>
            </TouchableOpacity>
          )}
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
