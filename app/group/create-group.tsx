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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UploadGroupAvatarComponent from "@/components/group/UploadGroupAvatarComponent";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { searchFields, setCreateGroupSubmitted } from "@/redux/slices/groupSlice";
import { GroupRule, GroupTag, SearchedField, SearchFieldResult } from "@/interfaces/groupInterface";
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

export default function CreateGroup() {
  const dispatch = useAppDispatch();
  const { createGroupSubmitted } = useAppSelector(state => state.group);

  const uploadedImg = useRef<ImageSource>()
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupRules, setGroupRules] = useState("");
  const [groupField, setGroupField] = useState<SearchedField>();
  const [groupFields, setGroupFields] = useState<SearchedField[]>([])
  const [groupTags, setGroupTags] = useState<GroupTag[]>([])
  const fieldRef = useRef<BottomSheet>(null);
  const fieldSnapPoints = useMemo(() => ["30%", "50%"], []);

  useEffect(() => {
    dispatch(searchFields("Development")).then((res) => {
      setGroupFields((res.payload as SearchFieldResult).Fields)
      console.log((res.payload as SearchFieldResult).Fields)
    })
  }, [])

  useEffect(() => {
    console.log(groupFields)
  }, [groupFields])

  useEffect(() => {
    if (createGroupSubmitted) {
      dispatch(setCreateGroupSubmitted(false))

      if (!uploadedImg.current || !groupName || !groupTags || !groupField || !groupDescription || !groupRules) {
        Alert.alert("Error", "Missing field")
  
        return
      }

      const formData = new FormData()
      formData.append("coverImage", {
        uri: uploadedImg.current?.uri,
        name: uploadedImg.current?.fileName,
        type: uploadedImg.current?.mimeType
      })
      formData.append("Name", groupName)
      formData.append("Tags", JSON.stringify(groupTags))
      formData.append("GroupField", JSON.stringify(groupField))
      formData.append("Description", groupDescription)
      let rulesObject: GroupRule[] = [{
        _id: "rule1",
        RuleName: "Rule 1",
        RuleDescription: groupRules
      }]
      formData.append("GroupRules", JSON.stringify(rulesObject))
  
      // dispatch(createGroup(formData)).then((res) => {
      //   if (res.payload) {
      //     router.replace("/(tabs)/group-list/")
      //   }
      // })
    }
  }, [createGroupSubmitted])
  
  const handleFieldSnapPress = useCallback((index: number) => {
    fieldRef.current?.snapToIndex(index);
  }, []);
  const handleFieldSheetChange = useCallback((index: any) => {
    console.log("handleGroupSheetChange", index);
  }, []);
  const handleGroupFieldPress = useCallback((field: SearchedField) => {
    console.log("Group field: ", field.FieldName);
    setGroupField(field);
    setGroupTags(field.DefaultTags)
    fieldRef.current?.close();
  }, []);

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
        <UploadGroupAvatarComponent onSetImg={(imgSource) => {
          uploadedImg.current = imgSource
        }}/>
        {/* Group Detail */}
        <Text
          style={[
            styles.title,
            { alignSelf: "flex-start", paddingBottom: 10, paddingTop: 20 },
          ]}
        >
          Group Details
        </Text>
        {/* Group Name Input + Character Counter */}
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
        {/* Select Group Field */}

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
        {/* Group Description Input + Character Counter */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.multilineInput]}
            value={groupDescription}
            onChangeText={(text) => {
              if (text.length <= 100) {
                setGroupDescription(text);
                // handleGroupDescriptionTextChange(text);
              }
            }}
            multiline={true}
            placeholder="Enter Group Description *"
            placeholderTextColor="#888"
          />
          <Text style={styles.counter}>{groupDescription.length}/100</Text>
        </View>
        {/* Group Rules Input + Character Counter */}
        <View style={[styles.inputWrapper, { marginBottom: 40 }]}>
          <TextInput
            style={[styles.multilineInput]}
            value={groupRules}
            onChangeText={(text) => {
              if (text.length <= 100) {
                setGroupRules(text)
                // handleGroupRulesTextChange([{
                //   _id: "rule1",
                //   RuleName: "Rule #1",
                //   RuleDescription: text
                // }])  
              };
            }}
            multiline={true}
            placeholder="Enter Group Rules *"
            placeholderTextColor="#888"
          />
          <Text style={styles.counter}>{groupRules.length}/100</Text>
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
                <Text style={[styles.buttonText, { color: "#fff" }]}>
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
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    paddingLeft: 40,
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
});
