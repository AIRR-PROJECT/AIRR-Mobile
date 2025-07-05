import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";

type RequestTagsComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  onPress: (tags: string[]) => void;
};

export default function RequestTagsBottomSheet({
  sheetRef,
  onPress,
}: RequestTagsComponentProps) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1} // Start closed
      snapPoints={["90%"]}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: "#1E1E1E" }}
      handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
      style={{ backgroundColor: "#1E1E1E" }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetView style={styles.contentContainer}>
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
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 5,
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
  },
  searchBar: {
    backgroundColor: "#2E3B40",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
  },
});
