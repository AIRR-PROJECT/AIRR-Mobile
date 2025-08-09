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
  PostComment,
  ReplyToBlogComment,
  UserBlogChildComment,
  UserBlogComment,
} from "@/interfaces/blogInterface";
import { useState, useRef, useEffect } from "react";
import BlogCommenterChild from "./BlogCommenterChild";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  commentOnBlog,
  getBlogComment,
  replyToBlogComment,
  setCommentAdded,
} from "@/redux/slices/blogSlice";
import BottomSheet from "@gorhom/bottom-sheet";

const mockUser = {
  _id: "testUserId",
  UserName: "John Doe",
  AvatarURL:
    "https://images.unsplash.com/photo-1502685104226-e9df14d4d9f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjE3NTY2MjQy&ixlib=rb-1.2.1&q=80&w=400",
};
const mockContent =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const mockCreatedAt = new Date();
const mockUserBlogComment: UserBlogChildComment = {
  _id: "testCommentId",
  User: mockUser,
  Content: mockContent,
  createdAt: mockCreatedAt,
  ReplyToComment: {
    _id: "test",
    User: {
      _id: "test",
      UserName: "Hehe",
      AvatarURL: "",
    },
  },
  updatedAt: new Date(),
};
const mockUserBlogCommentList = [
  mockUserBlogComment,
  mockUserBlogComment,
  mockUserBlogComment,
];

type BlogCommenterProps = {
  comment: UserBlogComment
  onReplyPosted: () => void;
  onMorePress: (isUserWrittenComment: boolean, chosenComment: UserBlogComment, chosenChildComment?: UserBlogChildComment) => void;
  sheetRef: React.RefObject<BottomSheet>; 
};
export default function BlogCommenter({
  comment,
  onReplyPosted,
  onMorePress,
  sheetRef, 
}: BlogCommenterProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const childScrollViewRef = useRef<ScrollView>(null);

  const dispatch = useAppDispatch();
  const { currentUserBlog } = useAppSelector((state) => state.blog);
  const { user } = useAppSelector((state) => state.user);

  const handleReplyPress = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      setReplyText(`@${comment.User.UserName} `); // Pre-fill with mention
      // // Allow time for the reply section to render before focusing
      // setTimeout(() => {
      //   textInputRef.current?.focus();
      // }, 100);
    } else {
      setReplyText(""); // Clear when closing
      Keyboard.dismiss();
    }
  };

  const handleSendReply = (commentID: string) => {
    onReplyPosted();
    const comment: ReplyToBlogComment = {
      UserID: user._id,
      BlogID: currentUserBlog._id,
      Content: replyText.split(" ").slice(1).join(""),
      Method: "Reply",
      ReplyToCommentID: commentID,
      RootCommentID: commentID,
    };
    dispatch(replyToBlogComment(comment)).then((res) => {
      if (res.payload === true) {
        dispatch(getBlogComment(currentUserBlog._id));

        console.log("Send reply:", replyText);
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
  const handleReturnContentPress = (childCommentContent: string) => {
    console.log("Child comment content:", childCommentContent);
    // Handle the child comment content here
    childScrollViewRef.current?.scrollToEnd({ animated: true });
    // print the childscrollview content
  };
  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress(isUserWrittenComment, comment);
    }
  };
  const isUserWrittenComment = comment.User._id === user._id;
  console.log("isUserWrittenComment", isUserWrittenComment);
  console.log("User", comment.User._id);
  console.log("Current user", user._id);
  return (
    <View style={styles.container}>
      <View style={{ padding: 20, gap: 10 }}>
        <View
          style={[styles.rowContainer, { justifyContent: "space-between" }]}
        >
          {/* User avatar */}
          <View style={styles.rowContainer}>
            <Image style={styles.avatar} source={{ uri: comment.User.AvatarURL }} />
            {/* name and date */}
            <View>
              <View>
                <Text style={styles.name}>{comment.User.UserName}</Text>
                <Text style={styles.date}>
                  {new Date(comment.createdAt).toDateString()}
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
        <Text style={styles.comment}>{comment.Content}</Text>
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

      {/* Write comment component */}
      {isReplying && (
        <View style={styles.replyWriteContainer}>
          <View
            style={[styles.rowContainer, { justifyContent: "space-between" }]}
          >
            <Text style={styles.replyTo}>
              Replying to{" "}
              <Text style={styles.otherUserUserName}>@{comment.User.UserName}</Text>{" "}
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
              <Text style={[styles.otherUserUserName]}>@{comment.User.UserName} </Text>{" "}
            </TextInput>
            {/* Send button */}
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={() => handleSendReply(comment._id)}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Other reply */}
      <ScrollView
        style={styles.otherReplyContainer}
        contentContainerStyle={{ gap: 10 }}
        ref={childScrollViewRef}
      >
        {(comment.ChildrenComments ?? []).map((childComment, index) => (
          <BlogCommenterChild
            key={index}
            parentComment={comment}
            comment={childComment} 
            replyTo={childComment.ReplyToComment.User.UserName}
            onReturnContentPress={handleReturnContentPress}
            rootCommentID={comment._id}
            onMorePress={onMorePress}/>
        ))}
      </ScrollView>
      {/* More option for comment */}
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
    marginBottom: 20,
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
    alignSelf: "flex-end",
  },
  sendButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  otherReplyContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
    gap: 20,
  },
});
