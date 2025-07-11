import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Touchable,
  TouchableOpacity,
} from "react-native";
import PopularGroupCardComponent from "./PopularGroupCardComponent";
import GroupCardComponent from "./GroupCardComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { SetStateAction, useEffect, useRef, useState } from "react";
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
import { Group, PopularGroups } from "@/interfaces/groupInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getPopularGroups } from "@/redux/slices/groupSlice";
const mockPopularGroup: Group = {
  Name: "Group nameadadadadadasdads",
  Owner: {
    _id: "1",
    Username: "Owner",
    AvatarURL: "https://picsum.photos/300",
  },
  NumberOfMembers: 350,
  _id: "Group IDasdasdsadsadsadsa",
  threeUserAvatar: [
    "https://picsum.photos/350",
    "https://picsum.photos/350",
    "https://picsum.photos/350",
  ],
  Description:
    "This group is for React developers of all levels to share knowledge, ask questions, and discuss best practices. Stay updated on the latest features, libraries, and trends in the React ecosystem. Happy coding... Happy coding...Happy coding...Happy coding...Happy coding...",
  FieldName: "",
  CoverURL: "",
  Tags: [],
  avatar: "",
  members: [],
  timestamp: "",
};
const mockGroupList = Array(10).fill(mockPopularGroup);
const mockPaginationList = Array(10).fill("");
const MOCKDATA: { title: string; data: Group[] }[] = [
  {
    title: "Web",
    data: [
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
    ],
  },
  {
    title: "Mobile",
    data: [
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
    ],
  },
  {
    title: "Devops",
    data: [
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
    ],
  },
  {
    title: "Machine Learning",
    data: [
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
      {
        _id: "group name",
        Name: "Group name",
        Description: "",
        Owner: {
          _id: "owner",
          Username: "Owner",
          AvatarURL: "https://picsum.photos/320",
        },
        NumberOfMembers: 350,
        FieldName: "",
        CoverURL: "",
        Tags: [],
        avatar: "",
        members: [],
        timestamp: "",
        FieldID: "",
        IsAdminOrOwner: false
      },
    ],
  },
];
// const defaultDataWith6Colors = [
//   "#B0604D",
//   "#899F9C",
//   "#B3C680",
//   "#5C6265",
//   "#F5D399",
//   "#F1F1F1",
// ];
type PopularGroupTabProps = {
  onPressSectionHeader?: (title: string) => void;
};
export default function PopularGroupTab({
  onPressSectionHeader,
}: PopularGroupTabProps) {
  const dispatch = useAppDispatch();
  const { popularGroupsHorizontal, popularGroupsVertical } = useAppSelector(
    (state) => state.group
  );
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

  const [groupData, setGroupData] = useState<
    { title: string; data: Group[] }[]
  >([]);

  useEffect(() => {
    dispatch(getPopularGroups());
  }, []);

  useEffect(() => {
    // console.log(popularGroupsVertical)
    if (popularGroupsVertical) {
      let data: SetStateAction<{ title: string; data: Group[] }[]> = [];
      popularGroupsVertical.map((fieldData) => {
        data.push({
          title: fieldData.fieldName,
          data: fieldData.groups,
        });
      });
      setGroupData(data);
    }
  }, [popularGroupsVertical]);

  useEffect(() => {
    // console.log(popularGroupsHorizontal)
  }, [popularGroupsHorizontal]);
  const handlePressSectionHeader = (title: string) => {
    // Handle section header press
    console.log(`Section header pressed: ${title}`);
    if (onPressSectionHeader) {
      onPressSectionHeader(title);
    }
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
            // dataSet={{ kind: "utils", name: "pagination" }}
            style={{ gap: 10 }}
          >
            <Carousel
              ref={carouselRef}
              autoPlayInterval={2000}
              autoPlay={true}
              data={popularGroupsHorizontal ?? mockGroupList}
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
                  name={item.Name}
                  id={item._id}
                  owner_username={item.Owner.Username}
                  avatar={item.CoverURL}
                  numberOfMembers={item.NumberOfMembers}
                  threeUserAvatar={[]}
                  description={item.Description}
                />
              )}
            />
          </View>
        )}
        sections={groupData ?? MOCKDATA}
        keyExtractor={(item, index) => item._id + index}
        renderSectionHeader={({ section: { title } }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => handlePressSectionHeader(title)}
          >
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
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <GroupCardComponent
            name={item.Name}
            id={item._id}
            image={item.CoverURL}
            members={item.NumberOfMembers}
            style={{
              paddingHorizontal: 20,
            }}
            isJoined={false}
          />
        )}
        style={{ marginBottom: 20 }}
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
