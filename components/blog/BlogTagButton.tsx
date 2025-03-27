import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";



export default function BlogTagButton({title}: {title: string}) {
  return (
    // change to button later if needed
    <View style={[styles.tagContainer]}>
      <ThemedText
        style={[styles.tagText]}
        lightColor="#fff"
        darkColor="#fff"
      >
        #{title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    width: "auto",
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#413f3f",
    marginVertical: 5,
  },
  tagText: {
    fontSize: 11,
  },
});
