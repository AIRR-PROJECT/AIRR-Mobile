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
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import UploadThumbnailComponent from "@/components/blog/UploadThumbnailComponent";
import QuillEditor from "@/components/dom-components/QuillEditor/QuillEditor";
import ButtonGradient from "@/components/ButtonGradient";
import BlogTagDropdownComponent from "@/components/blog/BlogTagDropdownListComponent";
import {
  getGroupInfo,
  getPreviewGroups,
  searchGroupsForCreateUpdateBlog,
} from "@/redux/slices/groupSlice";
import {
  Group,
  GroupDetailInfo,
  GroupTag,
  PopularGroups,
} from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { ImageSource } from "expo-image";
import {
  CreateBlog,
  CreateBlogResult,
  CreateBlogTag,
} from "@/interfaces/blogInterface";
import {
  createBlog,
  setCreateBlogCurrentTags,
  setCreateBlogRequestedTags,
  setCreateBlogTagCount,
} from "@/redux/slices/blogSlice";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { GroupRole } from "@/enums/group.enum";
import { BlogViewType } from "@/enums/blog_properties.enum";

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
  FieldID: "",
  IsAdminOrOwner: false,
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
  FieldID: "",
  IsAdminOrOwner: false,
};

// TODO: remove this after fixing
const VITE_CLOUDINARY_CLOUD_NAME = "dvjiwyc6g"
const VITE_CLOUDINARY_PRESET = "blog_images_preset"

export default function NewBlog() {
  const dispatch = useAppDispatch();
  const { groupID } = useLocalSearchParams<{ groupID: string }>();
  const route = useRouter();

  const { createBlogCurrentTags, createBlogRequestedTags, createBlogTagCount } = useAppSelector(
    (state) => state.blog
  );

  const [isSelectGroupAllowed, setSelectGroupAllowed] = useState(true);
  const [chosenGroup, setChosenGroup] = useState<Group | GroupDetailInfo>();
  const groupSearchText = useRef("");
  const defaultSearchGroups: Group[] = [Private, OnlyInMyProfile];
  const [searchFoundGroups, setSearchFoundGroups] =
    useState<Group[]>(defaultSearchGroups);
  const [foundTags, setFoundTags] = useState<GroupTag[]>([]);
  const [chosenTags, setChosenTags] = useState<GroupTag[]>([]);
  const [chosenGroupTags, setChosenGroupTags] = useState<string[]>([]);
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
    dispatch(setCreateBlogCurrentTags([]));
    dispatch(setCreateBlogRequestedTags([]));
    dispatch(setCreateBlogTagCount(0))
  }, []);

  useEffect(() => {
    if (groupID) {
      dispatch(getGroupInfo({ groupID })).then((res) => {
        const chosenGroup = res.payload as GroupDetailInfo;
        setChosenGroup(chosenGroup);
        setSelectGroupAllowed(false);
        setIsUserMember(chosenGroup.Role == GroupRole.Member);

        let chosenGroupTagsString: string[] = [];
        chosenGroup.Tags.forEach((t) => {
          chosenGroupTagsString.push(t.TagName);
        });
        setChosenGroupTags(chosenGroupTagsString);
        dispatch(setCreateBlogCurrentTags(chosenGroupTagsString));
      });
    }
  }, [groupID]);

  useEffect(() => {
    if (chosenGroup) {
      setFoundTags(chosenGroup?.Tags);
      setChosenTags([]);
      
      setRequestedTags([])
      dispatch(setCreateBlogRequestedTags([]))
    }
  }, [chosenGroup]);

  useEffect(() => {
    if (chosenTags.length != 0) {
      let chosenTagsString: string[] = [];
      chosenTags.forEach((t) => {
        // Collect name of all the chosen tags and put them in a single array
        if (!createBlogCurrentTags.includes(t.TagName))
          chosenTagsString.push(t.TagName);
      });
      dispatch(
        setCreateBlogCurrentTags([...chosenGroupTags, ...chosenTagsString])
      );
    }
  }, [chosenTags]);

  useEffect(() => {
    console.log(
      `createBlogRequestedTags: ${JSON.stringify(createBlogRequestedTags)}`
    );
  }, [createBlogRequestedTags]);

  // Callbacks
  const handleGroupSnapPress = useCallback((index: number) => {
    // Fetch default groups (COMMENTED TILL HAVE API)
    // dispatch(searchGroupsForCreateUpdateBlog("")).then((res) => {
    //   const data = res.payload as Group[]

    //   setSearchFoundGroups(defaultSearchGroups.concat(data))
    // })

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
    if (groupSearchText.current.length != 0) {
      dispatch(searchGroupsForCreateUpdateBlog(groupSearchText.current)).then(
        (res) => {
          setSearchFoundGroups(
            defaultSearchGroups.concat(res.payload as Group[])
          );
        }
      );
    } else {
      setSearchFoundGroups(defaultSearchGroups);
    }
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
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const handleTitleTextChange = (val: string) => {
    setTitleText(val);
    title.current = val;
  };

  const handleDescriptionTextChange = (val: string) => {
    setDescriptionText(val);
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

    if (title.current.length < 10) {
      Alert.alert("Error", "Title must be at least 10 characters long")
      return
    }
    if (description.current.length < 10) {
      Alert.alert("Error", "Description must be at lease 10 characters long")
      return
    }

    const formData = new FormData();
    formData.append("thumbnail", {
      uri: uploadedImg.current?.uri,
      name: uploadedImg.current?.fileName,
      type: uploadedImg.current?.mimeType,
    });
    formData.append(
      "group",
      chosenGroup.Name != Private.Name && chosenGroup.Name != OnlyInMyProfile.Name
        ? JSON.stringify(chosenGroup)
        : null
    );

    const chosenTagsReformatted: CreateBlogTag[] = JSON.parse(
      JSON.stringify(chosenTags)
    ) as CreateBlogTag[];
    chosenTagsReformatted.forEach((t) => {
      t.OperationType = "tag-in-group";
    });
    formData.append(
      "tags",
      chosenGroup.Name != Private.Name && chosenGroup.Name != OnlyInMyProfile.Name
        ? JSON.stringify([...chosenTagsReformatted, ...createBlogRequestedTags])
        : null
    );

    formData.append("title", title.current);
    formData.append("description", description.current);
    formData.append("content", content.current);
    let viewType =
      chosenGroup.Name == "Private"
        ? BlogViewType.PRIVATE
        : chosenGroup.Name == "Only in my profile"
        ? BlogViewType.IN_PROFILE_PAGE
        : BlogViewType.IN_GROUP;
    formData.append("viewType", viewType);

    dispatch(createBlog(formData)).then((res) => {
      const data = res.payload as CreateBlogResult;
      console.log(res.payload)
      if (res.payload != null) {
        router.replace(`/blog?userBlogId=${data.blogID}`);
      }
      else {
        Alert.alert("Error", "Could not post blog")
      }
    });
  };

  // Render Item
  const renderGroupItem = useCallback(
    ({ item }: { item: Group }) => (
      <GroupDropdownComponent
        groupData={item}
        onPress={(data) => {
          setChosenGroup(data.groupData);
          setIsUserMember(!data.groupData.IsAdminOrOwner);

          let chosenGroupTagsString: string[] = [];
          data.groupData.Tags.forEach((t) => {
            chosenGroupTagsString.push(t.TagName);
          });
          setChosenGroupTags(chosenGroupTagsString);
          dispatch(setCreateBlogCurrentTags(chosenGroupTagsString));

          handleGroupSnapClose();
        }}
      />
    ),
    []
  );
  const onPressTag = (listTags: GroupTag[]) => {
    console.log("List tags selected:", listTags);
    setChosenTags(listTags);
  };
  const handleCreateGroup = () => {
    // Handle create group logic here
    console.log("Create Group Pressed");
  };
  const renderGroupFooter = useCallback((props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter {...props} style={styles.searchBar}>
        <TextInput
          onChangeText={handleGroupSearchTextChange}
          style={styles.searchText}
          placeholder="Search Groups"
          placeholderTextColor="#888"
          onSubmitEditing={handleGroupSearchSubmit}
        />
        <TouchableOpacity onPress={handleGroupSearchSubmit}>
          <FontAwesome
            name="search"
            size={24}
            color="#fff"
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      </BottomSheetFooter>
    );
  }, []);
  const renderTagsFooter = useCallback((props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter {...props} style={styles.searchBar}>
        <TextInput
          style={styles.searchText}
          placeholder="Search Tags"
          placeholderTextColor="#888"
        />
        <FontAwesome
          name="search"
          size={24}
          color="#fff"
          style={{ paddingRight: 10 }}
        />
      </BottomSheetFooter>
    );
  }, []);
  // TODO: Check user role in selected group
  // if user is admin/owner, don't allow to create tags
  // if user is member, allow to create tags
  const [isUserMember, setIsUserMember] = useState(true);
  // Call backs for requested tags data
  const [requestedTags, setRequestedTags] = useState<GroupTag[]>([]);
  const handleRequestedTag = (tags: GroupTag[]) => {
    setRequestedTags(tags);
  };
  const handleRequestedTagPress = (fieldID: string) => {
    route.push(
      `/request-tag-screen?fieldID=${fieldID}&groupID=${
        groupID ?? chosenGroup?._id
      }&currentTagCount=${createBlogTagCount}`
    );
  };
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
                    <TagWrapper key={tag._id} tag={tag} />
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
            {/* Request tags component */}
            {isUserMember &&
              chosenGroup?.Name !== "Private" &&
              chosenGroup?.Name !== "Only in my profile" &&
              chosenGroup !== undefined && (
                <View style={{ flex: 1, marginTop: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.heading,
                      {
                        justifyContent: "flex-start",
                      },
                    ]}
                    onPress={() => {
                      handleRequestedTagPress(
                        (chosenGroup as Group)?.FieldID ??
                          (chosenGroup as GroupDetailInfo).Field?._id!
                      );
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                    // style={[
                    //   styles.tagsColumn,
                    //   {
                    //     flexDirection: createBlogRequestedTags.length > 0 ? "row" : "column",
                    //     flexWrap: createBlogRequestedTags.length > 0 ? "wrap" : "nowrap",
                    //   },
                    // ]}
                    >
                      {createBlogRequestedTags.length > 0 &&
                        createBlogRequestedTags.map((tag) => (
                          <TagWrapper key={tag._id} tag={tag} />
                        ))}

                      <AntDesign
                        name="pluscircleo"
                        size={24}
                        color="#B9FF66"
                        style={{}}
                      />
                      {requestedTags.length > 0 ? (
                        requestedTags.map((tag) => (
                          <TagWrapper key={tag._id} tag={tag} />
                        ))
                      ) : (
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.headingTitle,
                              {
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "justify",
                              },
                            ]}
                          >
                            Request new Tags
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
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
              maxLength={150}
            />
            <Text
              style={{
                color: "#A2B5A5",
                alignSelf: "flex-end",
                marginRight: 10,
              }}
            >
              {titleText.length}/150
            </Text>
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
              maxLength={250}
            />
            <Text
              style={{
                color: "#A2B5A5",
                alignSelf: "flex-end",
                marginRight: 10,
              }}
            >
              {descriptionText.length}/250
            </Text>
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
          <View style={{ flex: 1, width: "100%" }}>
            {/* QuillJS Here */}
            <QuillEditor
              dom={{ matchContents: true }}
              onValueChange={handleContentTextChange}
              VITE_CLOUDINARY_CLOUD_NAME={VITE_CLOUDINARY_CLOUD_NAME}
              VITE_CLOUDINARY_PRESET={VITE_CLOUDINARY_PRESET}
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
        {/* <TouchableOpacity
          onPress={handleCreateGroup}
          style={styles.createGroupButton}
          activeOpacity={0.8}
        >
          <Text style={styles.createGroupButtonText}>Create New Group</Text>
        </TouchableOpacity> */}
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
        <BlogTagDropdownComponent tags={foundTags} onPress={onPressTag} />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
function TagWrapper({ tag }: { tag: GroupTag }) {
  return (
    <View style={styles.tagWrapper}>
      <Text style={styles.tag}># {tag.TagName}</Text>
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
    flex: 1,
  },
});
