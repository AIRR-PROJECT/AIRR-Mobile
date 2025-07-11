import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { GroupTag } from "@/interfaces/groupInterface";
type TagDropdownComponentProps = {
  tags: GroupTag[];
  preSelectedTags?: GroupTag[],
  onPress: (tags: GroupTag[]) => void;
};
export default function TagDropdownComponent({
  tags,
  preSelectedTags,
  onPress,
}: TagDropdownComponentProps) {
  const [selectedTags, setSelectedTags] = useState<GroupTag[]>([]);

  const handleTagToggle = (tag: GroupTag) => {
    if (selectedTags.find((t) => t._id == tag._id) !== undefined) {
      const updated = selectedTags.filter((t) => t._id != tag._id);
      setSelectedTags(updated);
      onPress(updated); // Optional: inform parent that tag was deselected
    } else {
      const updated = [...selectedTags, tag];
      setSelectedTags(updated);
      onPress(updated); // Optional: inform parent that tag was selected
    }
  };

  // Reset selected tags on tags changed
  useEffect(() => {
    if (preSelectedTags) {
      setSelectedTags(preSelectedTags)
    }
    else {
      setSelectedTags([])
    }
  }, [tags, preSelectedTags])

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        data={tags}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TagItem
            tag={item.TagName}
            isChecked={selectedTags.find((t) => t._id == item._id) !== undefined}
            onToggle={() => handleTagToggle(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
        ListFooterComponent={() => <View style={{ height: 60 }} />}
      />
    </View>
  );
}

type TagItemProps = {
  tag: string;
  isChecked: boolean;
  onToggle: () => void;
};

function TagItem({ tag, isChecked, onToggle }: TagItemProps) {
  return (
    <View style={styles.tagContainer}>
      <Checkbox
        value={isChecked}
        onValueChange={onToggle}
        color={isChecked ? "#fff" : "#fff"}
        style={styles.checkbox}
      />
      <View style={styles.tagWrapper}>
        <Text style={styles.tag}># {tag}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  searchBox: {
    backgroundColor: "#2E3B40",
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
  },
  textInput: {
    paddingHorizontal: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    color: "#fff",
    fontSize: 16,
  },
  tagWrapper: {
    backgroundColor: "#2E3B40",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 9,
  },
  checkbox: {
    borderRadius: 5,
    backgroundColor: "#2E3B40",
    borderColor: "#2E3B40",
    width: 30,
    height: 30,
  },
});
