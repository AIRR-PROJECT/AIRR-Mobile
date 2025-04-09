import { View, Text, StyleSheet, FlatList } from "react-native";
import PopularGroupCardComponent from "./PopularGroupCardComponent";

const mockPopularGroup = {
  name: "Group nameadadadadadasdads",
  avatar: "https://picsum.photos/300",
  numberOfMembers: 350,
  id: "Group IDasdasdsadsadsadsa",
  threeUserAvatar: [
    "https://picsum.photos/350",
    "https://picsum.photos/350",
    "https://picsum.photos/350",
  ],
  description:
    "This group is for React developers of all levels to share knowledge, ask questions, and discuss best practices. Stay updated on the latest features, libraries, and trends in the React ecosystem. Happy coding... Happy coding...Happy coding...Happy coding...Happy coding...",
};
const mockGroupList = Array(25).fill(mockPopularGroup);
export default function PopularGroupScreen() {
  return (
    // Container for the Popular Group Screen
    <View style={styles.container}>
      {/* Row Container for popular group */}
      <FlatList
        data={mockGroupList}
        horizontal={true}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <PopularGroupCardComponent
            name={item.name}
            id={item.id}
            avatar={item.avatar}
            numberOfMembers={item.numberOfMembers}
            threeUserAvatar={item.threeUserAvatar}
            description={item.description}
          />
        )}
        pagingEnabled={true}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
