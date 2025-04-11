import { Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

type GroupCardComponentProps = {
  image: string;
  name: string;
  id: string;
  members: number;
  style? : StyleProp<ViewStyle>;
  // later add onPress function
  // onPress: () => void;
};
export default function GroupCardComponent({
  image,
  name,
  id,
  members,
  style,
}: GroupCardComponentProps) {
  const route = useRouter();
  const handleJoinPress = () => {
    // Handle join button press
    console.log(`Join group ${name}`);
  }
  const handleGroupPress = () => {
    // Handle group card press
    route.push("/group");
    console.log(`Group card pressed: ${name}`);
  }
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleGroupPress} activeOpacity={0.6}>
      {/* Group image */}
      <View style={styles.rowContainer}>
        <Image style={styles.image} source={image} />
        {/* name, group id, member */}
        <View>
          {/* name */}
          <Text style={styles.name}>{name}</Text>
          <View style={styles.groupIdAndMember}>
            {/* Group id and member */}
            <Text style={styles.groupId}>@{id}</Text>
            <Entypo name="dot-single" size={10} color="#98AAAE" />
            <Text style={styles.member}>{members} members</Text>
          </View>
        </View>
      </View>
      {/* Join button */}
      <TouchableOpacity style={styles.joinButton} onPress={handleJoinPress}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  groupId: {
    color: "#98AAAE",
    fontSize: 14,
  },
  member: {
    color: "#98AAAE",
    fontSize: 14,
  },
  groupIdAndMember: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  joinButton: {
    backgroundColor: "transparent",
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderRadius: 45,
    borderColor: "#fff",
  },
  joinButtonText: {
    color: "#fff",
  },
});
