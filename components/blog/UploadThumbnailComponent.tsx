import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { type ImageSource } from "expo-image";
import { useEffect, useLayoutEffect, useState } from "react";
import { Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type imageProps = {
  imgSource?: ImageSource;
  onSetImg: (imgSource: ImageSource) => void;
};

export default function UploadThumbnailComponent({
  imgSource,
  onSetImg,
}: imageProps) {
  // Image picker
  const [image, setImage] = useState<ImageSource | null>(imgSource || null);
  // console.log(image);
  const pickImage = async () => {
  // Request permission to access media library
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Denied",
      "You need to grant media library access to upload an image."
    );
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    // asset.fileSize is available in some environments, otherwise fetch it
    let fileSize = asset.fileSize;
    if (fileSize === undefined && asset.uri) {
      try {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        fileSize = blob.size;
      } catch (e) {
        fileSize = 0;
      }
    }
    if (fileSize && fileSize > 500 * 1024) {
      Alert.alert("Image too large", "Please select an image smaller than 500KB.");
      return;
    }
    setImage({ uri: asset.uri });
    onSetImg(asset);
  }
};

  useEffect(() => {
    setImage(imgSource ?? null);
  }, [imgSource]);

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {image != null ? (
        <ImageViewer
          imgSource={image}
          style={styles.image}
          contentFit="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <SimpleLineIcons name="cloud-upload" size={50} color="#8D98AA" />
          <Text style={styles.tooltip}>Upload</Text>
        </View>
      )}
      <Entypo name="camera" size={20} color="#fff" />
      <Text style={styles.description} >Upload Thumbnail</Text>
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
    flex: 1,
  },
  tooltip: {
    color: "#8D98AA",
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
  },
});
