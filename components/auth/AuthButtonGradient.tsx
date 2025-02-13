import { StyleSheet, Pressable, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
type Props = {
  label: string;
  onPress?: () => void;
  style?: object; // Allow custom styles for the button container
  buttonStyle?: object; // Allow custom button styles
  labelStyle?: object; // Allow custom label styles
  defaultAction?: () => void; // Fallback action if no onPress is passed
};

export default function AuthButtonGradient({
  label,
  onPress,
  style,
  buttonStyle,
  labelStyle,
  defaultAction,
}: Props) {
  const handlePress =
    onPress || defaultAction || (() => alert("You pressed a button.")); // Default action if no onPress is provided

  return (
    <View style={[styles.buttonContainer, style]}>
      <LinearGradient 
        colors={['#B9FF66', '#9DE8EE',]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, style]}
        >
        <Pressable style={[styles.button, buttonStyle]} onPress={handlePress}>
          <ThemedText style={[styles.buttonLabel, labelStyle]}>
            {label}
          </ThemedText>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: windowHeight * 0.08 , // 8% of height device screen
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    marginBottom: 15,
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
    fontWeight: "bold",
  },
});
