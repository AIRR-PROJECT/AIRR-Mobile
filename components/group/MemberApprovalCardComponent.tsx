import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { formatDistance, set } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
type MemberApprovalCardComponentProps = {
  id: string;
  name: string;
  avatar: string;
  username: string;
  time: Date;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export default function MemberApprovalCardComponent({
  id,
  name,
  avatar,
  username,
  time,
  onApprove,
  onReject,
}: MemberApprovalCardComponentProps) {
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
        onReject(id);
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
      <View
        style={[
          styles.container,
          {
            borderTopRightRadius: isOpenStartDrag ? 0 : 20,
            borderBottomRightRadius: isOpenStartDrag ? 0 : 20,
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image source={avatar} style={styles.avatar} />
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>request to join group</Text>
          <Text style={styles.time}>
            {formatDistance(new Date(time), new Date(), {
              addSuffix: true,
            })}
          </Text>
          {/* Approve and Reject Button */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => {
                onApprove(id);
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="checkcircle" size={14} color="black" />
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => {
                onReject(id);
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="closecircle" size={14} color="black" />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: 80,
    height: 80,
    borderRadius: 999,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  detailContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 14,
    fontWeight: "normal",
  },
  time: {
    fontSize: 12,
    color: "#8A94AC",
  },
  approveButton: {
    backgroundColor: "#B9FF66",
    padding: 15,
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
    padding: 15,
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
  tagText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#2E3B40",
    padding: 10,
    borderRadius: 9,
    alignSelf: "flex-start",
  },
});
