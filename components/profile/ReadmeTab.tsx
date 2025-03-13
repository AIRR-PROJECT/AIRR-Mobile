import { StyleSheet, TouchableOpacity, View,Text, FlatList, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import GradientText from "../GradientText";
import { LinearGradient } from "expo-linear-gradient";
import ReadmeComponent from "./ReadmeComponent";
import { FontAwesome6 } from "@expo/vector-icons";
import TotalBlogComponent from "./TotalBlogComponent";
import { FlashList } from "@shopify/flash-list";

// Get list of tags [max 20]
const tags = Array(20).fill('Frontend');

export default function ReadmeTab() {
  return (
    // Readme
    <View style={styles.container} >
      {/* User Readme */}
      <ReadmeComponent />
      {/* Reading Journey */}
      <View style={styles.rowContainer}>
        <FontAwesome6 name="fire" size={40} color="#FF6E6E" />
        <ThemedText style={styles.readingTitle}>Reading Journey</ThemedText>
      </View>
      {/* Total reading */}
      <View style={styles.totalReadingContainer}>
        <TotalBlogComponent numberOfBlogs={1000} label="Total Blogs Reading"/>
        <TotalBlogComponent numberOfBlogs={50} label="Total Blogs Posting"/>
        <TotalBlogComponent numberOfBlogs={100} label="Total Reading Time"/>
      </View>
      {/* Top tags */}
      <View style={styles.topTagsContainer}> 
        <ThemedText style={styles.topTagsTitle}>Top tags by reading days</ThemedText>
        <FlashList
          data={tags}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <LinearGradient
                colors={["#FF6E6E", "#FF6E6E"]}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  margin: 5,
                }}
              >
                <Text>{item}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          estimatedItemSize={300}
        >
        </FlashList>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  // Styles
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    gap: 20,
  },
  rowContainer : {
    flexDirection: "row",
    alignItems: "center",
  },
  readingTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
  },
  totalReadingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  topTagsContainer: {
  
  },
  topTagsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  }
});
