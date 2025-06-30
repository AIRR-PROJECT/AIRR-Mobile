import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

type MoreOptionComponentProps = {
  sheetRef: React.RefObject<BottomSheet>;
  isUserWrittenBlog: boolean;
};
export default function MoreOptionBottomList({
  sheetRef,
  isUserWrittenBlog,
}: MoreOptionComponentProps) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1} // Start closed
      snapPoints={["40%"]}
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
      {isUserWrittenBlog ? (
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity style={styles.bottomOptionButton}>
            {/* Edit */}
            <FontAwesome name="edit" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Edit blog</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOptionButton}>
            {/* delete */}
            <MaterialIcons name="delete" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Delete blog</Text>
          </TouchableOpacity>
        </BottomSheetView>
      ) : (
        <BottomSheetView style={styles.contentContainer}>
          <TouchableOpacity style={styles.bottomOptionButton}>
            {/* Hide */}
            <Entypo name="circle-with-minus" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Hide blog</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomOptionButton}>
            {/* Report */}
            <MaterialIcons name="report" size={24} color="black" />
            <Text style={styles.bottomOptionText}>Report blog</Text>
          </TouchableOpacity>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },
  bottomOptionButton: {
    flexDirection: "row",
    padding: 20,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "#fff",
    marginTop: 20,
    gap: 10,
  },
  bottomOptionText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
