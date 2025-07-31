import { BlogStatus } from "@/enums/blog_properties.enum";
import { GroupStatusRoleCheck } from "@/enums/group.enum";
import { useAppDispatch } from "@/redux/hook";
import {
  deleteBlog,
  unsaveBlog,
  updateHideBlog,
} from "@/redux/slices/blogSlice";
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
import { useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, ToastAndroid } from "react-native";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  isUserWrittenBlog: boolean;
  blogId: string;
  groupId?: string;
  role: string;
  blogStatus: string;
  isFromFeed?: boolean; // Optional prop to indicate if the blog is from feed
  isFromFavourites?: boolean; // Optional prop to indicate if the blog is from favourites
  isFromDetail: boolean; // Optional prop to indicate if the blog is from detail
  isViewTypePrivateOrInProfile: boolean;
  isAlreadyReported: boolean;
  handleHideThisBlog: () => void;
  handleDeleteThisBlog: () => void;
  handleRemoveFavoriteThisBlog?: () => void;
};
export default function MoreOptionBottomList({
  sheetRef,
  isUserWrittenBlog,
  blogId,
  groupId,
  role,
  blogStatus,
  isFromFeed = false, // Default to false if not provided
  isFromFavourites = false, // Default to false if not provided
  isFromDetail = false, // Default to false if not provided
  isViewTypePrivateOrInProfile = false,
  isAlreadyReported = false,
  handleHideThisBlog,
  handleDeleteThisBlog,
  handleRemoveFavoriteThisBlog,
}: MoreOptionComponentProps) {
  const route = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(`isUserWrittenBlog: ${isUserWrittenBlog}`);
    console.log(`blogId: ${blogId}`);
    console.log(`groupId: ${groupId}`);
    console.log(`role: ${role}`);
    console.log(`blogStatus: ${blogStatus}`);
    console.log(
      `isViewTypePrivateOrInProfile: ${isViewTypePrivateOrInProfile}`
    );
    console.log(`isAlreadyReported: ${isAlreadyReported}`);
    console.log(
      !isFromFeed &&
        role !== GroupStatusRoleCheck.NOT_MEMBER &&
        role !== GroupStatusRoleCheck.PENDING
    );
  }, [
    isUserWrittenBlog,
    blogId,
    groupId,
    role,
    blogStatus,
    isViewTypePrivateOrInProfile,
  ]);

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
    if (
      isAlreadyReported &&
      role !== GroupStatusRoleCheck.ADMIN &&
      role !== GroupStatusRoleCheck.OWNER
    ) {
      ToastAndroid.show("This blog is already reported", ToastAndroid.LONG);

      return;
    }

    // Handle reporting the blog
    if (groupId) {
      route.push(`/options/report-blog?blogID=${blogId}&groupID=${groupId}`);
    } else {
      route.push(`/options/report-blog?blogID=${blogId}`);
    }
  };
  const handleEditBlog = () => {
    // Handle editing the blog
    if (groupId) {
      route.push(`/blog/edit-blog?blogID=${blogId}&groupID=${groupId}`);
    } else {
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
    dispatch(unsaveBlog(blogId)).then((res) => {
      const result = res.payload as boolean;
      if (result == true) {
        handleRemoveFavoriteThisBlog!();
      }
    });
  };
  const handleBanBlog = () => {};
  const hasEditAction =
    ((blogStatus === BlogStatus.ACTIVE || blogStatus === BlogStatus.PENDING) &&
      (isUserWrittenBlog || role !== GroupStatusRoleCheck.NOT_MEMBER)) ||
    isViewTypePrivateOrInProfile;

  const hasDeleteAction =
    ((blogStatus === BlogStatus.ACTIVE || blogStatus === BlogStatus.PENDING) &&
      (isUserWrittenBlog || role !== GroupStatusRoleCheck.NOT_MEMBER)) ||
    isViewTypePrivateOrInProfile ||
    blogStatus === BlogStatus.REJECTED ||
    blogStatus === BlogStatus.BANNED;

  const hasUserActions = hasEditAction || hasDeleteAction;

  // Calculate if any actions are available for other user's blog
  const hasHideAction = !isFromDetail;
  const hasReportAction =
    !isFromFeed &&
    role !== GroupStatusRoleCheck.NOT_MEMBER &&
    role !== GroupStatusRoleCheck.PENDING;

  const hasOtherUserActions = hasHideAction || hasReportAction;

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
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
          {!hasUserActions ? (
            // Show "No actions available" when user has no actions
            <Text style={styles.noActionText}>No actions available</Text>
          ) : (
            <>
              {hasEditAction && (
                <TouchableOpacity
                  style={styles.bottomOptionButton}
                  onPress={handleEditBlog}
                  activeOpacity={0.8}
                >
                  <FontAwesome name="edit" size={24} color="black" />
                  <Text style={styles.bottomOptionText}>Edit blog</Text>
                </TouchableOpacity>
              )}
              {hasDeleteAction && (
                <TouchableOpacity
                  style={styles.bottomOptionButton}
                  onPress={handleDeleteBlog}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                  <Text style={styles.bottomOptionText}>Delete blog</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </BottomSheetView>
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          {!hasOtherUserActions ? (
            // Show "No actions available" when user has no actions
            <Text style={styles.noActionText}>No actions available</Text>
          ) : (
            <>
              {hasHideAction && (
                <TouchableOpacity
                  style={styles.bottomOptionButton}
                  onPress={handleHideBlog}
                  activeOpacity={0.8}
                >
                  <Entypo name="circle-with-minus" size={24} color="black" />
                  <Text style={styles.bottomOptionText}>Hide blog</Text>
                </TouchableOpacity>
              )}
              {hasReportAction && (
                <TouchableOpacity
                  style={styles.bottomOptionButton}
                  onPress={handleReportBlog}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="report" size={24} color="black" />
                  {role === GroupStatusRoleCheck.MEMBER ? (
                    <Text style={styles.bottomOptionText}>Report blog</Text>
                  ) : role === GroupStatusRoleCheck.ADMIN ||
                    role === GroupStatusRoleCheck.OWNER ? (
                    <Text style={styles.bottomOptionText}>Ban blog</Text>
                  ) : (
                    <Text style={styles.bottomOptionText}>
                      Something is wrong
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </>
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
  noActionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});
