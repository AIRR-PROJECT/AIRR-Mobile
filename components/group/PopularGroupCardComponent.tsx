import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
// Can use more attributes to go into the group (passing props)
type PopularGroupCardProps = {
  name: string;
  id: string;
  avatar: string;
  numberOfMembers: number;
  threeUserAvatar: string[];
  description: string;
};

export default function PopularGroupCardComponent({
  name,
  id,
  avatar,
  numberOfMembers,
  threeUserAvatar,
  description,
}: PopularGroupCardProps) {
  const route = useRouter();
  const handleGroupPress = () => {
    // Handle group press
    console.log(`Group pressed: ${name}`);
    route.push(`/group?groupId=${id}`);
  }
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.6} onPress={handleGroupPress}>
      {/* Group image */}
      <View style={styles.bgTop} />
      <Image style={styles.image} source={avatar} />
      {/* name, group id, member */}
      <View style={styles.rowContainer}>
        <View style={styles.nameAndId}>
          {/* name */}
          <Text style={styles.name}>
            {name.length > 15 ? `${name.slice(0, 12)}...` : name}
          </Text>

          {/* Group id  */}
          <Text style={styles.groupId}>
            @{id.length > 15 ? `${id.slice(0, 12)}...` : id}
          </Text>
        </View>
        {/* member */}
        {/* <View style={styles.memberContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={threeUserAvatar[0]}
              style={[styles.memberImage, { marginLeft: 0 }]}
            />
            <Image
              source={threeUserAvatar[1]}
              style={[styles.memberImage, { marginLeft: -5 }]}
            />
            <Image
              source={threeUserAvatar[2]}
              style={[styles.memberImage, { marginLeft: -5 }]}
            />
          </View>
          <Text style={styles.member}>{numberOfMembers}</Text>
        </View> */}
      </View>
      {/* Description */}
      <Text style={styles.description}>
        {description.length > 250
          ? `${description.slice(0, 247)}...`
          : description}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D1F26",
    borderRadius: 30,
    marginHorizontal: 20,
    width: Dimensions.get("window").width - 40,
    padding: 20,
    height: 300,
    borderWidth: 3,
    borderColor: "#B9FF66",
    overflow: "hidden",
  },

  bgTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#B9FF66",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 90,
    borderWidth: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  groupId: {
    fontSize: 14,
    color: "#98AAAE",
  },
  member: {
    fontSize: 16,
    color: "#fff",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameAndId: {
    justifyContent: "center",
    gap: 5,
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberContainer: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    borderColor: "#373B43",
  },
  memberImage: {
    width: 30,
    height: 30,
    borderRadius: 90,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginTop: 20,
    textAlign: "justify",
    lineHeight: 20,
    textOverflow: "ellipsis",
  },
});
