import {
  StyleSheet,
  View,
  type ViewStyle,
  type TextStyle,
  StyleProp,
  Text, // <-- Import Text
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type ButtonGradientProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  defaultAction?: () => void;
  lightColor?: string;
  darkColor?: string;
  disabled?: boolean;
};

export default function ButtonGradient({
  label,
  onPress,
  style,
  buttonStyle,
  labelStyle,
  defaultAction,
  disabled,
}: ButtonGradientProps) {
  const handlePress =
    onPress || defaultAction || (() => alert("You pressed a button."));
  return (
    <View style={[styles.buttonContainer, style]}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["#B9FF66", "#9DE8EE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, buttonStyle]}
        >
          <Text style={[styles.buttonLabel, labelStyle]}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingVertical: 12,
    paddingHorizontal: 24, // Add horizontal padding for width
  },
  buttonLabel: {
    color: "#000000",
    fontWeight: "bold",
  },
});