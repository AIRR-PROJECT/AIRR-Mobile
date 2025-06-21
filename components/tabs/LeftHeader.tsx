import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
const icon_air_tech = require("@/assets/images/logo/logo_icon-air-tech_small.svg");
export default function LeftHeader() {
  const [visible, setVisible] = useState(false);
  const route = useRouter();
  const handleSearchPress = () => {
    // Navigate to the search page
    console.log("Search button pressed");
    // route.push("/search-tab");
    setVisible(true);
  };
  return (
    <View style={styles.container}>
      <Image source={icon_air_tech} style={styles.image} contentFit="contain" />
      {/* Search button */}
      <TouchableOpacity onPress={handleSearchPress} style={styles.button}>
        <FontAwesome name="search" size={24} color="#B9FF66" />
      </TouchableOpacity>
      {/* modal */}
      <SearchScreen visible={visible} onClose={() => setVisible(false)} />
    </View>
  );
}
// This based on search API from backend
// Can search both blog and group
function SearchScreen({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [searchText, setSearchText] = useState("");

  // Mock data for search results
  const results = [
    "AirTech One",
    "AirTech Two",
    "AirTech Three",
    "AirTech Four",
    "AirTech Five",
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        {/* Header with Search Bar and Close Button */}
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search results list */}
        <FlatList
          data={results.filter((item) =>
            item.toLowerCase().includes(searchText.toLowerCase())
          )}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text>{item}</Text>
            </View>
          )}
          contentContainerStyle={styles.resultsContainer}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 15,
  },
  button: {},

  modalContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20, // Status bar height (adjust as needed)
    paddingBottom: 10,
    backgroundColor: "#B9FF66",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  resultsContainer: {
    padding: 16,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
