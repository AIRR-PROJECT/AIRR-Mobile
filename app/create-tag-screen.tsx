import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  ToastAndroid,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { createTag, searchTagCreateGroup, setCreateGroupCreatedTags } from "@/redux/slices/groupSlice";
import { CreateGroupTag, GroupTag } from "@/interfaces/groupInterface";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { searchTagCreateBlog, setCreateBlogRequestedTags } from "@/redux/slices/blogSlice";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
type AddTagsComponentProps = {
  isCreate?: boolean; // Optional prop to indicate if it's for creating a new tag
};
const mockTags: string[] = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"];
export default function CreateTagsScreen({
  isCreate = false, // Default to false if not provided
}: AddTagsComponentProps) {
  const dispatch = useAppDispatch()
  const { fieldID } = useLocalSearchParams<{ fieldID: string }>()
  const { createGroupCurrentTags, createGroupCreatedTags } = useAppSelector(state => state.group)

  // State to hold the new tag input by user
  const [newTagToRequest, setNewTag] = useState<string>("");

  // Const state to hold valid tag
  const [validTag, setValidTag] = useState<string | null>(null);

  // List of valid tags that user created/requested
  const [selectableTags, setSelectableTags] = useState<CreateGroupTag[]>([]);

  // Created/Requested Tag that user can deselect
  const [createdTags, setCreatedTags] = useState<CreateGroupTag[]>(createGroupCreatedTags);

  // Error if the tag selected already chosen for the blog
  const [showError, setShowError] = useState(false)

  const onChangeText = (text: string) => {
    setNewTag(text);
  };

  const handleCheckTag = async (tag: string) => {
    setShowError(false)
    console.log(fieldID)
    // Simulate API call to check tag validity
    if (tag.length > 0 && tag.length <= 20) {
      dispatch(searchTagCreateGroup({ keyword: tag, fieldID: fieldID })).then((res) => {
        const tags = res.payload as CreateGroupTag[]
        setSelectableTags(tags)

        const isValid = checkTagValidity(tag, tags)

        if (isValid) {
          setValidTag(tag);
          setShowError(false)
        } else {
          setValidTag(null);
          setShowError(true)
        }
      })
      // const isValid = await checkTagWithAPI(tag); // Replace with your API
      // if (isValid) {
      //   setValidTag(tag);
      // } else {
      //   setValidTag(null);
      // }
    }
  };

  // Dummy API function for illustration
  function checkTagValidity(tag: string, foundTags: CreateGroupTag[]): boolean {
    if (foundTags.length == 0) return true

    for (let foundTag of foundTags) {
      if (tag == foundTag.TagName) return false
    }

    return true
  }
  // selectableTags.push(...mockTags); // Add mock tags to selectableTags for testing
  const handleSubmit = () => {
    if (createdTags.length > 0) {
      // Create a GroupTag object for each selected tag with incrementing _id
      // TODO: CHECK THE API FOR THE _ID HERE, I NOW JUST GENERATE A RANDOM ONE
      const newTags: CreateGroupTag[] = createdTags.map((tag) => ({
        _id: tag._id ?? "", // Generate a random _id
        TagName: tag.TagName,
        OperationType: tag.OperationType
      }));
      setNewTag("");
      setValidTag(null);
      setSelectableTags([]);
      //Go Back and send the new tags to the parent component
      dispatch(setCreateGroupCreatedTags(newTags))
      router.back()
    }
    else {
      setNewTag("");
      setValidTag(null);
      setSelectableTags([]);
      //Go Back and send the new tags to the parent component
      dispatch(setCreateGroupCreatedTags([]))
      router.back()
    }
  };

  return (
    <View style={styles.contentContainer}>
      <View style={styles.rowContainer}>
        {/* Enter tag name and check if existing tag */}
        {/* Text box to enter tag name */}
        <View style={styles.searchBar}>
          <FontAwesome
            name="search"
            size={24}
            color="#fff"
            style={{ paddingLeft: 10 }}
          />
          <TextInput
            style={styles.searchText}
            placeholder="Enter new tag name"
            placeholderTextColor="#888"
            maxLength={20}
            onChange={(e) => onChangeText(e.nativeEvent.text)}
            numberOfLines={1}
          />
        </View>
        {/* Button to check if existing */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle tag checking logic here
            // For now, just call onPress with a dummy tag
            handleCheckTag(newTagToRequest);
          }}
        >
          <Text style={styles.buttonText}>Check existing</Text>
        </TouchableOpacity>
      </View>
      {/* Select tag to add or deselect */}
      <View style={[{flex: 1, gap: 10, marginBottom: 10},]}>
        <View style={styles.selectTagBox}>
          <Text style={styles.selectTagText}>
            Your Tag match, please select:
          </Text>
          <ScrollView
            style={styles.listTagsScrollView}
            contentContainerStyle={{}}
          >
            <View style={styles.tagsContainer}>
              {selectableTags.length != 0 && selectableTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectTagButton}
                  onPress={() => {
                    if (!createGroupCurrentTags.includes(tag.TagName) && !createdTags.find((t) => t.TagName == tag.TagName)) {
                      setSelectableTags((prev) => prev.filter((t) => t._id !== tag._id));
                      setCreatedTags(() => [tag, ...createdTags])
                      setShowError(false)
                    }
                    else {
                      setShowError(true)
                    }
                  }}
                >
                  <Text style={styles.selectTagButtonText}>{tag.TagName}</Text>
                  <FontAwesome name="plus" size={20} color="#fff" />
                  
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Create new Tag button */}

          <TouchableOpacity
            style={styles.createTagButton}
            onPress={() => {
              // Length check
              if (validTag && validTag.length < 3) {
                ToastAndroid.show("Tag name must be at least 3 characters long", ToastAndroid.SHORT)
                return
              }
              // Handle tag creation logic here
              if (validTag && !createdTags.find((t) => t.TagName == validTag)) {
                setCreatedTags((prev) => [...prev, { _id: Math.random().toString(36).substring(2, 15), TagName: validTag, OperationType: "new-tag"}])

                setValidTag(null);
                setNewTag("");
                setShowError(false)
              }
              else {
                setShowError(true)
              }
            }}
            disabled={validTag === null}
          >
            <AntDesign name="pluscircle" size={24} color={validTag ? "#B9FF66" : "grey"} />
            <Text style={validTag ? styles.selectTagText : styles.selectTagTextDisabled}>
              Create {validTag === null ? "new" : validTag} Tag
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deselectTagBox}>
          <Text style={styles.deselectTagText}>
            Requested Tags:
          </Text>
          <ScrollView
            style={styles.listTagsScrollView}
            contentContainerStyle={{}}
          >
            <View style={styles.tagsContainer}>
              {createdTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.deselectTagButton}
                  onPress={() => {
                    setCreatedTags((prev) => prev.filter((t) => t._id !== tag._id));
                  }}
                >
                  <Text style={styles.deselectTagButtonText}>{tag.TagName}</Text>
                  <FontAwesome name="times" size={20} color="#000" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Create new Tag button */}

          {/* If user create a new tag that already existing, makje this component appear */}
          {showError && <Text style={styles.errorText}>
            This tag is already existing!
          </Text>}
        </View>
      </View>
      {/* Done button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { fontWeight: "bold" }]}>Finish</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={createdTags.length != 0 ? styles.button : styles.buttonDisabled} disabled={createdTags.length == 0} onPress={handleSubmit}>
        <Text style={createdTags.length != 0 ? [styles.buttonText, { fontWeight: "bold" }] : [styles.buttonDisabledText, { fontWeight: "bold" }]}>Finish</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  button: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonDisabledText: {
    color: "#fff",
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  searchText: {
    paddingHorizontal: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#2E3B40",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  selectTagBox: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  selectTagButton: {
    backgroundColor: "#2E3B40",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5
  },
  selectTagText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  selectTagTextDisabled: {
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  selectTagButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deselectTagBox: {
    backgroundColor: "#2E3B40",
    flex: 1,
    padding: 10,
    borderRadius: 20,
  },
  deselectTagButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 5
  },
  deselectTagText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  deselectTagButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  listTagsScrollView: {
    marginVertical: 10,
    padding: 10,
    maxHeight: height * 0.7,
  },
  listTagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    flexGrow: 1,
  },
  createTagButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  errorText: {
    color: "#FF6666",
    fontSize: 16,
  }
});
