import { FlatList, StyleSheet, Text, View } from "react-native";
import GroupCardComponent from "@/components/group/GroupCardComponent";
const mockGroup = {
  image: "https://picsum.photos/200",
  name: "Group Name",
  id: "group-id",
  members: 350,
};
const mockGroups = [
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
  mockGroup,
];
export default function GroupPopularTab() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockGroups}
        renderItem={({ item }) => (
          <GroupCardComponent
            image={item.image}
            name={item.name}
            id={item.id}
            members={item.members}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Add space between items
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
});
