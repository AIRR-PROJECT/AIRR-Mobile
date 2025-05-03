import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { type ImageSource } from "expo-image";
import { useLayoutEffect, useState } from "react";
import { Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type imageProps = {
  imgSource?: ImageSource;
  onSetImg: (imgSource: ImageSource) => void
};

export default function UploadThumbnailComponent({ imgSource, onSetImg }: imageProps) {
  // Image picker
  const [image, setImage] = useState<ImageSource | null>(imgSource || null);
  console.log(image);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
      onSetImg(result.assets[0])
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {image != null ? (
        <ImageViewer imgSource={image} style={styles.image} contentFit="cover"/>
      ) : (
        <View style={styles.placeholder}>
          <SimpleLineIcons name="cloud-upload" size={50} color="#8D98AA" />
          <Text style={styles.tooltip}>Upload</Text>
        </View>
      )}
      <Entypo name="camera" size={20} color="#fff" />
      <Text style={styles.description}>Upload Thumbnail</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#212531",
    borderRadius: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
    width: "100%",
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  description: {
    color: "#fff",
  },
  tooltip: {
    color: "#8D98AA"
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#393F4C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8D98AA",
    borderStyle: "dashed",
    padding: 20,
    marginRight: 10,
  }
});
