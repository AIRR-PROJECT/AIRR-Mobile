import { Keyboard, StyleSheet, Text, TextInput } from "react-native";
import { View, Modal, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Divider } from "@rneui/themed";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
import { useState } from "react";
import ButtonGradient from "../ButtonGradient";
import AnimatedPressable from "../AnimatedPressable";
import { Pressable } from "react-native";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type RightHeaderProps = {
  streak: number;
  avatar?: string;
};

export default function RightHeader({ streak, avatar }: RightHeaderProps) {
  const route = useRouter();
  const handleAvatarPress = () => {
    console.log("Avatar Pressed");
    route.push("/profile");
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<"suggested" | "myTags">("suggested"); // Default to suggested tags
  return (
    <View style={styles.container}>
      {/* Feed Settings Button */}
      <AnimatedPressable
        style={styles.feed_settings_icon}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="filter" size={18} color="#fff" />
      </AnimatedPressable>

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
          source={avatar ? { uri: avatar } : sample_avatar}
          style={styles.avatar}
        />
      </Pressable>

      {/* Modal for Feed Settings */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          //  Close the modal when the user taps outside of the modal and when not focused on the search bar
          onPress={(event) => {
            if (event.target === event.currentTarget) {
              if (!isSearchFocused) {
                setModalVisible(false);
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
                <AnimatedPressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText type="title" style={styles.closeButtonText}>
                    CANCEL
                  </ThemedText>
                </AnimatedPressable>
                <ButtonGradient
                  label="SAVE"
                  style={{ width: 100, padding: 5 }}
                />
              </View>
            </View>

            <Divider
              orientation="horizontal"
              style={{ width: "100%", borderColor: "#3D434A", borderWidth: 2 }}
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
            <View style={styles.rowContainer}>
              {/* Suggested and My Tags */}
              <View style={styles.rowContainer}>
                <AnimatedPressable>
                  <ThemedText style={styles.modalText}>Suggested</ThemedText>
                </AnimatedPressable>
                <AnimatedPressable>
                  <ThemedText style={styles.modalText}>My Tags</ThemedText>
                </AnimatedPressable>
              </View>
            </View>
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
    color: "#fff",
    textAlign: "center",
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
});
