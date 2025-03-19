import { StyleSheet, type StyleProp, type ImageStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";

type Props = {
  imgSource: ImageSource;
  style?: StyleProp<ImageStyle>;
  contentFit?: "cover" | "contain";
};

export default function ImageViewer({ imgSource, style, contentFit }: Props) {
  return <Image source={imgSource} style={[styles.image, style]} contentFit={contentFit ?? "contain"}/>;
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: "100%",
    borderRadius: 18,
  },
});
