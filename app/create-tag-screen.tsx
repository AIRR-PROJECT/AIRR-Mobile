import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { set } from "lodash";
import { createTag } from "@/redux/slices/groupSlice";
import { GroupTag } from "@/interfaces/groupInterface";
const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
type AddTagsComponentProps = {
  isCreate?: boolean; // Optional prop to indicate if it's for creating a new tag
};
const mockTags: string[] = ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"];
export default function CreateTagsScreen({
  isCreate = false, // Default to false if not provided
}: AddTagsComponentProps) {
  // State to hold the new tag input by user
  const [newTagToCreate, setNewTag] = useState<string>("");

  // Const state to hold valid tag
  const [validTag, setValidTag] = useState<string | null>(null);

  // List of valid tags that user created/requested
  const [selectableTags, setSelectableTags] = useState<string[]>([]);

  // Created/Requested Tag that user can deselect
  const [createdTags, setCreatedTags] = useState<string[]>([]);

  const onChangeText = (text: string) => {
    setNewTag(text);
  };

  const handleCheckTag = async (tag: string) => {
    // Simulate API call to check tag validity
    if (tag.length > 0 && tag.length <= 20) {
      const isValid = await checkTagWithAPI(tag); // Replace with your API
      if (isValid) {
        setValidTag(tag);
      } else {
        setValidTag(null);
      }
    }
  };

  // Dummy API function for illustration
  async function checkTagWithAPI(tag: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return tag !== "taken";
  }
  selectableTags.push(...mockTags); // Add mock tags to selectableTags for testing
  const handleSubmit = () => {
    if (selectableTags.length > 0) {
      // Create a GroupTag object for each selected tag with incrementing _id
      // TODO: CHECK THE API FOR THE _ID HERE, I NOW JUST GENERATE A RANDOM ONE
      const newTags: GroupTag[] = createdTags.map((tag) => ({
        _id: Math.random().toString(36).substring(2, 15), // Generate a random _id
        TagName: tag,
      }));
      setNewTag("");
      setValidTag(null);
      setSelectableTags([]);
      //Go Back and send the new tags to thapp/request-tag-screen.tsxe parent component
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
          />
        </View>
        {/* Button to check if existing */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle tag checking logic here
            // For now, just call onPress with a dummy tag
            handleCheckTag(newTagToCreate);
          }}
        >
          <Text style={styles.buttonText}>Check existing</Text>
        </TouchableOpacity>
      </View>
      {/* Select tag to add or deselect */}
      <View style={[{ flex: 1, gap: 10, marginBottom: 10 }]}>
        <View style={styles.selectTagBox}>
          <Text style={styles.selectTagText}>
            Your Tag match, please select:
          </Text>
          <ScrollView
            style={styles.listTagsScrollView}
            contentContainerStyle={{}}
          >
            <View style={styles.tagsContainer}>
              {selectableTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectTagButton}
                  onPress={() => {
                    setSelectableTags((prev) => prev.filter((t) => t !== tag));
                  }}
                >
                  <Text style={styles.selectTagButtonText}>{tag}</Text>
                  <FontAwesome name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Create new Tag button */}

          <TouchableOpacity
            style={styles.createTagButton}
            onPress={() => {
              // Handle tag creation logic here
              if (validTag) {
                setSelectableTags((prev) => [...prev, validTag]);

                setValidTag(null);
                setNewTag("");
              }
            }}
            disabled={validTag === null}
          >
            <AntDesign name="pluscircle" size={24} color="#B9FF66" />
            <Text style={styles.selectTagText}>
              Create {validTag === null ? "new" : validTag} Tag
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deselectTagBox}>
          <ScrollView
            style={styles.listTagsScrollView}
            contentContainerStyle={{}}
          >
            <View style={styles.tagsContainer}>
              {selectableTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.deselectTagButton}
                  onPress={() => {
                    setSelectableTags((prev) => prev.filter((t) => t !== tag));
                  }}
                >
                  <Text style={styles.deselectTagButtonText}>{tag}</Text>
                  <FontAwesome name="times" size={20} color="#000" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Create new Tag button */}

          <TouchableOpacity
            style={styles.createTagButton}
            onPress={() => {
              // Handle tag creation logic here
              if (validTag) {
                setSelectableTags((prev) => [...prev, validTag]);

                setValidTag(null);
                setNewTag("");
              }
            }}
            disabled={validTag === null}
          >
            {/* If user create a new tag that already existing, makje this component appear */}
            {
              <Text style={styles.errorText}>
                This tag is already existing!
              </Text>
            }
          </TouchableOpacity>
        </View>
      </View>
      {/* Done button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { fontWeight: "bold" }]}>Finish</Text>
      </TouchableOpacity>
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
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
    gap: 5,
  },
  selectTagText: {
    color: "#000",
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
    gap: 5,
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
  },
});
