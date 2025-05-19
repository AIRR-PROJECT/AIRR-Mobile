import { useAppDispatch } from "@/redux/hook";
import { testStream } from "@/redux/slices/careerPathSlice";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function CareerPath() {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(testStream())
  }, [])

  return (
    <View>
      <Text style={{ color: "red" }}>Career Path</Text>
    </View>
  );
}
