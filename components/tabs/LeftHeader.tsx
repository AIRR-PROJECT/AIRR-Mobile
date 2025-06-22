import { SearchType } from "@/enums/search_type.enum";
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
  SafeAreaView,
} from "react-native";
import { Dimensions } from "react-native";
const icon_air_tech = require("@/assets/images/logo/logo_icon-air-tech_small.svg");
export default function LeftHeader() {
  // Add variable to get type of searchType, with redux or context
  // If user is in page my feed, then searchType is SearchType.BLOG
  // If user is in page group, then searchType is SearchType.GROUP
  // This line here is for testing purpose, remove it after implementing the logic
  const searchType = SearchType.BLOG;

  const [visible, setVisible] = useState(false);
  const route = useRouter();
  const handleSearchPress = () => {
    // Navigate to the search page
    console.log("Search button pressed");
    // route.push("/search-tab");
    setVisible(true);
  };

  console.log("searchType", searchType);
  return (
    <View style={styles.container}>
      {/* <Image source={icon_air_tech} style={styles.image} contentFit="contain" /> */}
      {/* Search button */}
      {searchType != SearchType.NONE && (
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchBarButton}
        >
          <FontAwesome name="search" size={20} color="#B9FF66" />
          <Text style={styles.searchBarText}>
            {searchType === SearchType.BLOG
              ? "Search blog..."
              : "Search group..."}
          </Text>
        </TouchableOpacity>
      )}
      {/* modal */}
      <SearchScreen
        visible={visible}
        onClose={() => setVisible(false)}
        searchType={searchType}
      />
    </View>
  );
}
// This based on search API from backend
// Can search both blog and group
function SearchScreen({
  visible,
  onClose,
  searchType = SearchType.BLOG,
}: {
  visible: boolean;
  onClose: () => void;
  searchType?: SearchType;
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
  if (searchType === SearchType.NONE) return null;
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        {/* Header with Search Bar and Close Button */}
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder={
              searchType === SearchType.BLOG
                ? "Search blog..."
                : "Search group..."
            }
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: Dimensions.get("window").width / 2.5,
  },
  image: {
    width: 100,
    height: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
  },
  searchBarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#B9FF66",
  },
  searchBarText: {
    color: "#B9FF66",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8, // Status bar height (adjust as needed)
    paddingBottom: 10,
    backgroundColor: "#1E1E1E",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#232323",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    color: "#B9FF66",
    borderColor: "#B9FF66",
    borderWidth: 1,
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
