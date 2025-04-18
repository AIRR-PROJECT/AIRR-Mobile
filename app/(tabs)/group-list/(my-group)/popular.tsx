import { FlatList, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import GroupCardComponent from "@/components/group/GroupCardComponent";
import { useRouter } from "expo-router";
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
  const route = useRouter();
  const handleCreateGroup = () => {
    route.push("/group/create-group");
  };

  return (
    <View style={styles.container}>
      {/* Temp button to create group */}
      <TouchableOpacity
        style={{
          backgroundColor: "#2E2E2E",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={handleCreateGroup}
        activeOpacity={0.7}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Create Group
        </Text>
      </TouchableOpacity>
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
      />
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
