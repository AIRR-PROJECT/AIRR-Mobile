import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { GroupDetailInfo } from "@/interfaces/groupInterface";
type DetailGroupCardComponentProps = GroupDetailInfo & {
  posts: number,
  views: number
};

export default function DetailGroupCardComponent({
  Name,
  _id,
  CoverURL,
  Field,
  posts,
  views,
  TotalNumberOfBlogsLikes,
}: DetailGroupCardComponentProps) {
  return (
    <LinearGradient
      colors={["#3E7D7B", "#110F0F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Avatar */}
      <Image style={styles.avatar} source={CoverURL} />
      <View style={{ gap: 5, flex: 1 }}>
        {/* Title */}
        <View style={styles.textWrap}>
          <Text style={styles.title}>{Name}</Text>
        </View>
        <View style={styles.tagAndId}>
          {/* Tag and id */}
          <View style={styles.viewBoxShadow}>
            <FontAwesome6 name="tags" size={20} color="black" />
            <Text style={styles.tag}>{Field.FieldName}</Text>
          </View>
          {/* <Text style={styles.id}>@{_id}</Text> */}
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.number}>{posts}</Text>
            <Text style={styles.detail}>Posts</Text>
          </View>
            <View style={styles.detailContainer}>
                <Text style={styles.number}>{views}</Text>
                <Text style={styles.detail}>Views</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.number}>{TotalNumberOfBlogsLikes}</Text>
                <Text style={styles.detail}>Likes</Text>
            </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    overflow: "hidden",
    gap: 10,
    width: "100%",
    borderRadius: 20,
    
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
    width: 100,
    height: 100,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#303030",
  },
  title: {
    fontSize: 18,
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
    width: "100%",
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
    color: "#fff",
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
  }
});
