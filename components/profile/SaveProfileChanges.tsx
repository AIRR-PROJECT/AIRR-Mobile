import { StyleSheet } from "react-native";
import ButtonGradient from "../ButtonGradient";

export default function SaveProfileChanges() {
  // handle on press to save change here
  const handleSaveChanges = () => {
    console.log("Save Profile Changes");
  };
  return (
    <ButtonGradient
      label="SAVE CHANGES"
      onPress={handleSaveChanges}
      style={styles.buttonContainer}
      labelStyle={styles.buttonLabel}
    />
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 150,
    height: 40,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
