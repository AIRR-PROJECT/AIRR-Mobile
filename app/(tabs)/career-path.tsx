import VerticalFlow from "@/components/dom-components/ReactFlow/ReactFlow";
import { ExternalLink } from "@/components/ExternalLink";
import { useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function CareerPath() {
  const webUrl = "https://github.com/SystemErrorWang/White-box-Cartoonization";
  const linkRef = useRef(null);

  return (
    <View style={styles.container}>
      {/* <VerticalFlow dom={{ matchContents: true }} /> */}
      {/* This workflow is on web only */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.text}>
          Career Path is currently only available on web.
        </Text>
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
