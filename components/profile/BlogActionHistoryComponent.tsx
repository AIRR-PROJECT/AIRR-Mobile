import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { BlogActionHistory } from "@/interfaces/blogInterface";
import { ThemedText } from "../ThemedText";
import { formatISODate } from "@/utils/dateConvert";
const tempImage = "https://picsum.photos/500";




export function BlogActionHistoryComponent({
  _id,
  Title,
  BackgroundURL,
  Action,
  Timestamp,
}: BlogActionHistory) {
  return (
    <TouchableOpacity style={styles.container}>
      {/* Temp Image (ask later if it needed or not)*/}
      {/* <Image source={{ uri: tempImage }} style={{position: "absolute", right:50}} /> */}
 
      {/* Blog Image */}
      <Image source={{ uri: BackgroundURL }} style={styles.imageContainer} />
      {/* Blog Title, And Action*/}
      <View style={styles.colContainer}>
        <ThemedText style={styles.title}>{Title}</ThemedText>
        <ThemedText style={styles.action}>{Action}, {formatISODate(Timestamp)}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {

    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingVertical: 20
  },
  colContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
    gap: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  action: {
    fontSize: 16,
    color: "#908C8C",
    
  },

});
