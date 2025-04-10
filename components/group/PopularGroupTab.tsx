import { View, Text, StyleSheet, SectionList } from "react-native";
import PopularGroupCardComponent from "./PopularGroupCardComponent";
import GroupCardComponent from "./GroupCardComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Dimensions } from "react-native";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
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
const mockGroupList = Array(6).fill(mockPopularGroup);
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
const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];
export default function PopularGroupTab() {
  const progress = useSharedValue(0);

  const carouselRef = useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    // Container for the Popular Group Screen
    <View style={styles.container}>
      {/* Section list for each section */}
      <SectionList
        ListHeaderComponent={() => (
          // Header for the Popular Group Screen
          <View
            id="carousel-component"
            dataSet={{ kind: "utils", name: "pagination" }}
            style={{ gap: 10 }}
          >
            <Carousel
              ref={carouselRef}
              autoPlayInterval={2000}
              autoPlay={true}
              data={mockGroupList}
              loop={true}
              width={Dimensions.get("window").width - 30}
              height={Dimensions.get("window").height / 3}
              pagingEnabled={true}
              snapEnabled={true}
              style={{
                width: Dimensions.get("window").width,
              }}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              onProgressChange={progress}
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
            />
            <Pagination.Custom<{ color: string }>
              progress={progress}
              data={defaultDataWith6Colors.map((color) => ({ color }))}
              size={20}
              dotStyle={{
                borderRadius: 16,
                backgroundColor: "#262626",
              }}
              activeDotStyle={{
                borderRadius: 8,
                width: 40,
                height: 30,
                overflow: "hidden",
                backgroundColor: "#f1f1f1",
              }}
              containerStyle={{
                gap: 5,
                marginBottom: 10,
                alignItems: "center",
                height: 10,
              }}
              horizontal
              onPress={onPressPagination}
              customReanimatedStyle={(progress, index, length) => {
                let val = Math.abs(progress - index);
                if (index === 0 && progress > length - 1) {
                  val = Math.abs(progress - length);
                }

                return {
                  transform: [
                    {
                      translateY: interpolate(
                        val,
                        [0, 1],
                        [0, 0],
                        Extrapolation.CLAMP
                      ),
                    },
                  ],
                };
              }}
              // renderItem={(item) => (
              //   <View
              //     style={{
              //       backgroundColor: item.color,
              //       flex: 1,
              //     }}
              //   />
              // )}
            />
          </View>
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
