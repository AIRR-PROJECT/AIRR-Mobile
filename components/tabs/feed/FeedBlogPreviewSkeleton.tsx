import SkeletonLoading from "expo-skeleton-loading";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export default function FeedBlogPreviewSkeleton() {
    return (
        <SkeletonLoading background={"#adadad"} highlight={"#ffffff"}>
            <View style={styles.container}>
                <View style={styles.titleSection}>
                    <View style={styles.title} />
                </View>
            </View>
        </SkeletonLoading>
    )
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 40,
      overflow: "hidden",
      borderWidth: 2,
      width: "100%",
      height: 400,
      backgroundColor: "#adadad"
    },
    titleSection: {
        flex: 1,
        justifyContent: "center",
    },
    title: { 
        backgroundColor: "#adadad", width: "50%", height: 24, marginBottom: 3, borderRadius: 5 
    }
})