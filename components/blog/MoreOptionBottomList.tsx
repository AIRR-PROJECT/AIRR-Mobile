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
import { TouchableOpacity, StyleSheet, Text, ToastAndroid } from "react-native";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  isUserWrittenBlog: boolean;
  blogId: string;
  groupId?: string;
  isFromFeed?: boolean; // Optional prop to indicate if the blog is from feed
  isFromFavourites?: boolean; // Optional prop to indicate if the blog is from favourites
  isFromDetail: boolean; // Optional prop to indicate if the blog is from detail
  isBlogStatusPendingOrActive: boolean
  isUserStatusPending: boolean
  isViewTypePrivateOrInProfile: boolean
  handleHideThisBlog: () => void;
  handleDeleteThisBlog: () => void;
};
export default function MoreOptionBottomList({
  sheetRef,
  isUserWrittenBlog,
  blogId,
  groupId,
  isFromFeed = false, // Default to false if not provided
  isFromFavourites = false, // Default to false if not provided
  isFromDetail = false, // Default to false if not provided
  isBlogStatusPendingOrActive = false,
  isUserStatusPending = false,
  isViewTypePrivateOrInProfile = false,
  handleHideThisBlog,
  handleDeleteThisBlog,
}: MoreOptionComponentProps) {
  const route = useRouter();
  const dispatch = useAppDispatch();

  const handleHideBlog = () => {
    dispatch(
      updateHideBlog({
        BlogID: blogId,
        Action: "add",
      })
    ).then((res) => {
      const result = res.payload as boolean;

      if (result == true) {
        ToastAndroid.show("Blog hidden", ToastAndroid.SHORT);
        handleHideThisBlog();
        sheetRef.current?.close();
      }
    });
  };
  const handleReportBlog = () => {
    // Handle reporting the blog
    if (groupId) {
      route.push(`/options/report-blog?blogID=${blogId}&groupID=${groupId}`);
    }
    else {
      route.push(`/options/report-blog?blogID=${blogId}`);
    }
  };
  const handleEditBlog = () => {
    // Handle editing the blog
    if (groupId) {
      route.push(`/blog/edit-blog?blogID=${blogId}&groupID=${groupId}`);
    }
    else {
      route.push(`/blog/edit-blog?blogID=${blogId}`);
    }
    // Pass the blogId to the edit blog screen
  };
  const handleDeleteBlog = () => {
    dispatch(deleteBlog(blogId)).then((res) => {
      const result = res.payload as boolean;

      if (result == true) {
        ToastAndroid.show("Blog deleted", ToastAndroid.SHORT);
        handleDeleteThisBlog();
        sheetRef.current?.close();
      }
    });
  };
  // console.log("isFromFeed", isFromFeed);
  const hanleRemoveFromFavourites = () => {
    // Handle removing the blog from favourites
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
          {isFromFavourites && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              onPress={hanleRemoveFromFavourites}
              activeOpacity={0.8}
            >
              {/* Remove from favorites */}
              <MaterialCommunityIcons
                name="bookmark-remove"
                size={24}
                color="black"
              />
              <Text style={styles.bottomOptionText}>
                Remove from favourites
              </Text>
            </TouchableOpacity>
          )}
          {(isBlogStatusPendingOrActive || isViewTypePrivateOrInProfile) && <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleEditBlog}
            activeOpacity={0.8}
          >
            {/* Edit */}
            <FontAwesome name="edit" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Edit blog</Text>
          </TouchableOpacity>}
          <TouchableOpacity
            style={styles.bottomOptionButton}
            onPress={handleDeleteBlog}
            activeOpacity={0.8}
          >
            {/* delete */}
            <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Delete blog</Text>
          </TouchableOpacity>
        </BottomSheetView>
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          {isFromFavourites && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              onPress={hanleRemoveFromFavourites}
              activeOpacity={0.8}
            >
              {/* Remove from favorites */}
              <MaterialCommunityIcons
                name="bookmark-remove"
                size={24}
                color="black"
              />
              <Text style={styles.bottomOptionText}>
                Remove from favourites
              </Text>
            </TouchableOpacity>
          )}
          {!isFromDetail && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              onPress={handleHideBlog}
              activeOpacity={0.8}
            >
              {/* Hide */}
              <Entypo name="circle-with-minus" size={24} color="black" />
              <Text style={styles.bottomOptionText}>Hide blog</Text>
            </TouchableOpacity>
          )}
          {!isFromFeed && !isUserStatusPending && (
            <TouchableOpacity
              style={styles.bottomOptionButton}
              onPress={handleReportBlog}
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
