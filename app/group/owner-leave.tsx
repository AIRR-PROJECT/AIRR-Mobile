import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function OwnerLeaveGroup() {
  const isOwnerTheLastMember = false; // Placeholder for logic to determine if the owner is the last member
  if (isOwnerTheLastMember) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 16 }}>
          You cannot leave the group as you are the last member.
        </Text>
      </View>
    );
  }
}

function OwnerIsLastMember() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are You Sure For Leaving?</Text>
      <View style={styles.rowContainer}>

        <Text style={styles.text}>
          You are the only member left in this group. Want to delete it?
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Transfer Ownership</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#B9FF66",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  warningText: {
    fontSize: 14,
    marginLeft: 10,
  }
});
