import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { type ImageSource } from "expo-image";
import { useLayoutEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type imageProps = {
  imgSource: ImageSource;
};

export default function UploadThumbnailComponent({ imgSource }: imageProps) {

  // Image picker
  const [image, setImage] = useState<ImageSource>(imgSource);
  console.log(image);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {image && <ImageViewer imgSource={image} style={styles.image} />}
      <Entypo name="camera" size={20} color="#fff" />
      <Text style={styles.description}>Upload Thumbnail</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#393F4C",
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
});