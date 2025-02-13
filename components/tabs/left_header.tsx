import { Image } from "expo-image";
import { StyleSheet } from "react-native";
const icon_air_tech = require("@/assets/images/logo/logo_icon-air-tech_small.svg");
export default function LeftHeader() {
    return(
        <Image source={icon_air_tech} style={styles.image} contentFit="contain" />
    )
}        

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 15,
    }
})