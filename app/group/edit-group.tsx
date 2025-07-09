import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Image, ImageSource } from "expo-image";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import UploadGroupAvatarComponent from "@/components/group/UploadGroupAvatarComponent";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  createGroup,
  searchFields,
  setCreateGroupCurrentTags,
  setCreateGroupSubmitted,
} from "@/redux/slices/groupSlice";
import {
  GroupRule,
  GroupTag,
  SearchedField,
  SearchFieldResult,
} from "@/interfaces/groupInterface";
import { router, useRouter } from "expo-router";
import GroupRuleComponent from "@/components/group/GroupRuleComponent";
import { set } from "lodash";
const avatar_arc = require("@/assets/images/group/avatar_arc_group_props.png");

// temporary use this cause figma not provide the image
const mockFieldList = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Cyber Security",
  "DevOps",
  "Blockchain",
  "Internet of Things",
  "Game Development",
  "UI/UX Design",
  "Digital Marketing",
];

export default function EditGroup() {
  const dispatch = useAppDispatch();
  const { createGroupSubmitted, createGroupCurrentTags, createGroupCreatedTags } = useAppSelector((state) => state.group);

  const uploadedImg = useRef<ImageSource>();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupRules, setGroupRules] = useState<GroupRule[]>();
  const [groupField, setGroupField] = useState<SearchedField>();
  const [groupFields, setGroupFields] = useState<SearchedField[]>([]);
  const [groupTags, setGroupTags] = useState<GroupTag[]>([]);
  const fieldRef = useRef<BottomSheet>(null);
  const fieldSnapPoints = useMemo(() => ["100%"], []);

  useEffect(() => {
    dispatch(searchFields("Development")).then((res) => {
      setGroupFields((res.payload as SearchFieldResult).Fields);
      console.log((res.payload as SearchFieldResult).Fields);
    });
  }, []);

  useEffect(() => {
    console.log(groupFields);
  }, [groupFields]);

  useEffect(() => {
    console.log(groupRules)
  }, [groupRules])

  useEffect(() => {
    if (createGroupSubmitted) {
      dispatch(setCreateGroupSubmitted(false));

      if (
        !uploadedImg.current ||
        !groupName ||
        !groupTags ||
        !groupField ||
        !groupDescription ||
        !groupRules
      ) {
        Alert.alert("Error", "Missing field");

        return;
      }

      const formData = new FormData();
      formData.append("coverImage", {
        uri: uploadedImg.current?.uri,
        name: uploadedImg.current?.fileName,
        type: uploadedImg.current?.mimeType,
      });
      formData.append("Name", groupName);
      formData.append("Tags", JSON.stringify([...groupTags, ...createGroupCreatedTags]));
      formData.append("GroupField", JSON.stringify(groupField));
      formData.append("Description", groupDescription);
      formData.append("GroupRules", JSON.stringify(groupRules));

      dispatch(createGroup(formData)).then((res) => {
        if ((res.payload as boolean) == true) {
          router.dismiss();
        }
      });
    }
  }, [createGroupSubmitted]);

  const handleFieldSnapPress = useCallback((index: number) => {
    fieldRef.current?.snapToIndex(index);
  }, []);
  const handleFieldSheetChange = useCallback((index: any) => {
    console.log("handleGroupSheetChange", index);
  }, []);
  const handleGroupFieldPress = useCallback((field: SearchedField) => {
    console.log("Group field: ", field.FieldName);
    setGroupField(field);

    setGroupTags(field.DefaultTags);
    let currentTagsString: string[] = []
    field.DefaultTags.forEach((t) => {
      currentTagsString.push(t.TagName)
    })
    dispatch(setCreateGroupCurrentTags(currentTagsString))

    fieldRef.current?.close();
  }, []);
  const [createdTags, setCreatedTags] = useState<GroupTag[]>([]);
  const route = useRouter();
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
            <View
              style={[
                styles.heading,
                {
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                },
              ]}
            >
              {groupTags.length > 0 &&
                groupTags.map((tag) => (
                  <TagWrapper key={tag._id} tag={tag.TagName} />
                ))
              }
            </View>
            {groupField && <TouchableOpacity
              style={[
                styles.heading,
                {
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                },
              ]}
              onPress={handleCreateTagPress}
              activeOpacity={0.8}
            >
              <AntDesign
                name="pluscircleo"
                size={24}
                color="#B9FF66"
                style={{
                  paddingLeft: 40,
                }}
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
                      },
                    ]}
                  >
                    Create New Tags
                  </Text>
                </View>
              )}
            </TouchableOpacity>}
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
                      let groupRulesClone = JSON.parse(JSON.stringify(groupRules)) as GroupRule[]
                      groupRulesClone[index].RuleName = text
                      setGroupRules(groupRulesClone)
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
                      let groupRulesClone = JSON.parse(JSON.stringify(groupRules)) as GroupRule[]
                      groupRulesClone[index].RuleDescription = text
                      setGroupRules(groupRulesClone)
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
        >
          {/* 
              try to use something that can store the list of field
              and use it to render the list of field
              we can store it in redux as group field list is static
              (? ask the team if it is static or dynamic) 
              if dynamic, use api to get the list of field
              and use it to render the list of field with flatlist
              else use the static list of field to render the list of field
            */}
          <BottomSheetScrollView
            contentContainerStyle={styles.groupListContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled={true}
            style={{ flexGrow: 1 }}
          >
            {/* Group List */}
            {/* Change to actual field later */}

            {groupFields?.map((item, index) => (
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
          </BottomSheetScrollView>
        </BottomSheet>
      </ScrollView>
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
});
