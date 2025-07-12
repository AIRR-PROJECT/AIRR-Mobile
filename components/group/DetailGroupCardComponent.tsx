import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import { GroupDetailInfo } from "@/interfaces/groupInterface";
import { GroupRole } from "@/enums/group.enum";

type DetailGroupCardComponentProps = GroupDetailInfo & {
  userRole: GroupRole;
  moreOptionPress: (index: number) => void;
};

export default function DetailGroupCardComponent({
  Name,
  _id,
  CoverURL,
  Field,
  TotalNumberOfBlogsLikes,
  NumberOfMembers,
  NumberOfTag,
  UserStatus,
  userRole = GroupRole.Member,
  moreOptionPress,
}: DetailGroupCardComponentProps) {
  return (
    <LinearGradient
      colors={["#3E7D7B", "#1A3B3A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Avatar */}
      <View style={styles.groupMainDetail}>
        <Image style={styles.avatar} source={CoverURL} />
        <View style={{ paddingLeft: 5, gap: 5, width: "70%" }}>
          {/* Title */}
          <View style={styles.textWrap}>
            <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">{Name}</Text>
          </View>
          <View style={styles.tagAndId}>
            {/* Tag and id */}
            <View style={styles.viewBoxShadow}>
              <FontAwesome6 name="tags" size={20} color="black" />
              <Text style={styles.tag}>{Field.FieldName}</Text>
            </View>
            {/* <Text style={styles.id}>@{_id}</Text> */}
          </View>
        </View>
        {/* More button */}
        {(userRole == GroupRole.Admin || userRole == GroupRole.Owner) && UserStatus == "Active" && (
          <TouchableOpacity
            style={{ position: "absolute", right: -10, top: 0, zIndex: 1 }}
            activeOpacity={0.6}
            onPress={() => moreOptionPress(0)}
          >
            <Feather name="more-vertical" size={24} color="#B9FF66" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.detailContainer}>
          <AntDesign name="tago" size={12} color="#c8fd7c" />
          <Text style={styles.number}>{NumberOfTag}</Text>
          <Text style={styles.detail}>Tags </Text>
        </View>
        <View style={styles.detailContainer}>
          <AntDesign name="team" size={12} color="#c8fd7c" />
          <Text style={styles.number}>{NumberOfMembers}</Text>
          <Text style={styles.detail}>Members </Text>
        </View>
        <View style={styles.detailContainer}>
          <AntDesign name="hearto" size={12} color="#c8fd7c" />
          <Text style={styles.number}>{TotalNumberOfBlogsLikes}</Text>
          <Text style={styles.detail}>Likes</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    overflow: "hidden",
    gap: 10,
    width: "100%",
    borderRadius: 20,
    flex: 1,
  },
  groupMainDetail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    flex: 1,
    width: "100%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bg: {
    flex: 1,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#303030",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  viewBoxShadow: {
    boxShadow: "0px 2px 0px 0px #B9FF66",
    borderRadius: 13,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 2,
    gap: 5,
    borderWidth: 1,
  },
  tag: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
  textWrap: {
    justifyContent: "space-between",
    textAlign: "left",
  },
  id: {
    fontSize: 10,
    color: "#fff",
  },
  tagAndId: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  number: {
    fontSize: 14,
    color: "#c8fd7c",
    fontWeight: "bold",
  },
  detail: {
    fontSize: 10,
    color: "#fff",
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
});
