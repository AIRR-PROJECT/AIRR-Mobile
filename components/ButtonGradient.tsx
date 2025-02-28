import { StyleSheet, View, type ViewStyle, type TextStyle } from "react-native";
import { ThemedText } from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions,TouchableOpacity } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import AnimatedPressable from "./AnimatedPressable";

type ButtonGradientProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle; // Allow custom styles for the button container
  buttonStyle?: ViewStyle; // Allow custom button styles
  labelStyle?: TextStyle; // Allow custom label styles
  defaultAction?: () => void; // Fallback action if no onPress is passed
  lightColor?: string;
  darkColor?: string;
};

export default function ButtonGradient({
  label,
  onPress,
  style,
  buttonStyle,
  labelStyle,
  defaultAction,
  lightColor,
  darkColor,
}: ButtonGradientProps) {
  const handlePress = onPress || defaultAction || (() => alert("You pressed a button."));
 

  return (
    <View style={[styles.buttonContainer, style, {  }]}>
      <LinearGradient 
        colors={['#B9FF66', '#9DE8EE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, buttonStyle]}
      >
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={handlePress} >
          <ThemedText style={[styles.buttonLabel, labelStyle]} type="defaultSemiBold" lightColor={lightColor} darkColor={darkColor}>
            {label}
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: windowHeight * 0.08, // 8% of height device screen
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 80,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    color: "#000000",
    fontSize: 16,
  },
});