import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import { Divider } from "@rneui/base";
import { act, useEffect, useState } from "react";
import { BlogActionHistory } from "@/interfaces/blogInterface";
import { FlashList } from "@shopify/flash-list";
import { BlogActionHistoryComponent } from "./BlogActionHistoryComponent";
import { useAppDispatch } from "@/redux/hook";
import { getUserActivity } from "@/redux/slices/authSlice";
import { UserActivity } from "@/interfaces/userInterface";
import { formatDistanceStrict, formatDistanceToNow, formatRelative } from "date-fns";
import FeedBlogPreviewSkeleton from "../tabs/feed/FeedBlogPreviewSkeleton";

type ChartType = {
  value: number,
  label: string
}

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
  const [chartData, setChartData] = useState<ChartType[]>([])
  const [timeSumText, setTimeSumText] = useState("0m")
  const [isListFetching, setIsListFetching] = useState(false)

  useEffect(() => {
    setIsListFetching(true)
    dispatch(getUserActivity()).then((res) => {
      let activities = res.payload as UserActivity[]

      if (activities.length == 0) {
        setIsListFetching(false)
        return
      }

      let monSum = 0
      let tueSum = 0
      let wedSum = 0
      let thuSum = 0
      let friSum = 0
      let satSum = 0
      let sunSum = 0

      let listData: (string | BlogActionHistory)[] = []
      let currentDay = ""
      activities = activities.sort((a, b) => new Date(b.ActivityDate).getTime() - new Date(a.ActivityDate).getTime())
      activities.map((act) => {
        // Bar chart data
        const day = new Date(act.ActivityDate).getDay()
        switch (day) {
          case 0:
            sunSum += 5
            break
          case 1:
            monSum += 5
            break
          case 2:
            tueSum += 5
            break
          case 3:
            wedSum += 5
            break
          case 4:
            thuSum += 5
            break
          case 5:
            friSum += 5
            break
          case 6:
            satSum += 5
            break
        }

        // FlatList data
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
          listData.push(currentDay)
        }
        
        const displayAct: BlogActionHistory = {
          _id: act.Blog._id,
          Title: act.Blog.Title,
          CommentID: act.CommentID,
          BackgroundURL: act.Blog.CoverURL,
          Action: act.Type,
          Timestamp: new Date(act.ActivityDate).toString()
        }
        listData.push(displayAct)

        setIsListFetching(false)
      })

      // Calculate average time spent
      let timeSum = monSum + tueSum + wedSum + thuSum + friSum + satSum + sunSum
      let hours = Math.floor(timeSum / 60)
      let minutes = timeSum % 60
      let days = 0
      let avg = ""

      if (hours < 24) {
        days = Math.floor(hours / 24)
        hours = hours % 24
      }

      if (days != 0)
        avg += `${days}d `
      if (hours != 0)
        avg += `${hours}h `
      avg += `${minutes}m`
      setTimeSumText(avg)

      // Set bar chart data
      const chartData: ChartType[] = [
        { value: monSum, label: "Mon" },
        { value: tueSum, label: "Tue" },
        { value: wedSum, label: "Wed" },
        { value: thuSum, label: "Thu" },
        { value: friSum, label: "Fri" },
        { value: satSum, label: "Sat" },
        { value: sunSum, label: "Sun" }
      ]
      setChartData(chartData)

      // Set FlatList data
      setListData(listData)
    })
  }, [])

  return (
    <View style={styles.container}>
      {/* User Action History */}
      <View style={{width: "100%"}}>
        {isListFetching ?
          <FeedBlogPreviewSkeleton/> :
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
        }
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
