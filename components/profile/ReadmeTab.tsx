import { StyleSheet, TouchableOpacity, View,Text, FlatList, ScrollView, ToastAndroid } from "react-native";
import { ThemedText } from "../ThemedText";
import GradientText from "../GradientText";
import { LinearGradient } from "expo-linear-gradient";
import ReadmeComponent from "./ReadmeComponent";
import { FontAwesome6 } from "@expo/vector-icons";
import TotalBlogComponent from "./TotalBlogComponent";
import { FlashList } from "@shopify/flash-list";
import ProfileTabButton from "./ProfileTabButton";
import * as Clipboard from 'expo-clipboard';
// Get list of tags [max 10]
const tags = Array(10).fill('Frontend');
const chunkedTags = chunkArray(tags, 5);
const mockLink = "https://dly.to/dfdsc";
export default function ReadmeTab() {
  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(mockLink);

    ToastAndroid.show("Link copied to clipboard", ToastAndroid.SHORT);
  }
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
          numColumns={5}
          renderItem={({ item }) => (
            <ProfileTabButton title={item} onPress={() => {}} />
          )}
          estimatedItemSize={50}
        >
        </FlashList>
      </View>
      {/* Invite friends */}
      <ThemedText style={styles.inviteFriendTitle}>Invite Friends</ThemedText>
      <ThemedText style={styles.inviteFriendText}>Invite other developers to discover how easy it is to stay updated with daily.dev</ThemedText>
      {/* Link */}
      <View style={[styles.linkContainer,]}>
          <ThemedText style={styles.linkText}>{mockLink}</ThemedText>
          <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyLink}>
            <ThemedText style={styles.copyLinkText}>Copy Link</ThemedText>
          </TouchableOpacity>
      </View>
    </View>
  );
}

function chunkArray(array: any[], size: number): any[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
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
    borderWidth: 1,
    borderColor: "#393F4C",
    padding: 10,
    borderRadius: 20,
  },
  tagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
   
  },
  topTagsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 10,
  },
  inviteFriendTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  
  },
  inviteFriendText: {
    fontSize: 16,
    color: "#fff",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1F1F63",
    padding: 20,
    borderRadius: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
  },
  copyLinkButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius : 20,
  
  },
  copyLinkText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});
