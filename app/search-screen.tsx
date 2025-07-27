import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import {
  SearchBlogComponent,
  SearchGroupComponent,
  // SearchUserComponent,
} from "../components/left_header/SearchComponent";
import { useAppDispatch } from "@/redux/hook";
import { searchFromSearchBar } from "@/redux/slices/feedSlice";
import { SearchBarResult } from "@/interfaces/feedInterface";
import { UserBlog } from "@/interfaces/blogInterface";
import { Group } from "@/interfaces/groupInterface";

type BlogItem = {
  type: "blog";
  blogItem: UserBlog;
};

type GroupItem = {
  type: "group";
  groupItem: Group;
};

type SearchItem = BlogItem | GroupItem;

type Section = {
  title: string;
  data: SearchItem[];
};

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const timerIdRef = useRef<NodeJS.Timeout>();

  const handleBack = () => {
    router.back();
  };

  const handleSearchSubmit = () => {
    clearTimeout(timerIdRef.current);

    dispatch(searchFromSearchBar(searchText)).then((res) => {
      const data = res.payload as SearchBarResult;

      let result: SearchItem[] = [];
      data.searchBlogs.forEach((i) => {
        result.push({
          type: "blog",
          blogItem: i,
        });
      });
      data.searchGroups.forEach((i) => {
        result.push({
          type: "group",
          groupItem: i,
        });
      });
      setItems(result);
    });
  };

  useEffect(() => {
    timerIdRef.current = setTimeout(() => {
      dispatch(searchFromSearchBar(searchText)).then((res) => {
        const data = res.payload as SearchBarResult;

        let result: SearchItem[] = [];
        data.searchBlogs.forEach((i) => {
          result.push({
            type: "blog",
            blogItem: i,
          });
        });
        data.searchGroups.forEach((i) => {
          result.push({
            type: "group",
            groupItem: i,
          });
        });
        setItems(result);
      });
    }, 1500);

    return () => {
      clearTimeout(timerIdRef.current);
    };
  }, [searchText]);

  useEffect(() => {
    const filtered = items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    const grouped: Record<string, SearchItem[]> = {
      Blogs: [],
      Groups: [],
    };

    filtered.forEach((item) => {
      if (item.type === "blog") grouped["Blogs"].push(item);
      else if (item.type === "group") grouped["Groups"].push(item);
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
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
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
  );
}

const styles = StyleSheet.create({
  screenContainer: {
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