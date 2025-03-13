import { View, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

type UserStudentInfoProps = {
  studentId: string;
  departure: string;
};

export default function UserStudentInfoComponent({
  studentId,
  departure,
}: UserStudentInfoProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.title}>
        Student Infomation
      </ThemedText>
      <View style={[{ gap: 5 }]}>
        <View style={styles.rowContainer}>
          <ThemedText style={styles.attribute}>Student ID:</ThemedText>
          <ThemedText style={styles.info}>{studentId}</ThemedText>
        </View>
        <View style={styles.rowContainer}>
          <ThemedText style={styles.attribute}>Departure:</ThemedText>
          <ThemedText style={styles.info}>{departure}</ThemedText>
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
