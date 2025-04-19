import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

type BottomLeftArrowIconProps = {
  style?: StyleProp<TextStyle>;
  color?: string;
};
export default function BottomLeftArrowIcon({
  style,
  color,
}: BottomLeftArrowIconProps) {
  return (
    <MaterialCommunityIcons
      name="arrow-top-right"
      size={24}
      color={color ?? "white"}
      style={[styles.icon, style]}
    />
  );
}
const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 999,
    padding: 8,
    backdropFilter: "transparent",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
