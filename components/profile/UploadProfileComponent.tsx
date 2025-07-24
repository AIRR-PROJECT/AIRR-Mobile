import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ImageViewer from "../ImageViewer";
import * as ImagePicker from "expo-image-picker";
import { type ImageSource } from "expo-image";
import { useLayoutEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { useNavigation } from "expo-router";
import ButtonGradient from "../ButtonGradient";
import { useForm } from "react-hook-form";
import { UpdateAvatar } from "@/interfaces/userInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateAvatar } from "@/redux/slices/authSlice";

type imageProps = {
  imgSource: ImageSource;
};

export default function UploadProfileComponent({ imgSource }: imageProps) {
  const dispatch = useAppDispatch();
  const { userAvatar } = useAppSelector((state) => state.user);

  const [image, setImage] = useState<ImageSource>(imgSource);

  const pickImage = async () => {
    // Ask for permission first
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri });

      const avatarFormData = new FormData();
      avatarFormData.append("avatar", {
        uri: asset.uri,
        name: asset.fileName ?? "avatar.jpg",
        type: asset.mimeType ?? "image/jpeg",
      });

      dispatch(updateAvatar(avatarFormData));
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      {(userAvatar || image) && (
        <ImageViewer imgSource={userAvatar ?? image} style={styles.image} />
      )}
      <Entypo name="camera" size={40} color="#fff" />
      <ThemedText style={styles.description}>Upload Your Photo</ThemedText>
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
    width: "90%",
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
