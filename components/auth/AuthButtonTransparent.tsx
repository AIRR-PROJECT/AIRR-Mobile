import { StyleSheet, } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Dimensions } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import AnimatedPressable from "@/components/AnimatedPressable";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Text } from "react-native";
type Props = {
  label: string;
  onPress?: () => void;
  style?: object; // Allow custom styles for the button container
  buttonStyle?: object; // Allow custom button styles
  labelStyle?: object; // Allow custom label styles
  defaultAction?: () => void; // Fallback action if no onPress is passed
};



export default function AuthButtonTransparent({
  label,
  onPress,
  style,
  buttonStyle,
  labelStyle,
  defaultAction,
}: Props) {
  const handlePress =
    onPress || defaultAction || (() => alert("You pressed a button.")); // Default action if no onPress is provided
  const colorTheme = useColorScheme();
  // light or dark theme
  const innerBgColor = colorTheme === "light" ? "#1E1E1E" : "#1E1E1E"; //same color because UI not designed for light mode yet
  return (
    <LinearGradient
      style={[styles.buttonContainer, style]}
      colors={["#B9FF66", "#9DE8EE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={[styles.innerContainer,{backgroundColor: innerBgColor}]}>
      <AnimatedPressable style={[styles.button, buttonStyle]} onPress={handlePress}>
          <ThemedText style={[styles.buttonLabel, labelStyle]}>
            {label}
          </ThemedText>
        </AnimatedPressable>
        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: windowHeight * 0.08, // 8% of height device screen
   
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    marginBottom: 15,
    borderRadius: 80,
    color: 'transparent',
  },

  innerContainer: {
    width: "100%",
    height: "100%", 
    borderRadius: 80, // <-- Inner Border Radius
    flex: 0,
    margin: 5, // <-- Border Width
    justifyContent: "center",
  },
  button: {
    borderRadius: 80,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    
  },
});
