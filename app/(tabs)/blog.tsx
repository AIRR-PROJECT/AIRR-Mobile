import { View, Text, StyleSheet, useWindowDimensions, BackHandler } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import RenderHTML from "react-native-render-html";
import { use } from "i18next";
import { useEffect } from "react";
import { ScrollView } from "react-native-collapsible-tab-view";
const mockHtml = `
<p class="ql-align-center">
<strong class="ql-size-large">
<u>Editor test with new text editor</u>
</strong>
</p>`
;

const mockGroup = {
  name: "Group Name",
  image: "https://picsum.photos/200",
}
export default function BlogScreen() {
  const { width } = useWindowDimensions();
  const {fromTabs} = useLocalSearchParams<{fromTabs?: string }>();
  const route = useRouter();
  if (fromTabs) {
    useEffect(() => {
      const backAction = () => {
        route.replace('/(tabs)/my-feed');
        return true;
      }
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);  
      return () => backHandler.remove();
    }, []);
  
  }
  return (
    <View style={styles.container}>
      {/* Group Component */}
      <View style={styles.groupContainer}>
        <Image source={mockGroup.image} style={styles.groupImage}/>
        <Text>{mockGroup.name}</Text>
      </View>
      {/* User Component */}
      
      {/* Title */}
      {/* Date and number of comment */}
      {/* Description */}
      {/* List of tags */}
      {/* Blog content (render from html) */}
      <RenderHTML
        source={{
          html: mockHtml,
            
        }}
        baseStyle={{color: "white"}}
        contentWidth={width}
        
      />
      {/* Like, Dislike, Comment, Markbook */}
      {/* Write comment button */}
      {/* Other user comments */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
   
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  groupName: {
    color: "white",
    fontSize: 20,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
  }
});
