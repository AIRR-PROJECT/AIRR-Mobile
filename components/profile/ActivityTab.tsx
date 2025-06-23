import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import { Divider } from "@rneui/base";
import { useEffect, useState } from "react";
import { BlogActionHistory } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { BlogActionHistoryComponent } from "./BlogActionHistoryComponent";
import { useAppDispatch } from "@/redux/hook";
import { getUserActivity } from "@/redux/slices/authSlice";
import { UserActivity } from "@/interfaces/userInterface";
import { formatDistanceStrict, formatDistanceToNow, formatRelative } from "date-fns";

const barData = [
  { value: 140, label: "Mon" },
  { value: 200, label: "Tue" },
  { value: 150, label: "Wed" },
  { value: 80, label: "Thu" },
  { value: 250, label: "Fri" },
  { value: 300, label: "Sat" },
  { value: 220, label: "Sun" },
];
const yAxisLabels = ["0 hr", "3 hr", "6 hr"];
function minutesToHoursAndMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0 && h === 0) return "0hr";
  if (m === 0) return `${h}hr`;
  if (h === 0) return `${m}m`;

  return `${h}hr ${m}m`;
}
const data: (string | BlogActionHistory)[] = [
  "Today",
  {
    _id: "1",
    Title: "Blog 1",
    CommentID: null,
    BackgroundURL: "https://picsum.photos/600",
    Action: "Liked",
    Timestamp: "2021-11-12T00:00:00.000Z",
  },
  {
    _id: "2",
    Title: "Blog 2",
    CommentID: "comment1",
    BackgroundURL: "https://picsum.photos/600",
    Action: "Commented",
    Timestamp: "2021-11-12T00:00:00.000Z",
  },
  "Yesterday",
  {
    _id: "3",
    Title: "Blog 3",
    CommentID: null,
    BackgroundURL: "https://picsum.photos/600",
    Action: "Liked",
    Timestamp: "2021-11-12T00:00:00.000Z",
  },
];
export default function ActivityTab() {
  const dispatch = useAppDispatch()

  const [listData, setListData] = useState<(string | BlogActionHistory)[]>([])

  useEffect(() => {
    dispatch(getUserActivity()).then((res) => {
      let activities = res.payload as UserActivity[]

      let data: (string | BlogActionHistory)[] = []
      let currentDay = ""
      activities = activities.sort((a, b) => new Date(b.ActivityDate).getTime() - new Date(a.ActivityDate).getTime())
      activities.map((act) => {
        let distance = formatDistanceStrict(new Date(act.ActivityDate), new Date(), { addSuffix: true })
        let distanceArr = distance.split(' ')
        if (["second", "seconds", "minute", "minutes", "hour", "hours"].indexOf(distanceArr[1]) != -1) {
          distance = "Today"
        }
        if (distanceArr[1] == "day") {
          distance = "Yesterday"
        }
        if (currentDay == "" || currentDay != distance) {
          currentDay = distance
          data.push(currentDay)
        }
        
        const displayAct: BlogActionHistory = {
          _id: act.Blog._id,
          Title: act.Blog.Title,
          CommentID: act.CommentID,
          BackgroundURL: act.Blog.CoverURL,
          Action: act.Type,
          Timestamp: new Date(act.ActivityDate).toString()
        }
        data.push(displayAct)
      })

      setListData(data)
    })
  }, [])

  return (
    <View style={styles.container}>
      {/* Time bar graph */}
      <View style={styles.chartContainer}>
        <LinearGradient
          colors={["#cef0c5", "#a8e063"]}
          style={styles.background}
        />
        <ThemedText style={styles.label}>Average time spent</ThemedText>
        <ThemedText style={styles.averageTime}>4h 35m</ThemedText>
        <Divider
          orientation="vertical"
          style={{ width: "100%", borderColor: "#fff", borderWidth: 1 }}
        />

        <BarChart
          backgroundColor={"transparent"}
          focusedBarConfig={{ color: "green" }}
          focusBarOnPress={true}
          data={barData}
          frontColor={"#fff"}
          barWidth={14}
          height={250}
          maxValue={360}
          barBorderTopRightRadius={6}
          barBorderTopLeftRadius={6}
          isAnimated={true}
          onPress={(value: any) => console.log(value)}
          xAxisLabelTextStyle={{ color: "#000" }}
          xAxisColor={"#fff"}
          yAxisLabelTexts={yAxisLabels}
          yAxisThickness={0}
          noOfSections={2}
          rulesColor={"#fff"}
          rulesThickness={2}
          initialSpacing={25}
          renderTooltip={(item: any) => {
            return (
              <View
                style={{
                  backgroundColor: "#1E1B39",
                  padding: 10,
                  paddingBlock: 5,
                  borderRadius: 10,
                }}
              >
                <ThemedText
                  style={{
                    color: "#fff",
                    alignContent: "center",
                    fontSize: 12,
                  }}
                >
                  {minutesToHoursAndMinutes(item.value)}
                </ThemedText>
              </View>
            );
          }}
          autoCenterTooltip={true}
        />
      </View>

      {/* User Action History */}
      <View style={{width: "100%"}}>
        <FlashList
          data={listData}
          renderItem={({ item }) => {
            if (typeof item === "string") {
              return <ThemedText style={styles.dateHeader}>{item}</ThemedText>;
            }
            return <BlogActionHistoryComponent {...item} />;
          }}
          getItemType={(item) => {
            // To achieve better performance, specify the type based on the item
            return typeof item === "string" ? "sectionHeader" : "row";
          }}
      
          estimatedItemSize={100}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartContainer: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 20,
    color: "#000",
    alignSelf: "flex-start",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  averageTime: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  dateHeader: {
    fontSize: 16,
    color: "#637187",
    alignSelf: "flex-start",
    paddingTop: 20,

  },
});
