import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";

type TabButtonProps = {
  title: string;
  onPress: () => void;
};
export default function ProfileTabButton({ title, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity style={[styles.tabButton]} onPress={onPress}>
      <ThemedText
        style={[styles.tabButtonText]}
        lightColor="#fff"
        darkColor="#fff"
      >
        #{title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    width: "auto",
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#413f3f",
    marginVertical: 5,
  },
  tabButtonText: {
    fontSize: 11,
  },
});
