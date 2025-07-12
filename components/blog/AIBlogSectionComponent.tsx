import { Entypo } from "@expo/vector-icons";
import { sub } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";

type SubDetailGroupCardComponentProps = {
  SubHeading: string;
  Details: string;
  Source: string;
  Code?: string;
};
type DetailGroupCardComponentProps = {
  Heading: string;
  Content: SubDetailGroupCardComponentProps[];
};
export default function AIBlogSectionComponent({
  Heading,
  Content,
}: DetailGroupCardComponentProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2c5364", "#1E1E1E"]} // dark blue to light blue to dark
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headingContainer}
      >
        <Text style={styles.heading}>{Heading}</Text>
      </LinearGradient>

      {Content.map((item, index) => (
        <View key={index} style={styles.contentContainer}>
          <View style={styles.subHeadingContainer}>
            <Text style={styles.subHeading}>{item.SubHeading}</Text>
          </View>
          <Text style={styles.details}>{item.Details}</Text>
          {item.Code && (
            <View style={styles.codeContainer}>
              <Text style={styles.code}>{item.Code}</Text>
            </View>
          )}
          <View style={styles.sourceContainer}>
            <Entypo name="link" size={24} color="#84b0c1" />
            <Text style={styles.sourceText}>Source: </Text>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={styles.source}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.Source}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingContainer: {
    marginBottom: 10,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "justify",
    color: "#90CDF4",
  },
  contentContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4f82d8",
  },
  subHeadingContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#4f82d8",
    padding: 5,
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    marginBottom: 10,
    color: "#000",
    textAlign: "justify",
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  sourceText: {
    fontSize: 14,
    color: "#4882d8",
    marginRight: 5,
  },
  source: {
    fontSize: 12,
    color: "#69abc5ff",
    textDecorationLine: "underline",
  },
  codeContainer: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  code: {
    fontFamily: "Courier New",
    fontSize: 12,
    color: "#5D92D2",
    lineHeight: 18,
  },
});
