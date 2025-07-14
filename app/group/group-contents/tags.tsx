import { FontAwesome6 } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import TagApprovalCardComponent from "@/components/group/TagApprovalCardComponent";
import {
  GroupTag,
  PendingMemberRequest,
  PendingTagRequest,
} from "@/interfaces/groupInterface";
import {
  approveTag,
  getGroupTagsByID,
  getPendingMemberList,
  getPendingTagList,
  rejectTag,
} from "@/redux/slices/groupSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useLocalSearchParams } from "expo-router";
import { SectionGrid } from "react-native-super-grid";
import { GroupRole } from "@/enums/group.enum";
import FeedBlogPreviewSkeleton from "@/components/tabs/feed/FeedBlogPreviewSkeleton";

// Initial mock data
const mockTag1 = {
  tag: "aimachine",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const mockTag2 = {
  tag: "react native",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const mockTag3 = {
  tag: "expo",
  user: {
    id: "1",
    name: "John Doe",
    avatar: "https://picsum.photos/220",
  },
  time: new Date().getTime() - 1000 * 60 * 60 * 24,
};
const initialTags = [mockTag1, mockTag2, mockTag3];

enum TabOptions {
  All = "all",
  NeedApproval = "need-approval",
}
// later remember to add the props
export default function TagsApprovalsPage() {
  const dispatch = useAppDispatch()
  const flatlistRef = useRef<any>();
  const { userCurrentGroupRole } = useAppSelector(state => state.user)
  const { groupID, tagID } = useLocalSearchParams<{
    groupID: string;
    tagID: string;
  }>();

  const [displayTags, setDisplayTags] = useState<
    { id: string; data: GroupTag[] }[]
  >([]);
  const [tagsApproval, setTagsApproval] = useState<PendingTagRequest[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabOptions>(TabOptions.All);
  const [isTagFetching, setIsTagFetching] = useState(false)

  useEffect(() => {
    setIsTagFetching(true)
    if (selectedTab == TabOptions.All) {
      dispatch(getGroupTagsByID({ groupID })).then(res => {
        const list = res.payload as GroupTag[]

        let categorizedTags = {};
        let categorizedTagsList: { id: string; data: GroupTag[] }[] = [];
        const retrievedTags = res.payload as GroupTag[];

        retrievedTags.forEach((tags) => {
          const initial = tags.TagName.charAt(0).toLowerCase();

          if (Object.hasOwn(categorizedTags, initial)) {
            (categorizedTags[initial] as GroupTag[]).push(tags);
          } else {
            categorizedTags[initial] = [tags];
          }
        });

        Object.entries(categorizedTags).forEach((entry) => {
          categorizedTagsList.push({
            id: entry[0] as string,
            data: entry[1] as GroupTag[],
          });
        });
        categorizedTagsList = categorizedTagsList.sort((a, b) => a.id.localeCompare(b.id))
        setDisplayTags(categorizedTagsList);

        setIsTagFetching(false)
      })
    }
    else {
      dispatch(getPendingTagList(groupID)).then(res => {
        const list = res.payload as PendingTagRequest[]
        setTagsApproval(list)
        
        setIsTagFetching(false)
      })
    }
  }, [selectedTab])

  useEffect(() => {
    // Scroll to specific index
    if (tagsApproval != undefined && tagID != "" && tagID != undefined) {
      tagsApproval.forEach((value, index) => {
        if (value._id == tagID) {
          flatlistRef.current.scrollToIndex({ animated: true, index: index });
          return;
        }
      });
    }
  }, [tagsApproval, tagID]);

  const onApprove = (tagId: string, blogIDs: string[]) => {
    dispatch(approveTag({
      groupID: groupID,
      tagIDToApprove: tagId,
      blogIDsContainTag: blogIDs
    })).then(res => {
      if (res.payload === true) {
        console.log("Approve tag with tag-name: ", tagId);
        setTagsApproval((prev) => prev.filter((b) => b._id !== tagId));
      }
    })
  };
  const onReject = (tagId: string, blogIDs: string[]) => {
    dispatch(rejectTag({
      groupID: groupID,
      tagIDToReject: tagId,
      blogIDsContainTag: blogIDs
    })).then(res => {
      if (res.payload === true) {
        console.log("Reject tag with tag-name: ", tagId);
        setTagsApproval((prev) => prev.filter((b) => b._id !== tagId));
      }
    })
  };
  // TODO: Khoa: change the any type to the correct type
  const renderItem = ({ item }: any) => (
    <TagApprovalCardComponent
      {...item}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.optionBar}>
        {/* Ấn nút này thì copy từ cái list cũ qua */}
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.All && styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.All)}
        >
          <Text style={styles.optionText}>
            All Tags
          </Text>
        </TouchableOpacity>
        {/* TODO: ẤN nút này thì copy cái bên approval qua */}
        {(userCurrentGroupRole == GroupRole.Admin || userCurrentGroupRole == GroupRole.Owner) && <TouchableOpacity
          style={[
            styles.optionButton,
            selectedTab === TabOptions.NeedApproval &&
              styles.optionButtonActive,
          ]}
          onPress={() => setSelectedTab(TabOptions.NeedApproval)}
        >
          <Text style={styles.optionText}>Need Approval</Text>
        </TouchableOpacity>}
      </View>
      
      {isTagFetching ? 
        <FeedBlogPreviewSkeleton/> :
        (selectedTab == TabOptions.All ? 
          <SectionGrid
            sections={displayTags}
            itemDimension={150} // Controls column width
            spacing={10} // Spacing between items
            style={styles.gridView}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.tagContainer}>
                <Text style={styles.tag}>#{item.TagName}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.title}>{section.id}</Text>
            )}
            keyExtractor={(item, index) => item.TagName + index}
            // contentContainerStyle={styles.list}
          />
          : <Animated.FlatList
            data={tagsApproval}
            renderItem={renderItem}
            keyExtractor={(item) => item.TagName}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
            itemLayoutAnimation={LinearTransition}
          />
        )
      }
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  textInputContainer: {
    paddingBottom: 20,
  },
  textInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3B40",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  textInput: {
    padding: 10,
    flex: 1,
    color: "#fff",
    fontSize: 18,
  },
  optionBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
    borderRadius: 14,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B4C55",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionButtonActive: {
    backgroundColor: "#5CA0D3", // Active tab color
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
  },
  tagContainer: {
    padding: 10,
    backgroundColor: "#2E3B40",
    borderRadius: 10,
    marginVertical: 5,
    width: 160,
  },
  tag: {
    fontSize: 16,
    color: "#fff",
  },
  gridView: {
    flex: 1,
    paddingBottom: 40,
  },
});
