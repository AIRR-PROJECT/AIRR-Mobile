import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";

type TabButtonProps = {
    title: string;
    onPress: () => void;
    userSelected: boolean; // Whether the user has selected this tab
};
export default function TabButton({
  title,
  onPress,
  userSelected,
}: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, { backgroundColor: userSelected ? "#fff" : "#2E3B40" }]}
      onPress={onPress}
    >
      <ThemedText
        style={[styles.tabButtonText, { color: userSelected ? "#000" : "#fff" }]}
        lightColor="#fff"
        darkColor="#fff"
      >
        {title}   {userSelected ? "x" : "+"}
      </ThemedText>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    width: "auto",
    padding: 10,
    paddingBlock: 5,
    borderRadius: 10,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});