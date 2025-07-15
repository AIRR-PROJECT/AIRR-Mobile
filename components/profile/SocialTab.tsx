import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { ThemedText } from "../ThemedText";
import GradientText from "../GradientText";
import { LinearGradient } from "expo-linear-gradient";
import ReadmeComponent from "./ReadmeComponent";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import TotalBlogComponent from "./TotalBlogComponent";
import { FlashList } from "@shopify/flash-list";
import ProfileTabButton from "./ProfileTabButton";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/redux/hook";
import { logOut } from "@/redux/slices/authSlice";

// Get list of tags [max 10]
const tags = Array(10).fill("Frontend");
const chunkedTags = chunkArray(tags, 5);
const mockLink = "https://dly.to/dfdsc";
const facebookLink = "https://facebook.com/yourprofile";
const linkedInLink = "https://linkedin.com/in/yourprofile";
const githubLink = "https://github.com/yourprofileddddddddddddddddddddddddddddddddddddddddddddddddddd";
export default function SocialTab() {
  const dispatch = useAppDispatch();

  const handleCopyLink = async ({link}: {link:string}) => {
    await Clipboard.setStringAsync(link);

    ToastAndroid.show("Link copied to clipboard", ToastAndroid.SHORT);
  };
  const route = useRouter();
  const handleSignOut = () => {
    dispatch(logOut()).then((res) => {
      if ((res.payload as boolean) === true) {
        route.push("/auth");
      }
    });
  };
  return (
    // Readme
    <View style={styles.container}>
      {/* Invite friends */}
      <Text style={styles.inviteFriendTitle}>Profile Links</Text>
      {/* Link */}
      <LinearGradient
        colors={["#142c11ff", "#1d1d1dff"]} // dark green to dark
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linkContainer}
      >
        <View style={styles.iconContainer}>
          <Feather name="external-link" size={24} color="#B9FF66" />
        </View>
        <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">{mockLink}</Text>
        <TouchableOpacity
          style={styles.copyLinkButton}
          onPress={() => handleCopyLink({ link: mockLink })}
        >
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <Text style={styles.inviteFriendTitle}>Social Links</Text>
      <LinearGradient
        colors={["#0e1342ff", "#1d1d1dff"]} // dark blue to dark
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linkContainer}
      >
        <View style={[styles.iconContainer, { backgroundColor: "#012e46ff" }]}>
          <Feather name="facebook" size={24} color="#1977F2" />
        </View>
        <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">{facebookLink}</Text>
        <TouchableOpacity
          style={[styles.copyLinkButton, {}]}
          onPress={() => handleCopyLink({ link: facebookLink })}
        >
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={["#0e1342ff", "#1d1d1dff"]} // dark blue to dark
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linkContainer}
      >
        <View style={[styles.iconContainer, { backgroundColor: "#012e46ff" }]}>
          <Feather name="linkedin" size={24} color="#1977F2" />
        </View>
        <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">{linkedInLink}</Text>
        <TouchableOpacity
          style={styles.copyLinkButton}
          onPress={() => handleCopyLink({ link: linkedInLink })}
        >
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <LinearGradient
        colors={["#142c11ff", "#1d1d1dff"]} // dark green to dark
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.linkContainer}
      >
        <View style={styles.iconContainer}>
          <Feather name="github" size={24} color="#B9FF66" />
        </View>
        <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">{githubLink}</Text>
        <TouchableOpacity
          style={styles.copyLinkButton}
          onPress={() => handleCopyLink({ link: githubLink })}
        >
          <Ionicons name="copy-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <View>
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.7}
          onPress={handleSignOut}
        >
          <Feather name="log-out" size={24} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function chunkArray(array: any[], size: number): any[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, index * size + size)
  );
}

const styles = StyleSheet.create({
  // Styles
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    gap: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  readingTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 20,
  },
  totalReadingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  topTagsContainer: {
    borderWidth: 1,
    borderColor: "#393F4C",
    padding: 10,
    borderRadius: 20,
  },
  tagContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topTagsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 10,
  },
  inviteFriendTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  inviteFriendText: {
    fontSize: 16,
    color: "#fff",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    marginHorizontal: 10,
    flex: 1,
  },
  copyLinkButton: {
    marginLeft: "auto",
  },
  copyLinkText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  signOutButton: {
    backgroundColor: "#FF4D4D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#193b15ff",
    borderRadius: 5,
  },
});
