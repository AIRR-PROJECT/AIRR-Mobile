import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image, ImageSource } from "expo-image";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import UploadGroupAvatarComponent from "@/components/group/UploadGroupAvatarComponent";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  createGroup,
  searchFields,
  setCreateGroupCreatedTags,
  setCreateGroupCurrentTags,
  setCreateGroupSubmitted,
} from "@/redux/slices/groupSlice";
import {
  GroupRule,
  GroupTag,
  SearchedField,
  SearchFieldResult,
} from "@/interfaces/groupInterface";
import { router, useRootNavigationState, useRouter } from "expo-router";
import BlogTagDropdownComponent from "@/components/blog/BlogTagDropdownListComponent";
import { setCreateBlogRequestedTags } from "@/redux/slices/blogSlice";
import GroupTagDropdownComponent from "@/components/blog/GroupTagDropdownListComponent";
const avatar_arc = require("@/assets/images/group/avatar_arc_group_props.png");

export default function CreateGroup() {
  const dispatch = useAppDispatch();
  const route = useRouter();
  const { routes } = useRootNavigationState();
  const {
    createGroupSubmitted,
    createGroupCurrentTags,
    createGroupCreatedTags,
  } = useAppSelector((state) => state.group);

  const uploadedImg = useRef<ImageSource>();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupRules, setGroupRules] = useState<GroupRule[]>();
  const [groupField, setGroupField] = useState<SearchedField>();
  const [groupFields, setGroupFields] = useState<SearchedField[]>([]);
  const [groupTags, setGroupTags] = useState<GroupTag[]>([]);
  const [chosenTags, setChosenTags] = useState<GroupTag[]>([]);
  const fieldSearchText = useRef("");
  const fieldRef = useRef<BottomSheet>(null);
  const fieldSnapPoints = useMemo(() => ["100%"], []);

  const tagsSheetRef = useRef<BottomSheet>(null);
  const tagsSnapPoints = useMemo(() => ["50%", "90%"], []);

  useEffect(() => {
    dispatch(searchFields("Development")).then((res) => {
      setGroupFields((res.payload as SearchFieldResult).Fields);
      console.log((res.payload as SearchFieldResult).Fields);
    });

    dispatch(setCreateGroupCurrentTags([]));
    dispatch(setCreateGroupCreatedTags([]));
  }, []);

  useEffect(() => {
    console.log(groupFields);
  }, [groupFields]);

  useEffect(() => {
    console.log(groupRules);
  }, [groupRules]);

  useEffect(() => {
    let currentTagsString: string[] = [];
    chosenTags.forEach((t) => {
      currentTagsString.push(t.TagName);
    });
    dispatch(setCreateGroupCurrentTags(currentTagsString));
  }, [chosenTags]);

  useEffect(() => {
    if (createGroupSubmitted) {
      dispatch(setCreateGroupSubmitted(false));

      if (
        !uploadedImg.current ||
        !groupName ||
        (chosenTags.length == 0 && createGroupCreatedTags.length == 0) ||
        !groupField ||
        !groupDescription ||
        !groupRules
      ) {
        Alert.alert("Error", "Missing field");

        return;
      }

      if (groupName.length < 10) {
        Alert.alert("Error", "Name must be at least 10 characters long");
        return;
      }
      if (groupDescription.length < 10) {
        Alert.alert("Error", "Description must be at least 10 characters long");
        return;
      }
      let isGroupRuleLengthViolated = false;
      groupRules.forEach((r) => {
        if (r.RuleDescription.length < 10) isGroupRuleLengthViolated = true;
      });
      if (isGroupRuleLengthViolated) {
        Alert.alert(
          "Error",
          "Rule description must be at least 10 characters long"
        );
        return;
      }

      const formData = new FormData();
      formData.append("coverImage", {
        uri: uploadedImg.current?.uri,
        name: uploadedImg.current?.fileName,
        type: uploadedImg.current?.mimeType,
      });
      formData.append("Name", groupName);
      formData.append(
        "Tags",
        JSON.stringify([...chosenTags, ...createGroupCreatedTags])
      );
      formData.append("GroupField", JSON.stringify(groupField));
      formData.append("Description", groupDescription);
      formData.append("GroupRules", JSON.stringify(groupRules));

      dispatch(createGroup(formData)).then((res) => {
        const data = res.payload as string;
        console.log(`res.payload: ${data}`);
        console.log(`data.length != 0: ${data.length != 0}`);
        if (data.length != 0) {
          // router.back()
          // router.setParams({
          //   newGroupID: data
          // })
          router.replace(`/(tabs)/group-list/(my-group)?newGroupID=${data}`);
          // router.push(`/group?groupId=${res.payload}`)
        }
      });
    }
  }, [createGroupSubmitted]);
  const searchInputRef = useRef<TextInput>(null);
  const handleFieldSnapPress = useCallback((index: number) => {
    fieldRef.current?.snapToIndex(index);
  }, []);
  const handleFieldSearchChangeText = (val: string) => {
    fieldSearchText.current = val;
    handleFieldSearchSubmit();
  };
  const handleFieldSearchSubmit = () => {
    dispatch(searchFields(fieldSearchText.current)).then((res) => {
      setGroupFields((res.payload as SearchFieldResult).Fields);

      searchInputRef.current?.focus();
    });
  };
  const handleFieldSheetChange = useCallback((index: any) => {
    console.log("handleGroupSheetChange", index);
  }, []);
  const handleGroupFieldPress = useCallback((field: SearchedField) => {
    console.log("Group field: ", field.FieldName);
    setGroupField(field);
    setChosenTags([]);

    setGroupTags(field.DefaultTags);
    dispatch(setCreateGroupCreatedTags([]));

    fieldRef.current?.close();
  }, []);
  const handleTagsSnapPress = useCallback((index: number) => {
    tagsSheetRef.current?.snapToIndex(index);
  }, []);

  const onPressTag = (listTags: GroupTag[]) => {
    console.log("List tags selected:", listTags);
    setChosenTags(listTags);
  };
  const handleCreateTagPress = () => {
    route.push(`/create-tag-screen?fieldID=${groupField?._id}`);
  };
  const handleAddNewRulePress = () => {
    setGroupRules((prevRules) => {
      const newRule: GroupRule = {
        // _id: `rule${prevRules ? prevRules.length + 1 : 1}`,
        _id: "",
        RuleName: "",
        RuleDescription: "",
      };
      return [...(prevRules || []), newRule];
    });
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Image
          source={avatar_arc}
          style={styles.image}
          contentFit="contain"
          transition={1000}
        />
        <View style={[styles.rowContainer, { marginBottom: 10 }]}>
          <MaterialCommunityIcons
            name="note-plus-outline"
            size={24}
            color="#B9FF66"
          />
          <Text style={[styles.title, { paddingLeft: 5 }]}>
            Create a New Group
          </Text>
        </View>
        {/* description */}
        <Text style={styles.description}>
          Innovation thrives in collaboration. Create a new group and connect
          with like-minded tech enthusiasts to shape the future together
        </Text>
        {/* Group avatar */}
        <Text
          style={[styles.title, { alignSelf: "flex-start", paddingBottom: 10 }]}
        >
          Group Avatar
        </Text>
        <UploadGroupAvatarComponent
          onSetImg={(imgSource) => {
            uploadedImg.current = imgSource;
          }}
        />

        {/* Group Name Input + Character Counter */}
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.smallTitle, { paddingBottom: 10 }]}>
            Group Name
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={(text) => {
                if (text.length <= 30) {
                  setGroupName(text);
                  // handleGroupNameTextChange(text)
                }
              }}
              placeholder="Enter Group Name *"
              placeholderTextColor="#888"
            />
            <Text style={styles.counter}>{groupName.length}/30</Text>
          </View>
        </View>
        {/* Select Group Field */}

        <View>
          <Text style={[styles.smallTitle, { paddingBottom: 10 }]}>
            Group Field and Tags
          </Text>
          {/* Field */}
          <TouchableOpacity
            onPress={() => handleFieldSnapPress(0)}
            activeOpacity={0.8}
            style={styles.heading}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: groupField ? "#fff" : "#888",
                },
              ]}
            >
              {!groupField ? "Select Group's Field *" : groupField.FieldName}
            </Text>
            {!groupField ? null : (
              <IconSymbol
                name="chevron.right"
                size={24}
                weight="medium"
                color={"#fff"}
                style={{ marginRight: 20 }}
              />
            )}
          </TouchableOpacity>
          {/* Tags */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.heading,
                {
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  padding: 20,
                  gap: 10,
                },
              ]}
              onPress={() => handleTagsSnapPress(0)}
            >
              <Feather name="flag" size={24} color="#fff" />
              {chosenTags.length > 0 && groupField !== undefined ? (
                chosenTags.map((tag) => (
                  <TagWrapper key={tag._id} tag={tag.TagName} />
                ))
              ) : (
                <Text
                  style={[
                    styles.headingTitle,
                    {
                      alignSelf: "center",
                      color: "#fff",
                      textAlign: "justify",
                      marginLeft: 5,
                    },
                  ]}
                >
                  Select Tags for group
                </Text>
              )}
            </TouchableOpacity>
            {groupField && (
              <TouchableOpacity
                style={[
                  styles.heading,
                  {
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    padding: 20,
                    gap: 10,
                  },
                ]}
                onPress={handleCreateTagPress}
                activeOpacity={0.8}
              >
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color="#B9FF66"
                  style={{}}
                />
                {createGroupCreatedTags.length > 0 ? (
                  createGroupCreatedTags.map((tag) => (
                    // TODO: Check the API for the what should the _id be before request it
                    <TagWrapper key={tag._id} tag={tag.TagName} />
                  ))
                ) : (
                  <View style={{}}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          paddingLeft: 10,
                          paddingVertical: 0,
                        },
                      ]}
                    >
                      Create New Tags
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Group Description Input + Character Counter */}
        <View style={styles.inputWrapper}>
          <Text style={[styles.smallTitle, { paddingBottom: 10 }]}>
            Group Description
          </Text>
          <TextInput
            style={[styles.multilineInput]}
            value={groupDescription}
            onChangeText={(text) => {
              if (text.length <= 250) {
                setGroupDescription(text);
                // handleGroupDescriptionTextChange(text);
              }
            }}
            multiline={true}
            placeholder="Enter Group Description *"
            placeholderTextColor="#888"
          />
          <Text style={styles.counter}>{groupDescription.length}/250</Text>
        </View>
        {/* Group Rules Input + Character Counter */}
        <View style={[styles.inputWrapper, { marginBottom: 40 }]}>
          <Text style={[styles.smallTitle, { paddingBottom: 10 }]}>
            Group Rules
          </Text>
          {/* Rules Container */}

          {groupRules?.map((rule, index) => (
            <View key={index} style={styles.ruleOuterContainer}>
              <View
                style={[
                  styles.rowContainer,
                  { justifyContent: "space-between", marginBottom: 20 },
                ]}
              >
                <Text
                  style={[
                    styles.headingTitle,
                    {
                      color: "#B9FF66",
                      fontSize: 16,
                    },
                  ]}
                >
                  Rule {index + 1}
                </Text>
                {/* Delete button */}
                <TouchableOpacity
                  onPress={() => {
                    setGroupRules((prevRules) =>
                      prevRules?.filter((_, i) => i !== index)
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <AntDesign name="delete" size={24} color="#B9FF66" />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: "transparent",
                    padding: 0,
                  },
                ]}
              >
                {/* Rule name */}
                <View style={styles.ruleContainer}>
                  {/* Input for rule name */}
                  <TextInput
                    style={styles.ruleText}
                    placeholder="Enter rule name..."
                    placeholderTextColor="#B0B0B0"
                    onChangeText={(text) => {
                      let groupRulesClone = JSON.parse(
                        JSON.stringify(groupRules)
                      ) as GroupRule[];
                      groupRulesClone[index].RuleName = text;
                      setGroupRules(groupRulesClone);
                    }}
                    multiline
                  />
                </View>
                {/* Rule description */}
                <View style={styles.ruleContainer}>
                  {/* Input for rule description */}
                  <TextInput
                    style={styles.ruleText}
                    placeholder="Enter rule description..."
                    placeholderTextColor="#B0B0B0"
                    onChangeText={(text) => {
                      let groupRulesClone = JSON.parse(
                        JSON.stringify(groupRules)
                      ) as GroupRule[];
                      groupRulesClone[index].RuleDescription = text;
                      setGroupRules(groupRulesClone);
                    }}
                    multiline
                  />
                </View>
                {/* Add more rules as needed */}
              </View>
            </View>
          ))}

          {/* New Rule button */}
          <TouchableOpacity
            style={[
              styles.heading,
              {
                backgroundColor: "#fff",
              },
            ]}
            onPress={handleAddNewRulePress}
            activeOpacity={0.8}
          >
            <AntDesign
              name="pluscircleo"
              size={24}
              color="#000"
              style={{ paddingLeft: 40 }}
            />
            <Text
              style={[styles.buttonText, { paddingLeft: 10, color: "#000" }]}
            >
              New Rule
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Group Selection Bottom Sheet */}
      <BottomSheet
        ref={fieldRef}
        index={-1} // Start closed
        snapPoints={fieldSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#212531" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        onChange={handleFieldSheetChange}
        maxDynamicContentSize={700}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        footerComponent={() => <View style={{ height: 40 }} />}
      >
        <View style={styles.searchBar}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchText}
            placeholder="Search Fields"
            placeholderTextColor="#888"
            numberOfLines={1}
            onChangeText={handleFieldSearchChangeText}
            onSubmitEditing={handleFieldSearchSubmit}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleFieldSearchSubmit}
          >
            <FontAwesome
              name="search"
              size={24}
              color="#fff"
              style={{ paddingRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView
          contentContainerStyle={styles.groupListContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          nestedScrollEnabled={true}
        >
          {/* Group List */}
          {/* Change to actual field later */}

          {groupFields.length != 0 &&
            groupFields.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleGroupFieldPress(item)}
                style={styles.heading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: "#fff",
                      borderWidth: 1,
                      borderColor: "#B9FF66",
                      borderRadius: 20,
                      paddingHorizontal: 15,
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.FieldName}
                </Text>
              </Pressable>
            ))}
          {groupFields.length == 0 && (
            <View style={styles.heading}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: "#fff",
                    borderWidth: 1,
                    borderColor: "red",
                    borderRadius: 20,
                    paddingHorizontal: 15,
                  },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                No fields found.
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
      <BottomSheet
        ref={tagsSheetRef}
        index={-1} // Start closed
        snapPoints={tagsSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#212531" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        // onChange={handleGroupSheetChange}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <GroupTagDropdownComponent tags={groupTags} onPress={onPressTag} />
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
    padding: 20,
    backgroundColor: "#1E1E1E",
  },

  contentContainer: {
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  smallTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 40,
    backgroundColor: "#212531",
    color: "#fff",
  },
  multilineInput: {
    height: 100,
    borderColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 12,
    backgroundColor: "#212531",
    textAlignVertical: "top",
    color: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#888",
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 40,
    flex: 1,
  },
  description: {
    color: "#B7B7B7",
    textAlign: "justify",
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  counter: {
    position: "absolute",
    right: 20,
    bottom: 17,
    color: "#fff",
    fontSize: 12,
  },
  // remove later
  groupListContent: {
    padding: 16,
    backgroundColor: "#212531",
    paddingBottom: 60,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#212531",
    borderRadius: 20,
    marginBottom: 15,
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
  headingTitle: {
    fontSize: 16,
    color: "#fff",
  },
  ruleContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2E3B40",
  },
  ruleText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
  },
  ruleOuterContainer: {
    backgroundColor: "#212531",
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: "#2E3B40",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    paddingBottom: 20,
  },
  searchText: {
    paddingHorizontal: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});
