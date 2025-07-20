import VerticalFlow from "@/components/dom-components/ReactFlow/ReactFlow";
import { ExternalLink } from "@/components/ExternalLink";
import CareerPathSuggestion from "@/components/tabs/CareerPathSuggestion";
import { useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function CareerPath() {
  // TODO: CHANGE URL
  const webUrl = "https://github.com/SystemErrorWang/White-box-Cartoonization";

  return (
    <View style={styles.container}>
      <CareerPathSuggestion />
      {/* <View style={styles.centerContent}>
        <Text style={styles.title}>Career Path</Text>
        <Text style={styles.text}>
          This feature is currently only available on the web version.
        </Text>
        <ExternalLink href={webUrl}>
          <Text style={styles.link}>
            Open in browser to view the career path workflow.
          </Text>
        </ExternalLink>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.85,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B9FF66",
    marginBottom: 12,
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 18,
    textAlign: "center",
    lineHeight: 22,
  },
  link: {
    color: "#1E90FF",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
  },
});