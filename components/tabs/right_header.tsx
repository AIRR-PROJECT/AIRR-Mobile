import { Pressable, StyleSheet, Text } from "react-native"
import { View } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
// const feed_settings_icon = require("@/assets/images/feed-settings-icon.svg")
// const streak_icon = require("@/assets/images/streak-icon.svg")
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Divider } from '@rneui/themed';
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
const sample_avatar = require("@/assets/images/sample-avatar.png")

type RightHeaderProps = {
    streak: number;
    avatar?: string;
}
export default function RightHeader({streak, avatar}: RightHeaderProps) {
    const route = useRouter();
    const handleAvatarPress = () => {
        console.log("Avatar Pressed")
        route.push("/profile")
    }
    return(
        <View style={styles.container}>
            {/* feed setting button */}
            <Pressable style={styles.feed_settings_icon}>
                {/* <Image source={feed_settings_icon} style={styles.feed_settings_icon} contentFit="contain" />*/}
                <Ionicons name="filter" size={18} color="#fff"/>
            </Pressable>
            <Divider orientation="vertical" width={1}/>
            {/* streak track */}
            <View style={styles.streak_container}>
                <FontAwesome6 name="bolt" size={18} color='#B9FF66' style={styles.streak_icon}/>
                {/* change light color to black later */}
                <ThemedText style={styles.text} lightColor="#fff" darkColor="#fff">{streak}</ThemedText>
            </View>
            <Divider orientation="vertical" width={1}/>
            {/* Avatar (Cricle Container)*/}
            <Pressable style={styles.avatar_container} onPress={handleAvatarPress}>
                <Image source={avatar ? {uri: avatar} : sample_avatar} style={styles.avatar}/>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",    
    },
    feed_settings_icon: {
        paddingHorizontal: 10,
    },
    divider: {
        paddingHorizontal: 10,
    },
    streak_icon: {
        paddingRight: 10,  
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    streak_container:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    avatar_container: {
        paddingLeft: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
       
    }
})