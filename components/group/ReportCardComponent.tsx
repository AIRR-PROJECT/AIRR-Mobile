import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { formatDistance, set } from "date-fns";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { GroupReport, PendingBlogRequest } from "@/interfaces/groupInterface";
import { getUserBlogDetail } from "@/redux/slices/blogSlice";
import { useAppDispatch } from "@/redux/hook";
import { UserBlogDetail } from "@/interfaces/blogInterface";
type ReportUserComponentProps = GroupReport & {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function ReportCardComponent({
  Blog,
  Reports,
  onApprove,
  onReject,
}: ReportUserComponentProps) {
  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      //   console.log("showRightProgress:", prog.value);
      //   console.log("appliedTranslation:", drag.value);

      return {
        transform: [{ translateX: drag.value + 100 }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation}>
        <View style={[styles.rejectOnDrag]}>
          <AntDesign name="closecircle" size={14} color="black" />
          <Text style={styles.rejectButtonText}>Reject</Text>
        </View>
      </Reanimated.View>
    );
  }
  const [isOpenStartDrag, setIsOpenStartDrag] = useState(false);
  const route = useRouter();
  const handlePress = () => {};
  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeable}
      friction={2}
      enableTrackpadTwoFingerGesture={true}
      rightThreshold={40}
      renderRightActions={RightAction}
      overshootRight={false}
      onSwipeableOpen={() => {
        console.log("onSwipeableOpen");
        onReject(Blog._id);
      }}
      onSwipeableOpenStartDrag={(drag) => {
        setIsOpenStartDrag(true);
      }}
      onSwipeableClose={() => {
        console.log("onSwipeableClose");
        setIsOpenStartDrag(false);
      }}
      onSwipeableWillClose={() => {
        console.log("onSwipeableWillClose");
        setIsOpenStartDrag(false);
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[
          styles.container,
          {
            borderTopRightRadius: isOpenStartDrag ? 0 : 20,
            borderBottomRightRadius: isOpenStartDrag ? 0 : 20,
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={Blog.CoverURL} style={styles.thumbnail} />
          <Text style={styles.title}>{Blog.Title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <View style={styles.reportSymbolContainer}>
              <MaterialIcons name="report-problem" size={16} color="red" />
            </View>
            <Text style={styles.description}>{Reports.length} reports</Text>
          </View>
        </View>

        <View style={styles.detailContainer}>
          {Reports.map((report) => (
            <View key={report.User._id} style={styles.userReportContainer}>
              <Image source={report.User.AvatarURL} style={styles.avatar} />
              <View style={styles.userReportDetail}>
                <View style={styles.usernameContainer}>
                  <Text style={{ fontWeight: "bold", width: "55%" }}>
                    {report.User.UserName}
                  </Text>
                  <View style={styles.reportContainer}>
                    <Text style={{ fontWeight: "bold", color: "red" }}>
                      {report.ReportType}
                    </Text>
                  </View>
                </View>
                <Text style={styles.description}>{report.Details}</Text>
              </View>
            </View>
          ))}

          {/* Approve and Reject Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => {
                onApprove(Blog._id);
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="checkcircle" size={14} color="black" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => {
                onReject(Blog._id);
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="closecircle" size={14} color="black" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  swipeable: {
    flex: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  rightAction: {
    backgroundColor: "purple",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },

  separator: {
    width: "100%",
    borderTopWidth: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
  },
  imageContainer: { alignItems: "center", width: 80, gap: 5, marginRight: 10 },
  detailContainer: { flex: 1, gap: 4 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#2d3036ff",
    flexWrap: "wrap",
  },
  time: {
    fontSize: 12,
    color: "#8A94AC",
  },
  approveButton: {
    backgroundColor: "#B9FF66",
    padding: 20,
    paddingBlock: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: "#FF6E6E",
    padding: 20,
    paddingBlock: 10,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rejectOnDrag: {
    backgroundColor: "#FF6E6E",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    width: 100,
    justifyContent: "center",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  userReportContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
  },
  userReportDetail: {
    flex: 1,
    marginLeft: 10,
  },
  reportSymbolContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reportContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
    padding: 5,
    paddingHorizontal: 10,
  },
});
