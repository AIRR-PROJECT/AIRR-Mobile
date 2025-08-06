import { FontAwesome } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";

import { useRouter } from "expo-router";

export default function LeftHeader() {
  const router = useRouter();

  const handleSearchPress = () => {
    console.log("Search button pressed");
    router.push("/search-screen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressOut={handleSearchPress}
        style={styles.searchBarButton}
      >
        <FontAwesome name="search" size={20} color="#B9FF66" />
        <Text style={styles.searchBarText}>Search ...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: Dimensions.get("window").width / 2.5,
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
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#1E1E1E",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#232323",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingVertical: 8,
  },
  sectionHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#a1f7b6",
    borderRadius: 8,
  },
});
