import { CreateGroupTag } from "@/interfaces/groupInterface";
import { useAppDispatch } from "@/redux/hook";
import { createTag } from "@/redux/slices/groupSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

export default function CreateTagPage() {
    const route = useRouter();
    const dispatch = useAppDispatch()
    const { groupID, fieldID } = useLocalSearchParams<{ groupID: string, fieldID: string }>()
    const tagName = useRef("")

    const handleTagNameTextChange = (val: string) => {
      tagName.current = val
    }

    const handleSubmit = () => {
      const createTagData: CreateGroupTag = {
        TagName: tagName.current,
        FieldID: fieldID,
        NumberOfBlogUse: 0,
        IsDefaultTag: false
      }
      
      dispatch(createTag(createTagData))
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
          onChangeText={handleTagNameTextChange}
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
