import { useRouter } from "expo-router";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function CreateTagPage() {
    const route = useRouter();
    const handleSubmit = () => {
    }
    const handleCancel = () => {
        route.back();
    }
  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter new tag name"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>
      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#3D434A" }} />
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.7}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.7}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  textInput: {
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: "#000",
  },
  textInputContainer: {
    boxShadow: "0 5px 0px 0px #B9FF66",
    borderRadius: 20,
    backgroundColor: "#fff",
    margin: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: "#232D3E",
    borderRadius: 999,
  },
  submitButton: {
    padding: 10,
    backgroundColor: "#B9FF66",
    borderRadius: 999,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  submitButtonText: {
    color: "#000",
    fontSize: 16,
    paddingHorizontal: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    padding: 20,
    gap: 20,
  },
});
