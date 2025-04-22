import { useRef, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
  BottomSheetBackdrop
} from "@gorhom/bottom-sheet";
import GroupDropdownComponent from "@/components/blog/GroupDropdownComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Feather, FontAwesome } from "@expo/vector-icons";
import UploadThumbnailComponent from "@/components/blog/UploadThumbnailComponent";
import QuillEditor from "@/components/dom-components/QuillEditor.tsx/QuillEditor";
import ButtonGradient from "@/components/ButtonGradient";
import TagDropdownComponent from "@/components/blog/TagDropdownListComponent";
const mockGroup = {
  name: "Group's name",
  avatar: "https://picsum.photos/300",
  id: "123",
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
export default function NewBlog() {
  const [chosenGroup, setChosenGroup] = useState("");
  const [chosenTags, setChosenTags] = useState<string[]>([]);
  // Bottom Sheet Refs
  const groupSheetRef = useRef<BottomSheet>(null);
  const tagsSheetRef = useRef<BottomSheet>(null);
  // Variables
  const groupSnapPoints = useMemo(() => ["50%", "90%"], []);
  const tagsSnapPoints = useMemo(() => ["50%", "90%"], []);
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

  const handleTagsSnapPress = useCallback((index: number) => {
    tagsSheetRef.current?.snapToIndex(index);
  }, []);
  const handleTagsSnapClose = useCallback(() => {
    tagsSheetRef.current?.close();
  }, []);
  const handleTagsSheetChange = useCallback((index: any) => {
    console.log("handleTagsSheetChange", index);
  }, []);
  // Render Item
  const renderGroupItem = useCallback(
    ({ item }: { item: typeof mockGroup }) => (
      <GroupDropdownComponent
        avatar={item.avatar}
        name={item.name}
        id={item.id}
        onPress={(data) => {
          console.log("Group selected:", data.name);
          setChosenGroup(data.name);
          handleGroupSnapClose();
        }}
      />
    ),
    []
  );
  const onPressTag = useCallback(
    (listTags: string[]) => {
      console.log("List tags selected:", listTags);
      setChosenTags(listTags);
    },
    [chosenTags]
  );
  const handleCreateGroup = () => {
    // Handle create group logic here
    console.log("Create Group Pressed");
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
              style={styles.heading}
              onPress={() => handleGroupSnapPress(0)}
              activeOpacity={0.8}
            >
              <FontAwesome name="group" size={24} color="#fff" />

              <Text style={styles.headingTitle}>
                {chosenGroup === "" ? "Select Group To Post" : chosenGroup}
              </Text>
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
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.heading]}
              onPress={() => handleTagsSnapPress(0)}
              activeOpacity={0.8}
            >
              <Feather name="flag" size={24} color="#fff" />

              <View style={styles.tagsColumn}>
                {chosenTags.length > 0 ? (
                  chosenTags.map((tag) => <TagWrapper key={tag} tag={tag} />)
                ) : (
                  <Text style={styles.headingTitle}>Select Tags for blog</Text>
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
              <UploadThumbnailComponent />
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
            <QuillEditor dom={{ matchContents: true }} />
          </View>
        </View>
        {/* Post button */}
        <ButtonGradient
          label="POST BLOG"
          onPress={() => {}}
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
      >
        <TouchableOpacity
          onPress={handleCreateGroup}
          style={styles.createGroupButton}
          activeOpacity={0.8}
        >
          <Text style={styles.createGroupButtonText}>Create New Group</Text>
        </TouchableOpacity>
        <BottomSheetFlatList
          data={mockGroupList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.groupListContent}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
        />
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
      >
        <BottomSheetView>
          <TagDropdownComponent tags={mockTags} onPress={onPressTag} />
        </BottomSheetView>
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
    borderRadius: 25,
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
    borderRadius: 90,
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
    gap: 8,
    alignItems: "center",
  },
});
