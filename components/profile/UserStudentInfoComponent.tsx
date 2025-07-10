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
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3A7D44", "#153D2B"]} // More dark green gradient
        style={{ flex: 1, borderRadius: 20, padding: 20 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>STUDENT INFORMATION</Text>
        <View style={[{ gap: 5 }]}>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>STUDENT ID:</Text>
            <Text style={styles.info}>{profile.studentID}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.attribute}>DEPARTMENT:</Text>
            <Text style={styles.info}>{profile.department}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    height: 150,

    borderRadius: 20,
  },
  title: {
    color: "#B9FF66",
    fontSize: 20,
    paddingBottom: 20,
    fontWeight: "bold",
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
  },
  info: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
