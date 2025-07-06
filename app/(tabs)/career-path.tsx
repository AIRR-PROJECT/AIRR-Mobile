import VerticalFlow from "@/components/dom-components/ReactFlow/ReactFlow";
import { ExternalLink } from "@/components/ExternalLink";
import { useAppDispatch } from "@/redux/hook";
import { testStream } from "@/redux/slices/careerPathSlice";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const webUrl = process.env.CAREER_PATH_WEB_URL || "";
export default function CareerPath() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(testStream());
  }, []);

  return (
    <View style={styles.container}>
      {/* <VerticalFlow dom={{ matchContents: true }} /> */}
      {/* This workflow is on web only */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.text}>Career Path is currently only available on web.</Text>
        <ExternalLink href={webUrl}>
          <Text style={styles.link}>
            Open in browser to view the career path workflow.
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    margin: 10,
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});
