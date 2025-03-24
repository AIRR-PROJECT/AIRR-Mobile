import { View, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Picker } from "@react-native-picker/picker";
import moment from "moment-timezone";
import { Divider } from "@rneui/base";
import { useState } from "react";
import Checkbox from "expo-checkbox";
type EditNotificationScreenProps = {
  // Props type definition
  selectedTimezone?: string;
  enableEmailNoti?: boolean;
  activityNoti?: boolean;
  communityNoti?: boolean;
  followedUserUpdates?: boolean;
};

export default function EditNotificationScreen({
  selectedTimezone,
  enableEmailNoti = true,
  activityNoti = false,
  communityNoti = false,
  followedUserUpdates = false,
}: EditNotificationScreenProps) {
  // set defaut timezone to user's timezone
  if (!selectedTimezone) {
    selectedTimezone = moment.tz.guess();
  }
  const onTimezoneChange = () => {
    // change the app time zone
    // ambiguous behavior
  };
  // Get all timezone names
  const timezones = moment.tz.names();

  // Activity Noti
  const [isActivityNotificationEnabled, setActivityNoti] =
    useState(activityNoti);

  // Community Noti
  const [isCommunityNotificationEnabled, setCommunityNoti] =
    useState(communityNoti);

  // Update from follwed users
  const [isFollowedUserUpdatesEnabled, setFollowedUserUpdatesNoti] =
    useState(followedUserUpdates);

  // toggle button
  const [isEnabled, setIsEnabled] = useState(enableEmailNoti);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setActivityNoti(false);
    setCommunityNoti(false);
    setFollowedUserUpdatesNoti(false);
  };
  const handleActivtyNoti = () => {
    setActivityNoti(!isActivityNotificationEnabled);
  };
  const handleCommunityNoti = () => {
    setCommunityNoti(!isCommunityNotificationEnabled);
  };
  const handleFollowedUserUpdatesNoti = () => {
    setFollowedUserUpdatesNoti(!isFollowedUserUpdatesEnabled);
  };
  return (
    <View style={styles.container}>
      {/* Time */}
      <ThemedText style={styles.title}>Time Preference</ThemedText>
      <ThemedText style={styles.description}>
        Select your time zone and the beginning of the weekend in your area, so
        that we can be accurate in sending the notifications. This will also
        effect the Reading streak freeze days.
      </ThemedText>
      <ThemedText style={styles.title}>Timezone</ThemedText>
      {/* Time zone picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTimezone}
          onValueChange={onTimezoneChange}
          dropdownIconColor="#fff" // Changed to white for dark theme
          style={styles.picker}
        >
          {timezones.map((tz) => (
            <Picker.Item
              key={tz}
              label={`${tz} (GMT${moment.tz(tz).format("Z")})`}
              value={tz}
            />
          ))}
        </Picker>
      </View>
      {/*  */}
      <Divider style={{ marginVertical: 20 }} />
      {/* Email Noti */}
      <ThemedText style={styles.title}>Email Notification</ThemedText>
      <View style={[styles.rowContainer, {}]}>
        <ThemedText style={[styles.description, { width: "75%" }]}>
          Tailor your email notifications by selecting the types of emails that
          are important to you.
        </ThemedText>
        {/* Enable Button */}
        <Switch
          trackColor={{ false: "#767577", true: "#34c759" }}
          thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{
            marginLeft: 25,
            transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
          }}
        />
        {/* options */}
      </View>
      <View>
        {/* Activity */}
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={handleActivtyNoti}
        >
          <Checkbox
            style={styles.checkbox}
            value={isActivityNotificationEnabled}
            onValueChange={setActivityNoti}
            color={"#2AB514"}
            pointerEvents="none"
          />
          <ThemedText style={styles.text}>
            Activity (mentions, replies, reactions, etc.)
          </ThemedText>
        </TouchableOpacity>
        {/* Community */}
        <TouchableOpacity style={styles.rowContainer} onPress={handleCommunityNoti}>
          <Checkbox
            style={styles.checkbox}
            value={isCommunityNotificationEnabled}
            onValueChange={setCommunityNoti}
            color={"#2AB514"}
            pointerEvents="none"
          />
          <ThemedText style={styles.text}>Community updates</ThemedText>
        </TouchableOpacity>
        {/* Update from followed users */}
        <TouchableOpacity style={styles.rowContainer} onPress={handleFollowedUserUpdatesNoti}>
          <Checkbox
            style={styles.checkbox}
            value={isFollowedUserUpdatesEnabled}
            onValueChange={setFollowedUserUpdatesNoti}
            color={"#2AB514"}
            pointerEvents="none"
          />
          <ThemedText style={styles.text}>
            Update from followed users
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    color: "#A2B5A5",
    marginTop: 8,
    marginBottom: 16,
    textAlign: "justify",
  },

  formSection: {
    backgroundColor: "#1B1B24",
    padding: 16,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },

  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 13,
    marginBottom: 5,
    color: "#000",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 0px 0px #B9FF66",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: -10,
    padding: 10,
    fontSize: 12,
  },

  paragraph: {
    fontSize: 15,
    color: "white",
    paddingVertical: 5,
  },
  pickerContainer: {
    borderRadius: 13,
    marginBottom: 20,
    marginTop: 10,
    overflow: "hidden", // Important for border radius to work
    boxShadow: "0px 4px 0px 0px #B9FF66",
  },
  picker: {
    width: "100%",
    color: "#fff", // White text for dark theme
    backgroundColor: "#1B1B24",
  },
  pickerItem: {
    color: "#fff", // White text for items
    fontSize: 14,
    backgroundColor: "#1B1B24",
  },
  checkbox: {
    marginVertical: 8,
    marginRight: 8,
  },
});
