import VerticalFlow from "@/components/dom-components/ReactFlow/ReactFlow";
import { useAppDispatch } from "@/redux/hook";
import { testStream } from "@/redux/slices/careerPathSlice";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CareerPath() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(testStream());
  }, []);

  return (
    <View style={styles.container}>
      <VerticalFlow dom={{ matchContents: true }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
