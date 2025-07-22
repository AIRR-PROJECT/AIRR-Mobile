import { TouchableOpacity, View, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { useState } from "react";
import ToolTip from "react-native-walkthrough-tooltip";
type TabButtonProps = {
  title: string;
  onPress: () => void;
  userSelected: boolean; // Whether the user has selected this tab
  field?: string; // The field to be used for the tab
};
export default function TabButton({
  title,
  onPress,
  userSelected,
  field,
}: TabButtonProps) {
  const [isShowTooltip, setIsShowTooltip] = useState(false);
  return (
    <View style={styles.container}>
      <ToolTip
        isVisible={field !== undefined && field !== "" && isShowTooltip}
        content={<Text>{field}</Text>}
        placement="top"
        onClose={() => setIsShowTooltip(false)}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            { backgroundColor: userSelected ? "#fff" : "#2E3B40" },
          ]}
          onPress={onPress}
          onLongPress={() => setIsShowTooltip(true)}
          activeOpacity={0.8}
          onPressOut={() => setIsShowTooltip(false)}
        >
          <Text
            style={[
              styles.tabButtonText,
              { color: userSelected ? "#000" : "#fff" },
            ]}
          >
            {title} {userSelected ? "x" : "+"}
          </Text>
        </TouchableOpacity>
      </ToolTip>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabButton: {
    padding: 10,
    borderRadius: 10,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
