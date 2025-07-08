import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { formatDistance, set } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { PendingBlogRequest } from "@/interfaces/groupInterface";
import { getUserBlogDetail } from "@/redux/slices/blogSlice";
import { useAppDispatch } from "@/redux/hook";
import { UserBlogDetail } from "@/interfaces/blogInterface";
type BlogApprovalCardComponentProps = PendingBlogRequest & {
  onApprove: (id: string, blogOwnerId: string) => void;
  onReject: (id: string, blogOwnerId: string) => void;
};

export default function BlogApprovalCardComponent({
  BlogID,
  Owner,
  RequestDate,
  onApprove,
  onReject,
}: BlogApprovalCardComponentProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  
  useEffect(() => {
    dispatch(getUserBlogDetail(BlogID)).then(res => {
      if (res.payload) {
        const payload = res.payload as UserBlogDetail
        setTitle(payload.Title)
        setThumbnail(payload.BackgroundURL)
      }
    })
  }, [])

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
  const handlePress = () => {
    console.log("Press blog with id: ", BlogID);
    route.push(`/group/pending-blog?blogID=${BlogID}`);
  }
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
        onReject(BlogID, Owner._id);
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
          <Image source={Owner.AvatarURL} style={styles.avatar} />
          <Image source={thumbnail} style={styles.thumbnail} />
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            {Owner.Username} request a new blog
          </Text>
          <Text style={styles.time}>
            {formatDistance(new Date(RequestDate), new Date(), {
              addSuffix: true,
            })}
          </Text>
          {/* Approve and Reject Button */}
          {
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => {
                  onApprove(BlogID, Owner._id);
                }}
                activeOpacity={0.7}
              >
                <AntDesign name="checkcircle" size={14} color="black" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => {
                  onReject(BlogID, Owner._id);
                }}
                activeOpacity={0.7}
              >
                <AntDesign name="closecircle" size={14} color="black" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  swipeable: {
    flex: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 20,
    right: 15,
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
    width: 40,
    height: 40,
    borderRadius: 999,
    zIndex: 1,
  },
  imageContainer: { flexDirection: "row", alignItems: "center" },
  detailContainer: { flex: 1, gap: 4 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#000",
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
    marginTop: 10,
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
});
