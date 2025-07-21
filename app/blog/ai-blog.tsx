import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Entypo,
} from "@expo/vector-icons";
import { Divider } from "@rneui/themed";
import {BlogTagButton} from "@/components/blog/BlogTagButton";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getAIBlogDetail,
  getBlogComment,
} from "@/redux/slices/blogSlice";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

// TODO: CONSIDER MOVE THIS TO A SEPARATE FILE OR USER ALREADY EXISTING ENUM
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
import { Dimensions } from "react-native";
import AIBlogSectionComponent from "@/components/blog/AIBlogSectionComponent";
import { GroupTag } from "@/interfaces/groupInterface";
const window = Dimensions.get("window");

type SubDetailGroupCardComponentProps = {
  SubHeading: string;
  Details: string;
  Source: string;
  Code?: string;
};
type DetailGroupCardComponentProps = {
  Heading: string;
  Content: SubDetailGroupCardComponentProps[];
};
export default function BlogScreen() {
  const searchParams = useLocalSearchParams<{
    aiBlogId: string;
    userBlogId: string;
    userBlogCommentId: string;
  }>();

  const route = useRouter();
  const dispatch = useAppDispatch();
  const {
    currentAIBlog,
  } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);

  // Shared properties
  const [title, setTitle] = useState(
    "Mock asfvassdfasfwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwef"
  );
  const [description, setDescription] = useState(
    "Mock asfvassdfasfwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwef"
  );
  const [conclusion, setConclusion] = useState(
    "This is concluded. asfvassdfasfwefwefwefwefwefwefwefwefwefwefwefwefwefwefwefwef"
  );
  const [tags, setTags] = useState<GroupTag[]>([])
  // Simulate refresh
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAIBlogDetail(searchParams.aiBlogId));
    dispatch(getBlogComment(searchParams.aiBlogId));
  }, []);

  useEffect(() => {
    if (currentAIBlog) {
      setTitle(currentAIBlog.Title);
      setDescription(currentAIBlog.Description);
      setConclusion(currentAIBlog.Conclusion);
      setTags(currentAIBlog.Tags)
    }
  }, [currentAIBlog]);


  const handleBack = () => {
    route.back();
  };
  const progress = useSharedValue<number>(0);
  // 5 anh?
  const thumbnail = [
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300",
  ];
  const renderItem = ({ item }: { item: string }) => {
    return (
      <Image
        source={{ uri: item }}
        style={{
          width: window.width - 40,
          height: 280,
          borderRadius: 16,
        }}
      />
    );
  };
  const ref = useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      {/* Back button */}
      <View style={[styles.rowContainer, { width: "100%", margin: 20 }]}>
        <TouchableOpacity onPress={handleBack}>
          <Entypo name="chevron-small-left" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Divider
        orientation="vertical"
        width={1}
        style={{ borderColor: "white" }}
      />
      <View style={styles.scrollViewContent}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Divider
            orientation="vertical"
            width={1}
            style={{ borderColor: "#B9FF66" }}
          />
          {/* Actual description */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.description]}>
              <Text
                style={[
                  styles.description,
                  { color: "#B9FF66", fontWeight: "bold" },
                ]}
              >
                Description:{" "}
              </Text>
              {description}
            </Text>
          </View>
        </View>
        {/* Blog content (render from html) */}
      </View>
      {/* Tag here */}
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <BlogTagButton title={tag.TagName} key={tag._id + index} /> // may change key in the future
        ))}
      </View>

      {/* Carousel for background page */}
      <View
        id="carousel-ai-blog-component"
        // dataSet={{ kind: "utils", name: "pagination" }}
        style={{
          paddingHorizontal: 20,
        }}
      >
        <Carousel
          ref={ref}
          autoPlay={true}
          data={thumbnail}
          height={280}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={window.width - 40}
          style={{
            width: window.width - 40,
          }}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          onProgressChange={progress}
          renderItem={renderItem}
        />
        <Pagination.Basic
          progress={progress}
          data={thumbnail}
          size={20}
          dotStyle={{
            borderRadius: 100,
            backgroundColor: "#262626",
          }}
          activeDotStyle={{
            borderRadius: 100,
            overflow: "hidden",
            backgroundColor: "#f1f1f1",
          }}
          containerStyle={[
            {
              gap: 5,
              marginBottom: 10,
              marginTop: 10,
              alignSelf: "center",
              zIndex: 1,
            },
          ]}
          horizontal
          onPress={onPressPagination}
        />
      </View>

      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {/* truyen list data vao day (list.map => ....), nho doi? key khac nhau ko se bi loi */}
        {currentAIBlog && (
          <AIBlogSectionComponent Sections={currentAIBlog.Sections} />
        )}
      </View>
      {/* Conclusion */}
      <View
        style={{
          padding: 20,
          paddingTop: 0,
        }}
      >
        <View style={styles.conclusionContainer}>
          <Text style={styles.conclusionTitle}>Conclusion</Text>
        </View>
        <Text style={styles.conclusionText}>{conclusion}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#1E1E1E",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
    paddingBottom: 100,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  groupImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  groupName: {
    color: "#898989",
    fontSize: 14,
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 10,
    paddingTop: 20,
  },
  scrollViewContent: {
    width: "100%",
    padding: 20,
    paddingVertical: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "justify",
    paddingTop: 20,
  },
  smallText: {
    fontSize: 12,
    color: "#C2C2C2",
  },
  statusContainer: {
    borderRadius: 25,
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 15,
    gap: 5,
  },
  additionalInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    gap: 10,
  },
  description: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
  },
  conclusionContainer: {},
  conclusionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4f82d8",
  },
  conclusionHeading: {
    borderLeftWidth: 4,
    borderLeftColor: "#4f82d8",
    padding: 5,
    marginBottom: 10,
  },
  conclusionText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "justify",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
