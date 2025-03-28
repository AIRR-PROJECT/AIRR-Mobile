import { Keyboard, StyleSheet, Text, TextInput, ToastAndroid } from "react-native";
import { View, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Entypo, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Divider } from "@rneui/themed";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ButtonGradient from "../ButtonGradient";
import AnimatedPressable from "../AnimatedPressable";
import { Pressable } from "react-native";
import { Collapsible } from "../Collapsible";
import TabButton from "./feed/TabButton";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { saveTags } from "@/redux/slices/feedSlice";
import { getUserInfo } from "@/redux/slices/authSlice";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type RightHeaderProps = {
  streak: number;
  avatar?: string;
};

type Tag = {
  _id: string;
  TagName: string;
}

// const userSelectedTabs = ["Python", "JavaScript", "React", "Vue", "Angular"];
// const defaultSuggestedTabs = ["Java", "C++", "C#", "Ruby", "Rust", "Go", "Swift"];
let suggestedTags: Tag[] = []
let selectedTags: Tag[] = []
let originalSuggestedTags: Tag[]
let originalSelectedTags: Tag[]

export default function RightHeader({ streak, avatar }: RightHeaderProps) {
  const route = useRouter();
  const dispatch = useAppDispatch()
  const { user, userAvatar } = useAppSelector(state => state.user)

  const [suggestedTagsShow, setSuggestedTagsShow] = useState<boolean[]>([]);
  const [selectedTagsShow, setSelectedTagsShow] = useState<boolean[]>([]);

  const handleAvatarPress = () => {
    console.log("Avatar Pressed");
    route.push("/profile");
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchFocused, setSearchFocused] = useState(false);

  const [selectedTab, setSelectedTab] = useState("Suggested");
  const modalButtons = ["Suggested", "My Tags"];

  useEffect(() => {
    refreshTags()
  }, [])

  // Handle on tags saved
  useEffect(() => {
    refreshTags()
    ToastAndroid.showWithGravity(`Selected tags saved`, ToastAndroid.LONG, ToastAndroid.BOTTOM)
    if (isModalVisible) {
      setModalVisible(false)
    }
  }, [user])

  const refreshTags = () => {
    suggestedTags = user ? 
      ((user as any).survey.RelatedTags as Tag[]).map((tag, index) => tag)
      : []
    selectedTags = user ? 
      ((user as any).survey.SelectedTags as Tag[]).map((tag, index) => tag)
      : []
    originalSuggestedTags = JSON.parse(JSON.stringify(suggestedTags))
    originalSelectedTags = JSON.parse(JSON.stringify(selectedTags))

    const initSuggestedTagsShow = suggestedTags.map(() => true)
    setSuggestedTagsShow(initSuggestedTagsShow)
    const initSelectedTagsShow = selectedTags.map(() => true)
    setSelectedTagsShow(initSelectedTagsShow)
  }

  const handleCancel = () => {
    // Reset
    selectedTags = JSON.parse(JSON.stringify(originalSuggestedTags))
    selectedTags = JSON.parse(JSON.stringify(originalSelectedTags))
    const initSuggestedTagsShow = suggestedTags.map(() => true)
    setSuggestedTagsShow(initSuggestedTagsShow)
    const initSelectedTagsShow = selectedTags.map(() => true)
    setSelectedTagsShow(initSelectedTagsShow)

    // Make modal invisible
    setModalVisible(false)
  }

  const handleSaveTags = () => {
    const saveTagsPayload = {
      tags: selectedTags
    }
    dispatch(saveTags(saveTagsPayload)).then(() => {
      dispatch(getUserInfo())
    })
  }

  

  function SuggestedTags() {
    return (
      <View style={styles.tagsSection}>
        {suggestedTags ? suggestedTags.map((tag, index) => 
          (
            suggestedTagsShow[index] &&
            <TabButton
              key={index}
              title={tag.TagName}
              onPress={() => {
                const tag = suggestedTags[index]

                const newSuggestedTagsShow = [...suggestedTagsShow]
                newSuggestedTagsShow[index] = false
                setSuggestedTagsShow(newSuggestedTagsShow)
    
                if (!selectedTags.includes(tag)) {
                  selectedTags.push(tag)
    
                  const newSelectedTagsShow = [...selectedTagsShow]
                  newSelectedTagsShow.push(true)
                  setSelectedTagsShow(newSelectedTagsShow)
                }
                else {
                  const tagIndex = selectedTags.indexOf(suggestedTags[index])
                  const newSelectedTagsShow = [...selectedTagsShow]
                  newSelectedTagsShow[tagIndex] = true
                  setSelectedTagsShow(newSelectedTagsShow)
                }
    
                ToastAndroid.showWithGravity("Added tag to My Tags", ToastAndroid.LONG, ToastAndroid.BOTTOM)
              }}
              userSelected={false}
            />
          )) :
          <Ionicons name="sad" size={25} color="#fff" />}
      </View>
    );
  }
  function MyTags() {
    return (
      <View style={styles.tagsSection}>
        {selectedTags ? selectedTags.map((tag, index) => 
          (
            selectedTagsShow[index] &&
            <TabButton
              key={index}
              title={tag.TagName}
              onPress={() => {
                // New suggested tags show list
                const tagIndex = suggestedTags.indexOf(selectedTags[index])
                if (tagIndex != -1) {
                  const newSuggestedTagsShow = [...suggestedTagsShow]
                  newSuggestedTagsShow[tagIndex] = true
                  setSuggestedTagsShow(newSuggestedTagsShow)
                }

                // New selected tags show list
                const newSelectedTagsShow = [...selectedTagsShow]
                newSelectedTagsShow[index] = false
                setSelectedTagsShow(newSelectedTagsShow)
              }}
              userSelected={true}
            />
          )) :
          <Ionicons name="sad" size={25} color="#fff" />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Feed Settings Button */}
      <TouchableOpacity
        style={styles.feed_settings_icon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={18} color="#fff" />
      </TouchableOpacity>

      <Divider orientation="vertical" width={1} />

      {/* Streak Tracker */}
      <View style={styles.streak_container}>
        <FontAwesome6
          name="bolt"
          size={18}
          color="#B9FF66"
          style={styles.streak_icon}
        />
        <ThemedText style={styles.text} lightColor="#fff" darkColor="#fff">
          {streak}
        </ThemedText>
      </View>

      <Divider orientation="vertical" width={1} />

      {/* Avatar (Circle Container) */}
      <Pressable style={styles.avatar_container} onPress={handleAvatarPress}>
        <Image
          source={userAvatar ? { uri: userAvatar } : sample_avatar}
          style={styles.avatar}
        />
      </Pressable>

      {/* Modal for Feed Settings */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          //  Close the modal when the user taps outside of the modal and when not focused on the search bar
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              if (!isSearchFocused) {
                handleCancel()
              } else {
                Keyboard.dismiss();
              }
            }
          }}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.rowContainer}>
                <FontAwesome6
                  name="bolt"
                  size={24}
                  color="#B9FF66"
                  style={styles.streak_icon}
                />
                <ThemedText style={styles.modalTitle}>Feed Settings</ThemedText>
              </View>
              {/* Close button and Save button */}
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCancel}
                >
                  <ThemedText type="title" style={styles.closeButtonText}>
                    CANCEL
                  </ThemedText>
                </TouchableOpacity>
                <ButtonGradient
                  label="SAVE"
                  style={{ width: 100, padding: 10 }}
                  onPress={handleSaveTags}
                />
              </View>
            </View>

            <Divider
              orientation="horizontal"
              style={{ width: "100%", borderColor: "#3D434A", borderWidth: 1 }}
            />

            {/* Modal Content */}
            {/* Search bar */}
            <View style={styles.searchContainer}>
              <FontAwesome6 name="magnifying-glass" size={24} color="#fff" />
              <TextInput
                style={styles.searchBar}
                placeholder="Search Tags"
                placeholderTextColor="#fff"
                onFocus={() => {
                  setSearchFocused(true);
                  console.log("Search bar focused");
                }}
                onBlur={() => {
                  setSearchFocused(false);
                  console.log("Search bar unfocused");
                }}
              />
            </View>
            {/* Tags Row and sort button */}
            <View style={[styles.searchOptionsContainer]}>
              {/* Suggested and My Tags */}
              <View style={[styles.rowContainer]}>
                {modalButtons.map((button) => (
                  <TouchableOpacity
                    key={button}
                    onPress={() => setSelectedTab(button)}
                    style={[
                      styles.modalTextContainer,
                      selectedTab === button && {
                        backgroundColor: "#363B47",
                      },
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
              <TouchableOpacity style={styles.modalSortButtonContainer}>
                <ThemedText style={styles.modalSortButton}>Sort</ThemedText>
                <Entypo name="select-arrows" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Divider
              orientation="horizontal"
              style={{ width: "100%", borderColor: "#242630", borderWidth: 1 }}
            />
            {/* Content */}
            
              {selectedTab === "Suggested" ? (
                <SuggestedTags />
              ) : (
                <MyTags />
              )}
       
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  feed_settings_icon: {
    paddingHorizontal: 10,
  },
  streak_icon: {
    paddingRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  streak_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  avatar_container: {
    paddingLeft: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(36, 87, 75, 0.5)", // Semi-transparent dark background
  },
  modalContent: {
    width: "95%",
    padding: 20,
    backgroundColor: "#110F0F", // Dark background for modal
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
  modalTextContainer: {
    borderRadius: 10,
    width: 100,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSortButtonContainer: {
    flexDirection: "row",
    backgroundColor: "#2E3B40",
    borderRadius: 1000,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  modalSortButton: {
    paddingBlock: 5,
    fontSize: 14,
    color: "#fff",
    padding: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#1B1F26",
    borderRadius: 1000,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DCDCDC",
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: "bold",
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
  searchOptionsContainer: {
    width: "100%", // Make sure the row takes up the full width of the modal
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  searchBar: {
    padding: 10,
    flex: 0.9,
    borderRadius: 20,
    color: "#fff",
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
  tagsSection: {
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
});
