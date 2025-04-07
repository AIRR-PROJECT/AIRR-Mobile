
import QuillEditor from "@/components/quill/QuillEditor";
import { useState } from "react";
import { View, Text } from "react-native";

export default function ByDate() {
  const [value, setValue] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <Text>By Date</Text>
    </View>
  );
}
