import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type UserInfoProps = {
    username: string;
    avatar: string;
};

export default function UserInfo() {
  return (
    <ThemedView
      lightColor="#1E1E1E"
      darkColor="#1E1E1E"
      style={styles.container}
    >
        {/* User avatar */}

    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
