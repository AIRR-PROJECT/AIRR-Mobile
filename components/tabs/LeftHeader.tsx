import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  SectionList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  SearchBlogComponent,
  SearchGroupComponent,
  SearchUserComponent,
} from "../left_header/SearchComponent";
import { loremIpsum } from "lorem-ipsum";
import { SearchBarBlog } from "@/interfaces/blogInterface";
import { SearchBarGroup } from "@/interfaces/groupInterface";
import { useAppDispatch } from "@/redux/hook";
import { searchFromSearchBar } from "@/redux/slices/feedSlice";
import { SearchBarResult } from "@/interfaces/feedInterface";

// 1. Define types
type BlogItem = {
  type: "blog";
  blogItem: SearchBarBlog
};

type GroupItem = {
  type: "group";
  groupItem: SearchBarGroup
};

type UserItem = {
  type: "user";
  avatar: string;
  name: string;
};

type SearchItem = BlogItem | GroupItem;

type Section = {
  title: string;
  data: SearchItem[];
};

export default function LeftHeader() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleSearchPress = () => {
    console.log("Search button pressed");
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleSearchPress}
        style={styles.searchBarButton}
      >
        <FontAwesome name="search" size={20} color="#B9FF66" />
        <Text style={styles.searchBarText}>Search ...</Text>
      </TouchableOpacity>
      <SearchScreen visible={visible} onClose={() => setVisible(false)} />
    </View>
  );
}

function SearchScreen({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch()

  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // 2. Simulate fetching mixed data
  useEffect(() => {
    const fetchData = async () => {
      // Simulated API response
      const response: SearchItem[] = [
        {
          type: "blog",
          blogItem: {
            _id: "",
            Title: "AirTech One",
            Description: loremIpsum({ count: 100 }),
            Owner: {
              _id: "",
              AvatarURL: "https://picsum.photos/200/300",
              Username: "",
              Name: "",
              CreateDate: ""
            }
          } 
          // thumbnail: "https://picsum.photos/200/300",
          // title: "AirTech One",
          // description: loremIpsum({ count: 100 }),
        },
        {
          type: "group",
          groupItem: {
            _id: "",
            Name: "AirTech Group",
            Description: "This is a group about AirTech",
            CoverURL: "https://picsum.photos/200/500"
          }
          // image: "https://picsum.photos/200/500",
          // name: "AirTech Group",
          // description: "This is a group about AirTech",
          // numberOfMembers: 100,
        },
        // {
        //   type: "user",
        //   avatar: "https://picsum.photos/200/400",
        //   name: "John Doe",
        // },
        {
          type: "blog",
          blogItem: {
            _id: "",
            Title: "DevLog",
            Description: "Development journey",
            Owner: {
              _id: "",
              AvatarURL: "https://picsum.photos/300/300",
              Username: "",
              Name: "",
              CreateDate: ""
            }
          } 
          // thumbnail: "https://picsum.photos/300/300",
          // title: "DevLog",
          // description: "Development journey",
        },
        {
          type: "group",
          groupItem: {
            _id: "",
            Name: "Tech Enthusiasts",
            Description: loremIpsum({ count: 50 }),
            CoverURL: "https://picsum.photos/300/500"
          }
          // image: "https://picsum.photos/300/500",
          // name: "Tech Enthusiasts",
          // description: loremIpsum({ count: 50 }),
          // numberOfMembers: 200,
        },
        // {
        //   type: "user",
        //   avatar: "https://picsum.photos/400/400",
        //   name: "Jane Smith",
        // },
      ];

      // setItems(response);
    };

    fetchData();
  }, []);

  const handleSearchSubmit  = () => {
    if (searchText.length > 0) {
      dispatch(searchFromSearchBar(searchText)).then((res) => {
        const data = res.payload as SearchBarResult

        let result: SearchItem[] = []
        data.searchBlogs.forEach((i) => {
          result.push({
            type: "blog",
            blogItem: i
          })
        })
        data.searchGroups.forEach((i) => {
          result.push({
            type: "group",
            groupItem: i
          })
        })
        setItems(result)
      })
    }
  }

  // 3. Group into sections when items or searchText changes
  // Change the search logic to filter based on searchText
  useEffect(() => {
    const filtered = items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    const grouped: Record<string, SearchItem[]> = {
      Blogs: [],
      Groups: [],
      Users: [],
    };

    filtered.forEach((item) => {
      if (item.type === "blog") grouped["Blogs"].push(item);
      else if (item.type === "group") grouped["Groups"].push(item);
      // else if (item.type === "user") grouped["Users"].push(item);
    });

    const result: Section[] = Object.entries(grouped)
      .filter(([_, data]) => data.length > 0)
      .map(([title, data]) => ({ title, data }));

    setSections(result);
  }, [items, searchText]);

  const renderItem = ({ item }: { item: SearchItem }) => {
    switch (item.type) {
      case "blog":
        return <SearchBlogComponent {...item.blogItem} />;
      case "group":
        return <SearchGroupComponent {...item.groupItem} />;
      // case "user":
      //   return <SearchUserComponent {...item} />;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="arrowleft" size={24} color="#B9FF66" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 16,
          }}
        >
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.type + index}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeader}>{title}</Text>
              </View>
            )}
            contentContainerStyle={styles.resultsContainer}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: Dimensions.get("window").width / 2.5,
  },
  searchBarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#B9FF66",
  },
  searchBarText: {
    color: "#B9FF66",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "#1E1E1E",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#232323",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    color: "#B9FF66",
    borderColor: "#B9FF66",
    borderWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  resultsContainer: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    paddingVertical: 8,
  },
  sectionHeaderContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#a1f7b6",
    borderRadius: 8,
  },
});
