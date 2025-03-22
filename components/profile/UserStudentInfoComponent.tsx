import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { User } from "@/interfaces/userInterface";

type UserStudentInfoProps = {
  studentId: string;
  departure: string;
};
type StudentInfo = Pick<User, "profile">

export default function UserStudentInfoComponent({
  profile
}: StudentInfo) {
  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.title}>
        Student Infomation
      </ThemedText>
      <View style={[{ gap: 5 }]}>
        <View style={styles.rowContainer}>
          <ThemedText style={styles.attribute}>Student ID:</ThemedText>
          <ThemedText style={styles.info}>{profile.studentID}</ThemedText>
        </View>
        <View style={styles.rowContainer}>
          <ThemedText style={styles.attribute}>Department:</ThemedText>
          <ThemedText style={styles.info}>{profile.department}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
    height: 150,
    
    borderRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attribute: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    color: "#fff",
    fontSize: 16,
  },
});
