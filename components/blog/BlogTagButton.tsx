import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export function BlogTagButton({ title }: { title: string }) {
  return (
    // change to button later if needed
    <View style={[styles.tagContainer]}>
      <ThemedText style={[styles.tagText]} lightColor="#fff" darkColor="#fff">
        #{title}
      </ThemedText>
    </View>
  );
}

export function PendingTagButton({ title }: { title: string }) {
  return (
    // change to button later if needed
    <View style={[styles.pendingContainer]}>
      <ThemedText style={[styles.pendingText]} lightColor="#fff" darkColor="#fff">
        #{title}
      </ThemedText>
      <Feather name="clock" size={16} color="black" />
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
  pendingContainer: {
    width: "auto",
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#fef9c3",
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pendingText: {
    fontSize: 11,
    color: "#966520",
  },
});
