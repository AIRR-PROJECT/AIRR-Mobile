
import { Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

const images = [
    require('../../assets/images/auth/Card_A.svg'),
    require('../../assets/images/auth/Card_text_1.svg'),
    require('../../assets/images/auth/Card_I.svg'),
    require('../../assets/images/auth/Card_R_1.svg'),
    require('../../assets/images/auth/Card_text_2.svg'),
    require('../../assets/images/auth/Card_R_2.svg'),
]
export default function IconAuth() {
    return (
        <ThemedView style={styles.container}>
            {images.map((image, index) => (
                <Image key={index} source={image}></Image>
            ))}
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: Dimensions.get('window').width / 2 - 20,
        height: Dimensions.get('window').height / 3 - 20,
        margin: 5,
    },
});