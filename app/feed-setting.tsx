import { memo, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, ToastAndroid, TouchableOpacity, Keyboard } from "react-native";
import { Divider } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import ButtonGradient from "../components/ButtonGradient";
import TabButton from "../components/tabs/feed/TabButton";
import { ThemedText } from "../components/ThemedText";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { saveTags, searchTags } from "@/redux/slices/feedSlice";
import { getUserInfo, getUserRelatedTags } from "@/redux/slices/authSlice";
import { SurveyTag, User } from "@/interfaces/userInterface";

let suggestedTags: SurveyTag[] = [];
let selectedTags: SurveyTag[] = [];
let originalSuggestedTags: SurveyTag[];
let originalSelectedTags: SurveyTag[];

function FeedSettingScreen() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [suggestedTagsShow, setSuggestedTagsShow] = useState<boolean[]>([]);
  const [selectedTagsShow, setSelectedTagsShow] = useState<boolean[]>([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Suggested");
  const modalButtons = ["Suggested", "My Tags"];
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SurveyTag[]>([]);
  const searchTimerIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    refreshTags();
  }, []);

  useEffect(() => {
    searchTimerIdRef.current = setTimeout(() => {
      dispatch(searchTags(searchText)).then((res) => {
        const data = res.payload as SurveyTag[];
        setSearchResults(data);
      });
    }, 1000);

    return () => {
      clearTimeout(searchTimerIdRef.current);
    };
  }, [searchText]);

  const handleSearchSubmit = () => {
    clearTimeout(searchTimerIdRef.current);

    dispatch(searchTags(searchText)).then((res) => {
      const data = res.payload as SurveyTag[];
      setSearchResults(data);
    });
  };

  const refreshTags = () => {
    dispatch(getUserRelatedTags()).then((res) => {
      suggestedTags = user ? (res.payload as SurveyTag[]).map((tag) => tag) : [];
      originalSuggestedTags = JSON.parse(JSON.stringify(suggestedTags));
      setSuggestedTagsShow(suggestedTags.map(() => true));
    });

    selectedTags = user ? ((user as User).survey as SurveyTag[]).map((tag) => tag) : [];
    originalSelectedTags = JSON.parse(JSON.stringify(selectedTags));
    setSelectedTagsShow(selectedTags.map(() => true));
  };

  const handleCancel = () => {
    selectedTags = JSON.parse(JSON.stringify(originalSelectedTags));
    setSelectedTagsShow(selectedTags.map(() => true));
    suggestedTags = JSON.parse(JSON.stringify(originalSuggestedTags));
    setSuggestedTagsShow(suggestedTags.map(() => true));
    route.back();
  };

  const handleSaveTags = () => {
    const saveTagsPayload = { tags: selectedTags.filter(((t, index) => selectedTagsShow[index] === true)) };
    dispatch(saveTags(saveTagsPayload)).then(() => {
      dispatch(getUserInfo());
      ToastAndroid.show("Tags saved!", ToastAndroid.SHORT);
      route.back();
    });
  };

  function SuggestedTags() {
    return (
      <ScrollView style={styles.tagsContainer} contentContainerStyle={styles.tagsSection}>
        {suggestedTags && suggestedTags.length > 0 ? (
          suggestedTags.map(
            (tag, index) =>
              suggestedTagsShow[index] && (
                <TabButton
                  key={index}
                  title={tag.TagName}
                  field={tag.FieldName}
                  onPress={() => {
                    const tag = suggestedTags[index];
                    const newSuggestedTagsShow = [...suggestedTagsShow];
                    newSuggestedTagsShow[index] = false;
                    setSuggestedTagsShow(newSuggestedTagsShow);

                    if (!selectedTags.includes(tag)) {
                      selectedTags.push(tag);
                      const newSelectedTagsShow = [...selectedTagsShow];
                      newSelectedTagsShow.push(true);
                      setSelectedTagsShow(newSelectedTagsShow);
                    } else {
                      const tagIndex = selectedTags.indexOf(tag);
                      const newSelectedTagsShow = [...selectedTagsShow];
                      newSelectedTagsShow[tagIndex] = true;
                      setSelectedTagsShow(newSelectedTagsShow);
                    }

                    ToastAndroid.showWithGravity(
                      "Added tag to My Tags",
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM
                    );
                  }}
                  userSelected={false}
                />
              )
          )
        ) : (
          <Ionicons name="sad" size={25} color="#fff" />
        )}
      </ScrollView>
    );
  }

  function MyTags() {
    return (
      <ScrollView style={styles.tagsContainer} contentContainerStyle={styles.tagsSection}>
        {selectedTags && selectedTags.length > 0 ? (
          selectedTags.map(
            (tag, index) =>
              selectedTagsShow[index] && (
                <TabButton
                  key={index}
                  title={tag.TagName}
                  onPress={() => {
                    const tagIndex = suggestedTags.indexOf(selectedTags[index]);
                    if (tagIndex != -1) {
                      const newSuggestedTagsShow = [...suggestedTagsShow];
                      newSuggestedTagsShow[tagIndex] = true;
                      setSuggestedTagsShow(newSuggestedTagsShow);
                    }
                    const newSelectedTagsShow = [...selectedTagsShow];
                    newSelectedTagsShow[index] = false;
                    setSelectedTagsShow(newSelectedTagsShow);
                  }}
                  userSelected={true}
                />
              )
          )
        ) : (
          <Ionicons name="sad" size={25} color="#fff" />
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <View style={styles.rowContainer}>
          <FontAwesome6 name="bolt" size={24} color="#B9FF66" style={styles.streak_icon} />
          <ThemedText style={styles.modalTitle}>Feed Settings</ThemedText>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
            <ThemedText type="title" style={styles.closeButtonText}>
              CANCEL
            </ThemedText>
          </TouchableOpacity>
          <ButtonGradient label="SAVE" buttonStyle={{}} onPress={handleSaveTags} />
        </View>
      </View>

      <Divider orientation="horizontal" style={{ width: "100%", borderColor: "#3D434A", borderWidth: 1 }} />

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <FontAwesome6 name="magnifying-glass" size={24} color="#fff" />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Tags"
          placeholderTextColor="#fff"
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>
      {/* Search Results */}
      {searchResults.length > 0 && (
        <ScrollView style={{ maxHeight: 120, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              padding: 8,
              backgroundColor: "#eeee",
              marginTop: 5,
              borderRadius: 10,
            }}
          >
            {searchResults.map((tag, idx) => (
              <TabButton
                key={tag._id}
                title={tag.TagName}
                field={tag.FieldName}
                onPress={() => {
                  const findIndex = selectedTags.findIndex((t) => t._id == tag._id);
                  if (findIndex == -1) {
                    selectedTags = [...selectedTags, tag];
                    const newSelectedTagsShow = [...selectedTagsShow];
                    newSelectedTagsShow.push(true);
                    setSelectedTagsShow(newSelectedTagsShow);
                    ToastAndroid.show("Tag added to My Tags", ToastAndroid.SHORT);
                  } else {
                    if (!selectedTagsShow[findIndex]) {
                      const newSelectedTagsShow = [...selectedTagsShow];
                      newSelectedTagsShow[findIndex] = true;
                      setSelectedTagsShow(newSelectedTagsShow);
                    } else {
                      ToastAndroid.show("Tag already selected", ToastAndroid.SHORT);
                    }
                  }
                }}
                userSelected={false}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tabs */}
      <View style={styles.searchOptionsContainer}>
        <View style={styles.rowContainer}>
          {modalButtons.map((button) => (
            <TouchableOpacity
              key={button}
              onPress={() => setSelectedTab(button)}
              style={[
                styles.modalTextContainer,
                selectedTab === button && { backgroundColor: "#363B47" },
              ]}
            >
              <ThemedText
                style={[
                  styles.modalText,
                  selectedTab === button && styles.modalTextSelected,
                ]}
              >
                {button}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Divider orientation="horizontal" style={{ width: "100%", borderColor: "#242630", borderWidth: 1 }} />
      {/* Content */}
      {selectedTab === "Suggested" ? <SuggestedTags /> : <MyTags />}
    </View>
  );
}
export default memo(FeedSettingScreen);
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
    paddingBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  streak_icon: {
    paddingRight: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#1B1F26",
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    paddingHorizontal: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DCDCDC",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E3B40",
    width: "100%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#3D434A",
    marginTop: 20,
  },
  searchBar: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
  },
  searchOptionsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  modalTextContainer: {
    borderRadius: 10,
    width: 100,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#8A94AC",
    textAlign: "center",
  },
  modalTextSelected: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tagsSection: {
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  tagsContainer: {
    flex: 1,
  },
});