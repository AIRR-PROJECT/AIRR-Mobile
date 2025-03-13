import type { PropsWithChildren, ReactElement } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedScrollHandler,
  Extrapolation,
} from "react-native-reanimated";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
  hasHeader?: boolean;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: { dark: string; light: string };
}>;

export default function ParallaxFlatList({
  children,
  headerImage,
  headerBackgroundColor = { light: "#A1CEDC", dark: "#1D3D47" },
  hasHeader,
  style,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
  const scrollOffset = useSharedValue(0);
  const bottom = useBottomTabOverflow();

  // Scroll Handler
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Header Animation
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1], Extrapolation.CLAMP,),
        },
      ],
    };
  });

  // Convert children to FlatList-compatible items
  const data = Array.isArray(children) ? children : [children];

  return (
    // change light to #fff later
    <ThemedView
      style={[
        styles.container,
        style,
        { backgroundColor: colorScheme === "light" ? "#1E1E1E" : "#000" }, // Fixed background color
      ]}
    >
      <Animated.FlatList
        ref={scrollRef}
        data={data} // Use the converted array
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ThemedView style={styles.content}>{item}</ThemedView>}
        scrollEventThrottle={16}
        onScroll={onScroll} // Attach animated scroll handler
        scrollIndicatorInsets={{ bottom }}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: bottom, }}
        ListHeaderComponent={
          hasHeader ? (
            <Animated.View
              style={[
                styles.header,
                { backgroundColor: headerBackgroundColor[colorScheme] },
                headerAnimatedStyle,
              ]}
            >
              {headerImage}
            </Animated.View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 25,
    gap: 16,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
});
