import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

type GroupDropdownComponentProps = {
  avatar: string;
  name: string;
  id: string;
  onPress: (data: { avatar: string; name: string; id: string }) => void;
};

export default function GroupDropdownComponent({
  avatar,
  name,
  id,
  onPress,
}: GroupDropdownComponentProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onPress({ avatar, name, id })}
    >
      {/* Group image */}
      <Image
        source={{ uri: avatar }}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
      {/* Group name */}
      <View style={styles.nameContainer}>
        {/* name */}
        <Text style={styles.name}>{name}</Text>
        {/* id */}
        <Text style={styles.id}>{id}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1B24",
    width: "100%",
    height: 70,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  // Group name and id
  nameContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 10,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  id: {
    fontSize: 14,
    color: "#fff",
  },
});
