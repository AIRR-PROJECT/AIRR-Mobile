
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Image } from "react-native";

import Svg, { Path, SvgProps } from "react-native-svg";
import ButtonGradient from "./ButtonGradient";
import { router } from "expo-router";

export function EmptyFeed() {
  const onPress = () => {
    router.push("/feed-setting")
  }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personalize Your Experience</Text>
            <Text style={styles.description}>Select tags that match your interests so we can recommend content tailored to you</Text>
            <View style={{ height: 30 }}></View>
            <ButtonGradient label="Start Personalize Your Feed Now!" buttonStyle={{}} onPress={onPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#B9FF66',
      height: 250,
      margin: 20,
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
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    description: { 
        color: "#ffffff80",
        marginTop: 17,
        fontSize: 12.5,
        textAlign: 'center'
    },
    buttonContainer: { 
        color: "#ffffff80",
        marginTop: 17,
        fontSize: 12.5,
        textAlign: 'center'
    }
})