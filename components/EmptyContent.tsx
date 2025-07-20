
import { StyleSheet, Text, View, Image } from "react-native";

export function EmptyContent() {
    const image = "https://acmi-website-media-prod.s3.amazonaws.com/media/images/confused_travolta_original_acmi.original.jpg"

    return (
        <View style={styles.container}>
            <Image style={styles.image} src={image}></Image>
            <Text style={styles.title}>Where da kontent</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      borderRadius: 20,
      height: 400,
      margin: 10,
      padding: 10,
      alignItems: 'center',
    },
    image: {
        width: "80%",
        height: "80%"
    },
    titleSection: {
        flex: 1,
        justifyContent: "center",
    },
    title: { 
        color: "#fff",
        fontSize: 30
    }
})