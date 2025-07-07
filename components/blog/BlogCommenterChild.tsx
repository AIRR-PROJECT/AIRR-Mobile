import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Divider } from "@rneui/base";
import {
  ReplyToBlogComment,
  UserBlogComment,
} from "@/interfaces/blogInterface";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  replyToBlogComment,
  getBlogComment,
  setCommentAdded,
} from "@/redux/slices/blogSlice";
// reply to là tên của người mà user reply lại trong content
// nó có thể khác với parent comment
type BlogCommenterChildProps = UserBlogComment & {
  replyTo: string;
  onReturnContentPress: (childCommentContent: string) => void;
  onMorePress?: (isUserWrittenComment: boolean) => void;
} & { rootCommentID: string };

export default function BlogCommenterChild({
  User,
  Content,
  createdAt,
  replyTo,
  _id,
  rootCommentID,
  onReturnContentPress: returnContentPress,
  onMorePress = () => {},
}: BlogCommenterChildProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const textInputRef = useRef<TextInput>(null);

  const dispatch = useAppDispatch();
  const { currentUserBlog } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);

  // // Handle keyboard events
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       // Scroll to the bottom when keyboard shows
  //       // scrollViewRef.current?.scrollToEnd({ animated: true });
  //     }
  //   );

  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  const handleReplyPress = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      setReplyText(`@${User.UserName} `); // Pre-fill with mention
      // // Allow time for the reply section to render before focusing
      // setTimeout(() => {
      //   textInputRef.current?.focus();
      // }, 100);
    } else {
      setReplyText(""); // Clear when closing
      Keyboard.dismiss();
    }
  };

  const handleSendReply = (commentID: string, rootCommentID: string) => {
    const comment: ReplyToBlogComment = {
      UserID: user._id,
      BlogID: currentUserBlog._id,
      Content: replyText.split(" ").slice(1).join(""),
      Method: "Reply",
      ReplyToCommentID: commentID,
      RootCommentID: rootCommentID,
    };
    dispatch(replyToBlogComment(comment)).then((res) => {
      if (res.payload === true) {
        dispatch(getBlogComment(currentUserBlog._id));

        console.log("Send reply:", replyText);
        // Call the parent function to handle the reply
        returnContentPress(replyText);
        setIsReplying(false);
        setReplyText("");
        Keyboard.dismiss();

        dispatch(setCommentAdded(true));
      }
    });
  };

  const handleCloseReply = () => {
    setIsReplying(false);
    setReplyText("");
    Keyboard.dismiss();
  };
  const isUserWrittenComment = User._id === user._id;
  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress(isUserWrittenComment);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ padding: 20, gap: 10 }}>
        <View
          style={[styles.rowContainer, { justifyContent: "space-between" }]}
        >
          {/* User avatar */}
          <View style={styles.rowContainer}>
            <Image style={styles.avatar} source={{ uri: User.AvatarURL }} />
            {/* name and date */}
            <View>
              <View>
                <Text style={styles.name}>{User.UserName}</Text>
                <Text style={styles.date}>
                  {new Date(createdAt).toDateString()}
                </Text>
              </View>
            </View>
          </View>
          {/* More button */}
          {isUserWrittenComment && (
            <TouchableOpacity onPress={handleMorePress} activeOpacity={0.8}>
              <Feather name="more-horizontal" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {/* Actual Comment */}
        <Text style={styles.comment}>
          <Text style={[styles.otherUserUserName]}>@{replyTo}</Text> {Content}
        </Text>
        <Divider />
        {/* Like, Comment, Share */}
        {/* Write comment */}
        <TouchableOpacity
          style={[styles.rowContainer, { gap: 10 }]}
          onPress={handleReplyPress}
          activeOpacity={0.8}
        >
          <Text style={styles.replyText}>Reply</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="white"
            style={{
              transform: [{ rotate: isReplying ? "0deg" : "270deg" }],
            }}
          />
        </TouchableOpacity>
      </View>
      {isReplying && (
        <View style={styles.replyWriteContainer}>
          <View
            style={[styles.rowContainer, { justifyContent: "space-between" }]}
          >
            <Text style={styles.replyTo}>
              Replying to{" "}
              <Text style={styles.otherUserUserName}>@{User.UserName}</Text>{" "}
              comment
            </Text>
            <TouchableOpacity onPress={handleCloseReply}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.replyWrapper}>
            <TextInput
              ref={textInputRef}
              placeholderTextColor="#fff"
              style={styles.replyTextInput}
              multiline
              textAlignVertical="top"
              onChangeText={setReplyText}
            >
              <Text style={[styles.otherUserUserName]}>@{User.UserName} </Text>{" "}
            </TextInput>
            {/* Send button */}
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={() => handleSendReply(_id, rootCommentID)}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#565656",
    borderRadius: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 45,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  date: {
    color: "#fff",
    fontSize: 14,
  },
  comment: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  replyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  replyTo: {
    color: "#fff",
    fontSize: 16,
    textAlign: "justify",
  },
  replyWriteContainer: {
    borderWidth: 1,
    justifyContent: "center",
    gap: 10,
    borderColor: "#565656",
    borderRadius: 20,
    padding: 20,
  },
  otherUserUserName: {
    fontWeight: "bold",
    color: "#B9FF66",
    fontSize: 16,
  },
  replyWrapper: {
    backgroundColor: "#191926",
    borderRadius: 20,
    padding: 10,
  },
  replyTextInput: {
    color: "#fff",
    minHeight: 80,
    textAlign: "justify",
    padding: 10,
  },
  sendButton: {
    backgroundColor: "#B9FF66",
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  otherReplyContainer: {
    borderWidth: 1,
    justifyContent: "center",
    gap: 10,
    borderColor: "#565656",
    borderRadius: 20,
    padding: 20,
  },
  repliesContainer: {
    marginLeft: 20, // Indent nested comments
    borderLeftWidth: 2,
    borderLeftColor: "#444",
    paddingLeft: 10,
  },
});
