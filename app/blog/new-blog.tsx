import React, { useRef, useMemo, useCallback } from "react";
import { Divider } from "@rneui/base";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import GroupDropdownComponent from "@/components/blog/GroupDropdownComponent";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Feather, FontAwesome } from "@expo/vector-icons";
import UploadProfileComponent from "@/components/profile/UploadProfileComponent";
import UploadThumbnailComponent from "@/components/blog/UploadThumbnailComponent";
const sample_image = require("@/assets/images/blog/upload-image.png");
const mockGroup = {
  name: "Group's name",
  avatar: "https://picsum.photos/300",
  id: "123",
};
const mockGroupList = Array(25).fill(mockGroup);

export default function NewBlog() {
  // Bottom Sheet Refs
  const groupSheetRef = useRef<BottomSheet>(null);
  const tagsSheetRef = useRef<BottomSheet>(null);
  // Variables
  const groupSnapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const tagsSnapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  // Callbacks
  const handleGroupSnapPress = useCallback((index: number) => {
    groupSheetRef.current?.snapToIndex(index);
  }, []);

  const handleGroupSnapClose = useCallback(() => {
    groupSheetRef.current?.close();
  }, []);

  const handleGroupSheetChange = useCallback((index: any) => {
    console.log("handleGroupSheetChange", index);
  }, []);

  const handleTagsSnapPress = useCallback((index: number) => {
    tagsSheetRef.current?.snapToIndex(index);
  }, []);
  const handleTagsSnapClose = useCallback(() => {
    tagsSheetRef.current?.close();
  }, []);
  const handleTagsSheetChange = useCallback((index: any) => {
    console.log("handleTagsSheetChange", index);
  }, []);
  // Render Item
  const renderGroupItem = useCallback(
    ({ item }: { item: typeof mockGroup }) => (
      <GroupDropdownComponent
        avatar={item.avatar}
        name={item.name}
        id={item.id}
      />
    ),
    []
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Group Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>1</Text>
          </View>
          <Text style={styles.title}>Group</Text>
        </View>
        {/* Group Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.heading}
              onPress={() => handleGroupSnapPress(0)}
              activeOpacity={0.8}
            >
              <FontAwesome name="group" size={24} color="#fff" />

              <Text style={styles.headingTitle}>Select Group To Post</Text>
              <IconSymbol
                name="chevron.right"
                size={24}
                weight="medium"
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>2</Text>
          </View>
          <Text style={styles.title}>Tags</Text>
        </View>

        {/* Tags Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.heading}
              onPress={() => handleGroupSnapPress(0)}
              activeOpacity={0.8}
            >
              <Feather name="flag" size={24} color="#fff" />

              <Text style={styles.headingTitle}>Select Tags for blog</Text>
              <IconSymbol
                name="chevron.right"
                size={24}
                weight="medium"
                color={"#fff"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thumbnail Section */}
        <View style={[styles.rowContainer]}>
          <View style={styles.sectionContainer}>
            <Text style={styles.section}>3</Text>
          </View>
          <Text style={styles.title}>Thumbnail</Text>
        </View>

        {/* Thumbnail Selection */}
        <View style={[styles.rowContainer]}>
          <View style={styles.divider} />
          <View style={{gap: 20}}>
            <Text style={styles.smallText}>Show off your vibe! Upload a profile pic to make your account totally you. let the world see your style!</Text>
            <View >
              <UploadThumbnailComponent imgSource={sample_image} />
            </View>

          </View>
        </View>
      </ScrollView>

      {/* Group Selection Bottom Sheet */}
      <BottomSheet
        ref={groupSheetRef}
        index={-1} // Start closed
        snapPoints={groupSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "#212531" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        onChange={handleGroupSheetChange}
      >
        <BottomSheetFlatList
          data={mockGroupList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.groupListContent}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsVerticalScrollIndicator={false}
          
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  sectionContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#B9FF66",
  },
  section: {
    fontSize: 24,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  divider: {
    height: "100%",
    width: 1,
    backgroundColor: "#B9FF66",
    marginHorizontal: 20,
  },
  groupListContent: {
    padding: 16,
    backgroundColor: "#212531",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#212531",
    borderRadius: 90,
    padding: 20,
  },
  headingTitle: {
    fontSize: 16,
    color: "#fff",
  },
  smallText: {
    fontSize: 14,
    color: "#A2B5A5",
  },
});
