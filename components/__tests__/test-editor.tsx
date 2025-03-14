import QuillEditor from "@/components/quill/QuillEditor";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
export default function EditorScreen() {
  const [editorContent, setEditorContent] = useState<string>('');
  return (
    <View style={styles.container}>
      <View style={styles.editorContainer}>
        <QuillEditor onContentChange={setEditorContent} />
      </View>
      <View style={styles.previewContainer}>
        <Text style={styles.previewText}>Preview:</Text>
        <Text>{editorContent}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  editorContainer: {
    flex: 1,
    marginBottom: 16,
  },
  previewContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  previewText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
});