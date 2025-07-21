import { View, StyleSheet, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { User } from "@/interfaces/userInterface";
import { LinearGradient } from "expo-linear-gradient";

type UserStudentInfoProps = {
  studentId: string;
  departure: string;
};
type StudentInfo = Pick<User, "profile">;

export default function UserStudentInfoComponent({ profile }: StudentInfo) {
  console.log("UserStudentInfoComponent", profile);
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3A7D44", "#153D2B"]} // More dark green gradient
        style={{ flex: 1, borderRadius: 20, padding: 20 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>ACADEMIC BACKGROUND</Text>
        <View style={[{ gap: 10, flex: 1}]}>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>MAJOR</Text>
            <Text style={styles.info}>{profile.department}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>GRADUATION STATUS</Text>
            <Text style={styles.info}>{profile.graduationStatus}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    borderRadius: 20,
  },
  title: {
    color: "#B9FF66",
    fontSize: 20,
    paddingBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attribute: {
    color: "#B9FF66",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  info: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
});
