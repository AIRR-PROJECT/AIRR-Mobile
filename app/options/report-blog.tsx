import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const options = [
  "Clickbait",
  "Inappropriate Content",
  "Copyright Violation",
  "Sensitive Content",
  "Off-topic",
  "Other",
];
export default function ReportBlog() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  return (
    <View style={styles.screenContainer}>
      <View
        style={[
          styles.rowContainer,
          {
            alignItems: "center",
            borderRadius: 10,
            gap: 20,
          },
        ]}
      >
        <AntDesign name="flag" size={24} color="red" />
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
          Report Blog
        </Text>
      </View>

      <View style={styles.container}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => setSelectedOption(option)}
          >
            <View style={styles.radioCircle}>
              {selectedOption === option && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.optionalTitle}>
        Would you like to provide any additional details?
      </Text>

      <TextInput
        style={styles.optionalText}
        placeholder="Enter details here..."
        placeholderTextColor="gray"
        multiline
        numberOfLines={5}
      />
      <View
        style={[
          styles.rowContainer,
          { justifyContent: "flex-end", marginTop: 20 },
        ]}
      >
        {/* Cancel Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            padding: 10,
            borderRadius: 20,
            marginRight: 10,
          }}
          onPress={() => console.log("Cancel Pressed")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
        </TouchableOpacity>
        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 10,
            borderRadius: 20,
          }}
          onPress={() => console.log("Submit Pressed")}
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    marginTop: 20,
    justifyContent: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
  optionalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionalText: {
    backgroundColor: "#2E3B40",
    color: "white",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    textAlignVertical: "top",
    height: 100, // Adjust height as needed
  },
});
