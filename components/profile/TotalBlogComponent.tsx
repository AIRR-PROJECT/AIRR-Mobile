import { View, FlatList, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type TotalBlogComponentProps = {
    numberOfBlogs: number;
    label: string;
}

export default function TotalBlogComponent({ numberOfBlogs, label }: TotalBlogComponentProps) {
  return (
    <View style={styles.container}>
        <View style={styles.numberContainer}>
            <ThemedText style={styles.numberStyle}>{numberOfBlogs}</ThemedText>
        </View>
        <View style={styles.labelContainer}>
            <ThemedText style={styles.label}>{label}</ThemedText>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    borderColor: "#393F4C",
  },
  numberContainer: {
    backgroundColor: "#fff",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
  },
  numberStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    flexWrap: "wrap",
    flex: 1,
    textAlign: "center",
  },
  labelContainer: {
    flexDirection: "row",
  }
});
