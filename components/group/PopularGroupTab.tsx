import { View, Text, StyleSheet, FlatList, SectionList } from "react-native";
import PopularGroupCardComponent from "./PopularGroupCardComponent";
import GroupCardComponent from "./GroupCardComponent";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

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
const DATA = [
  {
    title: "Web",
    data: [
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
    ],
  },
  {
    title: "Mobile",
    data: [
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
    ],
  },
  {
    title: "Devops",
    data: [
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
    ],
  },
  {
    title: "Machine Learning",
    data: [
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
      {
        id: "group name",
        name: "Group name",
        member: 350,
        avatar: "https://picsum.photos/320",
      },
    ],
  },
];
export default function PopularGroupTab() {
  return (
    // Container for the Popular Group Screen
    <View style={styles.container}>
      {/* Section list for each section */}
      <SectionList
        ListHeaderComponent={() => (
          // Header for the Popular Group Screen
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
        )}
        sections={DATA}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.rowContainer, { padding: 20 }]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="keyboard-double-arrow-right"
                size={20}
                color="white"
                style={{ right: -1 }}
              />
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <GroupCardComponent
            name={item.name}
            id={item.id}
            image={item.avatar}
            members={item.member}
            style={{
              paddingHorizontal: 20,
            }}
          />
        )}
        stickySectionHeadersEnabled={false}
 
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
});
