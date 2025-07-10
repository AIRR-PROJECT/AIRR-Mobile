import { BlogStatus } from "@/enums/blog_properties.enum";
import { Feather } from "@expo/vector-icons";

import { View, Text, StyleSheet } from "react-native";
export default function BlogStatusComponent({
  status,
}: {
  status: BlogStatus;
}) {
  const getStatusStyle = () => {
    switch (status) {
      case BlogStatus.ACTIVE:
        return styles.active;
      case BlogStatus.PENDING:
        return styles.pending;
      case BlogStatus.BANNED:
        return styles.banned;
      case BlogStatus.REJECTED:
        return styles.rejected;
      case BlogStatus.IN_PROFILE_PAGE:
        return styles.inProfilePage;
      case BlogStatus.PRIVATE:
        return styles.private;
      default:
        return styles.default;
    }
  };
  
  return (
    <View style={[styles.statusContainer, getStatusStyle(), {borderColor: getStatusStyle().color}]}>
      {status === BlogStatus.ACTIVE && (
        <Feather name="check-circle" size={20} color="green" />
      )}
      {status === BlogStatus.PENDING && (
        <Feather name="clock" size={20} color="orange" />
      )}
      {status === BlogStatus.REJECTED && (
        <Feather name="x-circle" size={20} color="red" />
      )}
      {status === BlogStatus.IN_PROFILE_PAGE && (
        <Feather name="user" size={20} color="blue" />
      )}
      {status === BlogStatus.PRIVATE && (
        <Feather name="lock" size={20} color="red" />
      )}
      <Text style={[styles.statusText, getStatusStyle()]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusText: {
    fontWeight: "bold",
  },
  active: {
    backgroundColor: "#dcfce7",
    color: "#2E7D32",
  },
  pending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
  },
  banned: {
    backgroundColor: "#E5E7EB",
    color: "#000",
  },
  rejected: {
    backgroundColor: "#F8D7DA",
    color: "#721C24",
  },
  inProfilePage: {
    backgroundColor: "#E3F2FD",
    color: "#0D47A1",
  },
  private: {
    backgroundColor: "#FEE2E1",
    color: "#424242",
  },
  default: {
    backgroundColor: "#F0F0F0",
    color: "#000",
  },
  statusContainer: {
    borderRadius: 25,
    flexDirection: "row",
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 5,
    borderWidth: 1,
  },
});
