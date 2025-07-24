import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { type ImageSource } from "expo-image";
import { useEffect, useLayoutEffect, useState } from "react";
import { Entypo, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAppDispatch } from "@/redux/hook";

type imageProps = {
  imgSource?: ImageSource;
  disabled?: boolean;
  onSetImg: (imgSource: ImageSource) => void;
};

export default function UploadGroupAvatarComponent({
  imgSource,
  disabled = false,
  onSetImg,
}: imageProps) {
  const dispatch = useAppDispatch();

  // Image picker
  const [image, setImage] = useState<ImageSource | null>(imgSource || null);

  useEffect(() => {
    if (imgSource) {
      setImage(imgSource);
    }
  }, [imgSource]);

  console.log(image);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri });
      onSetImg(asset);
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      onPress={pickImage}
    >
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
      <Text style={styles.description}>Upload Avatar</Text>
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
