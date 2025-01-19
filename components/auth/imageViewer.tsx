import { StyleSheet } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
  imgSource: ImageSource;
};

export default function ImageViewer({ imgSource }: Props) {
  return <Image source={imgSource} style={styles.image} contentFit="contain"/>;
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: "100%",
    borderRadius: 18,
    
  },
});
