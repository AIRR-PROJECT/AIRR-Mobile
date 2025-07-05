import { useRef, useMemo, useCallback, useState, memo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooterProps,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import GroupDropdownComponent from "@/components/blog/GroupDropdownComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Feather, FontAwesome } from "@expo/vector-icons";
import UploadThumbnailComponent from "@/components/blog/UploadThumbnailComponent";
import QuillEditor from "@/components/dom-components/QuillEditor/QuillEditor";
import ButtonGradient from "@/components/ButtonGradient";
import TagDropdownComponent from "@/components/blog/TagDropdownListComponent";
import { getGroupInfo, getPreviewGroups } from "@/redux/slices/groupSlice";
import {
  Group,
  GroupDetailInfo,
  GroupTag,
  PopularGroups,
} from "@/interfaces/groupInterface";
import { useAppDispatch } from "@/redux/hook";
import { ImageSource } from "expo-image";
import { CreateBlog } from "@/interfaces/blogInterface";
import { createBlog } from "@/redux/slices/blogSlice";
import { router, useLocalSearchParams } from "expo-router";
const mockGroup: Group = {
  Name: "Group's name",
  avatar: "",
  _id: "123",
  Description: "",
  Owner: {
    _id: "",
    Username: "",
    AvatarURL: "",
  },
  NumberOfMembers: 0,
  FieldName: "",
  CoverURL: "https://picsum.photos/300",
  Tags: [],
  members: [],
  timestamp: "",
};
const mockGroupList = Array(25).fill(mockGroup);
const mockTags = [
  "aimachine",
  "web3",
  "blockchain",
  "crypto",
  "nft",
  "ai",
  "machine learning",
  "artificial intelligence",
  "technology",
  "innovation",
  "future",
  "science",
  "data science",
  "big data",
  "cloud computing",
  "internet of things",
  "iot",
  "augmented reality",
  "virtual reality",
  "mixed reality",
];

export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
const Private: Group = {
  Name: "Private",
  avatar: "",
  _id: "",
  Description: "",
  Owner: {
    _id: "",
    Username: "",
    AvatarURL: "",
  },
  NumberOfMembers: 0,
  FieldName: "",
  CoverURL: "",
  Tags: [],
  members: [],
  timestamp: "",
};
const OnlyInMyProfile: Group = {
  Name: "Only in my profile",
  avatar: "",
  _id: "",
  Description: "",
  Owner: {
    _id: "",
    Username: "",
    AvatarURL: "",
  },
  NumberOfMembers: 0,
  FieldName: "",
  CoverURL: "",
  Tags: [],
  members: [],
  timestamp: "",
};
export default function NewBlog() {
  const dispatch = useAppDispatch();
  const { groupID } = useLocalSearchParams<{ groupID: string }>();

  const [isSelectGroupAllowed, setSelectGroupAllowed] = useState(true);
  const [chosenGroup, setChosenGroup] = useState<Group>();
  const groupSearchText = useRef("");
  const [searchFoundGroups, setSearchFoundGroups] = useState<Group[]>([
    Private,
    OnlyInMyProfile,
  ]);
  const [foundTags, setFoundTags] = useState<GroupTag[]>([]);
  const [chosenTags, setChosenTags] = useState<GroupTag[]>([]);
  const uploadedImg = useRef<ImageSource>();
  const title = useRef("");
  const description = useRef("");
  const content = useRef("");
  // Bottom Sheet Refs
  const groupSheetRef = useRef<BottomSheet>(null);
  const tagsSheetRef = useRef<BottomSheet>(null);
  // Variables
  const groupSnapPoints = useMemo(() => ["50%", "90%"], []);
  const tagsSnapPoints = useMemo(() => ["50%", "90%"], []);

  useEffect(() => {
    if (groupID) {
      dispatch(getGroupInfo({ groupID })).then((res) => {
        setChosenGroup(res.payload as Group);
        setSelectGroupAllowed(false);
      });
    }
  }, [groupID]);

  useEffect(() => {
    if (chosenGroup) {
      setFoundTags(chosenGroup?.Tags);
    }
  }, [chosenGroup]);

  // Callbacks
  const handleGroupSnapPress = useCallback((index: number) => {
    groupSheetRef.current?.snapToIndex(index);
  }, []);

  const handleGroupSnapClose = useCallback(() => {
    groupSheetRef.current?.close();
  }, []);

  const handleGroupSheetChange = useCallback((index: any) => {
    console.log("handleGroupSheetChange", index);
  }, []);

  const handleGroupSearchTextChange = (val: string) => {
    groupSearchText.current = val;
  };
  const handleGroupSearchSubmit = () => {
    dispatch(getPreviewGroups(groupSearchText.current)).then((res) => {
      setSearchFoundGroups(res.payload as Group[]);
    });
  };

  const handleTagsSnapPress = useCallback((index: number) => {
    tagsSheetRef.current?.snapToIndex(index);
  }, []);
  const handleTagsSnapClose = useCallback(() => {
    tagsSheetRef.current?.close();
  }, []);
  const handleTagsSheetChange = useCallback((index: any) => {
    console.log("handleTagsSheetChange", index);
  }, []);

  const handleTitleTextChange = (val: string) => {
    title.current = val;
  };

  const handleDescriptionTextChange = (val: string) => {
    description.current = val;
  };

  const handleContentTextChange = (val: string) => {
    content.current = val;
  };

  const handlePostBlogPress = () => {
    if (
      !uploadedImg.current ||
      !chosenGroup ||
      !chosenTags ||
      !title.current ||
      !description.current ||
      !content.current
    ) {
      Alert.alert("Error", "Missing field");

      return;
    }

    const formData = new FormData();
    formData.append("thumbnail", {
      uri: uploadedImg.current?.uri,
      name: uploadedImg.current?.fileName,
      type: uploadedImg.current?.mimeType,
    });
    formData.append("group", JSON.stringify(chosenGroup));
    formData.append("tags", JSON.stringify(chosenTags));
    formData.append("title", title.current);
    formData.append("description", description.current);
    formData.append("content", content.current);

    dispatch(createBlog(formData)).then((res) => {
      if (typeof res.payload === "boolean" && res.payload == true) {
        router.replace("/my-feed");
      }
    });
  };

  // Render Item
  const renderGroupItem = useCallback(
    ({ item }: { item: Group }) => (
      <GroupDropdownComponent
        groupData={item}
        onPress={(data) => {
          console.log("Group selected:", data.groupData.Name);
          setChosenGroup(data.groupData);
          handleGroupSnapClose();
        }}
      />
    ),
    []
  );
  const onPressTag = useCallback(
    (listTags: GroupTag[]) => {
      console.log("List tags selected:", listTags);
      setChosenTags(listTags);
    },
    [chosenTags]
  );
  const handleCreateGroup = () => {
    // Handle create group logic here
    console.log("Create Group Pressed");
  };
  const renderGroupFooter = useCallback((props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter {...props} style={styles.searchBar}>
        <FontAwesome
          name="search"
          size={24}
          color="#fff"
          style={{ paddingLeft: 10 }}
        />
        <TextInput
          onChangeText={handleGroupSearchTextChange}
          style={styles.searchText}
          placeholder="Search Groups"
          placeholderTextColor="#888"
          onSubmitEditing={handleGroupSearchSubmit}
        />
      </BottomSheetFooter>
    );
  }, []);
  const renderTagsFooter = useCallback((props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter {...props} style={styles.searchBar}>
        <FontAwesome
          name="search"
          size={24}
          color="#fff"
          style={{ paddingLeft: 10 }}
        />
        <TextInput
          style={styles.searchText}
          placeholder="Search Tags"
          placeholderTextColor="#888"
        />
      </BottomSheetFooter>
    );
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Group Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>1</Text>
          </View>
          <Text style={styles.title}>Group</Text>
        </View>
        {/* Group Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              disabled={!isSelectGroupAllowed}
              style={styles.heading}
              onPress={() => handleGroupSnapPress(0)}
              activeOpacity={0.8}
            >
              <FontAwesome name="group" size={24} color="#fff" />
              <View
                style={{
                  width: "60%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[styles.headingTitle]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {chosenGroup ? chosenGroup.Name : "Select Group To Post"}
                </Text>
              </View>

              <IconSymbol
                name="chevron.right"
                size={24}
                weight="medium"
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>2</Text>
          </View>
          <Text style={styles.title}>Tags</Text>
        </View>

        {/* Tags Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          {/* if group is "Private" or "In profile blog", disable this component */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.heading,
                (chosenGroup?.Name === "Private" ||
                  chosenGroup?.Name === "Only in my profile") && {
                  opacity: 0.5,
                },
              ]}
              onPress={() => handleTagsSnapPress(0)}
              activeOpacity={0.8}
              disabled={
                chosenGroup?.Name === "Private" ||
                chosenGroup?.Name === "Only in my profile"
              }
            >
              <Feather name="flag" size={24} color="#fff" />

              <View
                style={[
                  styles.tagsColumn,
                  {
                    flexDirection: chosenTags.length > 0 ? "row" : "column",
                    flexWrap: chosenTags.length > 0 ? "wrap" : "nowrap",
                  },
                ]}
              >
                {chosenTags.length > 0 ? (
                  chosenTags.map((tag) => (
                    <TagWrapper key={tag._id} tag={tag.TagName} />
                  ))
                ) : (
                  <Text
                    style={[
                      styles.headingTitle,
                      {
                        alignSelf: "center",
                        color:
                          chosenGroup?.Name === "Private" ||
                          chosenGroup?.Name === "Only in my profile"
                            ? "#D2AE17"
                            : "#fff",
                        textAlign: "justify",
                      },
                    ]}
                  >
                    {chosenGroup?.Name === "Private" ||
                    chosenGroup?.Name === "Only in my profile"
                      ? "Tags cannot be selected with private or only in profile blog"
                      : "Select Tags for blog"}
                  </Text>
                )}
              </View>

              <IconSymbol
                name="chevron.right"
                size={24}
                weight="medium"
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thumbnail Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>3</Text>
          </View>
          <Text style={styles.title}>Thumbnail</Text>
        </View>

        {/* Thumbnail Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ gap: 20, flex: 1 }}>
            <Text style={styles.smallText}>
              Show off your vibe! Upload a profile pic to make your account
              totally you. Let the world see your style!
            </Text>
            <View>
              <UploadThumbnailComponent
                onSetImg={(imgSource) => {
                  uploadedImg.current = imgSource;
                }}
              />
            </View>
          </View>
        </View>

        {/* Title Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>4</Text>
          </View>
          <Text style={styles.title}>Title</Text>
        </View>

        {/* Title Input */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Enter Blog Title *"
              placeholderTextColor="#A2B5A5"
              style={styles.titleInput}
              multiline={true}
              numberOfLines={3}
              onChangeText={handleTitleTextChange}
            />
          </View>
        </View>

        {/* Description Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>5</Text>
          </View>
          <Text style={styles.title}>Description</Text>
        </View>

        {/* Description Input */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Enter Blog Description *"
              placeholderTextColor="#A2B5A5"
              style={styles.titleInput}
              multiline={true}
              numberOfLines={3}
              onChangeText={handleDescriptionTextChange}
            />
          </View>
        </View>

        {/* Content Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>6</Text>
          </View>
          <Text style={styles.title}>Content</Text>
        </View>

        {/* Content Input */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            {/* QuillJS Here */}
            <QuillEditor
              dom={{ matchContents: true }}
              onValueChange={handleContentTextChange}
            />
          </View>
        </View>
        {/* Post button */}
        <ButtonGradient
          label="POST BLOG"
          onPress={handlePostBlogPress}
          style={styles.postButtonStyle}
          labelStyle={styles.postButtonLabel}
        />
        {/* Preview (ask later) */}
      </ScrollView>

      {/* Group Selection Bottom Sheet */}
      <BottomSheet
        ref={groupSheetRef}
        index={-1} // Start closed
        snapPoints={groupSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#212531" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        onChange={handleGroupSheetChange}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        footerComponent={renderGroupFooter}
      >
        <TouchableOpacity
          onPress={handleCreateGroup}
          style={styles.createGroupButton}
          activeOpacity={0.8}
        >
          <Text style={styles.createGroupButtonText}>Create New Group</Text>
        </TouchableOpacity>
        <View>
          <BottomSheetFlatList
            data={searchFoundGroups}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderGroupItem}
            contentContainerStyle={styles.groupListContent}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={{ height: 120 }} />}
          />
        </View>
      </BottomSheet>
      <BottomSheet
        ref={tagsSheetRef}
        index={-1} // Start closed
        snapPoints={tagsSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#212531" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        onChange={handleGroupSheetChange}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        footerComponent={renderTagsFooter}
      >
        <TagDropdownComponent tags={foundTags} onPress={onPressTag} />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
function TagWrapper({ tag }: { tag: string }) {
  return (
    <View style={styles.tagWrapper}>
      <Text style={styles.tag}># {tag}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  sectionContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#B9FF66",
  },
  section: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#B9FF66",
    marginHorizontal: 20,
  },
  groupListContent: {
    padding: 16,
    backgroundColor: "#212531",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#212531",
    borderRadius: 25,
    padding: 20,
    flex: 1,
  },
  headingTitle: {
    fontSize: 16,
    color: "#fff",
  },
  smallText: {
    fontSize: 14,
    color: "#A2B5A5",
    textAlign: "justify",
  },
  titleInput: {
    backgroundColor: "#212531",
    color: "#fff",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  descriptionInput: {
    backgroundColor: "#212531",
    color: "#fff",
    borderRadius: 20,
    padding: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
  },
  postButtonStyle: {
    width: 200,
    alignSelf: "flex-end",
    height: 50,
  },
  postButtonLabel: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  createGroupButton: {
    backgroundColor: "#B9FF66",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  createGroupButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  tag: {
    color: "#fff",
    fontSize: 16,
  },
  tagWrapper: {
    backgroundColor: "#2E3B40",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 9,
  },
  tagsColumn: {
    width: "70%",
  },
  searchBar: {
    backgroundColor: "#2E3B40",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchText: {
    paddingHorizontal: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
