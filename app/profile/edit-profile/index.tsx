import UploadProfileComponent from "@/components/profile/UploadProfileComponent";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { User } from "@/interfaces/userInterface";
import { useEffect, useMemo, useRef, useState } from "react";
import { setUserChange } from "@/redux/slices/userSlice";
import { router } from "expo-router";
import { setUserChangeSaved } from "@/redux/slices/authSlice";
import { wrap } from "lodash";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RNDateTimePicker from '@react-native-community/datetimepicker';
const sample_avatar = require("@/assets/images/sample-avatar.png");

type PersonalInfoForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth: string;
  phone: string;
};
type StudentInfoForm = {
  studentId: string;
  department: string;
  program: string;
  gpa: number;
  startYear: number;
};
type SocialMediaForm = {
  linkedin: string;
  github: string;
  facebook: string;
};
type UnifiedForm = PersonalInfoForm & StudentInfoForm & SocialMediaForm;
const mockData: UnifiedForm = {
  firstName: "John",
  lastName: "Doe",
  username: "john_doe",
  email: "test@gmail.com",
  dateOfBirth: "2000-01-01",
  phone: "123456789",
  studentId: "21121234",
  department: "Software Engineering",
  program: "Bachelor",
  gpa: 3.5,
  startYear: 2019,
  linkedin: "https://www.linkedin.com/",
  github: "",
  facebook: "",
};
const PROGRAM_OPTIONS = ["CQ", "CTCC", "CLC"];
const DEPARTMENT_OPTIONS = [
  "Software Engineering",
  "Information Systems",
  "Computer Networks",
  "Knowledge Technology",
  "Computer Science",
  "Information Security",
  "Computer Vision",
  "Data Science",
];

export default function EditProfileScreen() {
  const dispatch = useAppDispatch();
  const { isUserChangeSaved } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  const userData = user as any as User;
  const [checkCounter, setCheckCounter] = useState(0);
  const defaultFormData: UnifiedForm = {
    firstName: userData.firstName ?? "",
    lastName: userData.lastName ?? "",
    username: userData.username,
    email: userData.email ?? "",
    dateOfBirth: userData.dateOfBirth ?? "",
    phone: userData.phoneNumber?.toString() ?? "",
    studentId: userData.profile.studentID ?? "",
    department: userData.profile.department ?? "",
    program: userData.profile.program ?? "",
    gpa: userData.profile.gpa ?? 0,
    startYear: userData.profile.year
      ? new Date().getFullYear() - userData.profile.year
      : 0,
    linkedin: userData.profile.link ? userData.profile.link.LinkedIn ?? "" : "",
    github: userData.profile.link ? userData.profile.link.Github ?? "" : "",
    facebook: userData.profile.link ? userData.profile.link.Facebook ?? "" : "",
  };

  const {
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm<UnifiedForm>({
    mode: "onChange",
    defaultValues: defaultFormData,
  });

  let userChange: User = JSON.parse(JSON.stringify(userData)) as User;

  useEffect(() => {
    if (isUserChangeSaved) {
      dispatch(setUserChangeSaved(false));

      // router.back()
    }
  }, [isUserChangeSaved]);

  const firstNameWatch = watch("firstName");
  const lastNameWatch = watch("lastName");
  const emailWatch = watch("email");
  const dateOfBirthWatch = watch("dateOfBirth");
  const phoneWatch = watch("phone");
  const studentIdWatch = watch("studentId");
  const departmentWatch = watch("department");
  const programWatch = watch("program");
  const gpaWatch = watch("gpa");
  // const startYearWatch = watch("startYear");
  const linkedinWatch = watch("linkedin");
  const githubWatch = watch("github");
  const facebookWatch = watch("facebook");
  const sheetRef = useRef<BottomSheet>(null);
  const [sheetMode, setSheetMode] = useState<"main" | "program" | "department">(
    "main"
  );
  const [pendingOnChange, setPendingOnChange] = useState<(val: string) => void>(
    () => () => {} // TRICK to avoid undefined onChange
  );
  const userChange = useAppSelector((state) => state.user.userChange);

useEffect(() => {
  dispatch(
    setUserChange({
      ...userChange,
      firstName: firstNameWatch,
      lastName: lastNameWatch,
      email: emailWatch,
      dateOfBirth: dateOfBirthWatch,
      phoneNumber: /^-?\d+$/.test(phoneWatch) ? Number(phoneWatch) : undefined,
      profile: {
        ...userChange.profile,
        studentID: studentIdWatch,
        department: departmentWatch,
        program: programWatch,
        gpa: gpaWatch,
        year: new Date().getFullYear() - startYearWatch,
        link: {
          ...userChange.profile.link,
          LinkedIn: linkedinWatch,
          Github: githubWatch,
          Facebook: facebookWatch,
        },
      },
    })
  );
}, [
  firstNameWatch,
  lastNameWatch,
  emailWatch,
  dateOfBirthWatch,
  phoneWatch,
  studentIdWatch,
  departmentWatch,
  programWatch,
  gpaWatch,
  startYearWatch,
  linkedinWatch,
  githubWatch,
  facebookWatch,
]);
const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        {/* Title */}
        <ThemedText style={styles.title}>Profile Photo</ThemedText>
        <ThemedText style={styles.description}>
          Show off your vibe! Upload a profile pic to make your account totally
          you. let the world see your style!
        </ThemedText>
        {/* Image */}
        <UploadProfileComponent imgSource={sample_avatar} />
        {/* Persoanal Info */}
        <ThemedText style={[styles.title, { marginVertical: 20 }]}>
          Personal Infomation
        </ThemedText>
        {/* Personal Form */}
        <View style={styles.formSection}>
          <View
            style={[styles.rowContainer, { justifyContent: "space-between" }]}
          >
            <View style={{ width: "48%" }}>
              {/* First name */}
              <Text style={[styles.paragraph]}>First Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.viewBoxShadow}>
                    <TextInput
                      style={[
                        styles.input,
                        errors.firstName && styles.errorInput,
                        { width: "100%" },
                      ]}
                      placeholder="First Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={20}
                    />
                  </View>
                )}
                name="firstName"
                rules={{
                  maxLength: {
                    value: 20,
                    message: "First Name max 20 characters",
                  },
                }}
              />

              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}
            </View>
            {/* Last Name */}
            <View style={{ width: "48%" }}>
              <Text style={[styles.paragraph]}>Last Name</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.viewBoxShadow}>
                    <TextInput
                      style={[
                        styles.input,
                        errors.lastName && styles.errorInput,
                        { width: "100%" },
                      ]}
                      placeholder="Last Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={20}
                    />
                  </View>
                )}
                name="lastName"
                rules={{
                  maxLength: {
                    value: 20,
                    message: "Last Name max 20 characters",
                  },
                }}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}
            </View>
          </View>
          {/* Username (disabled)*/}
          <Text style={[styles.paragraph]}>Username</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[styles.input, { color: "#888" }]}
                  placeholder="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          )}
          {/* Email (disabled) */}
          <Text style={[styles.paragraph]}>Email</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[styles.input, { color: "#888" }]}
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
            )}
            name="email"
          />
          {/* Date of birth */}
          <Text style={[styles.paragraph]}>Date of Birth</Text>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange } }) => (
              <>
                <TouchableOpacity
                  style={[
                    styles.viewBoxShadow,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={[
                      styles.input,
                      {
                        color: dateOfBirthWatch ? "#000" : "#888",
                      },
                    ]}
                  >
                    {dateOfBirthWatch
                      ? formatDateDMY(dateOfBirthWatch)
                      : "Select Date of Birth"}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <RNDateTimePicker 
                    value={
                      dateOfBirthWatch
                        ? new Date(dateOfBirthWatch)
                        : new Date(2000, 0, 1)
                    }
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate.toISOString());
                      }
                    }}
                  />
                )}
              </>
            )}
            rules={{
              required: "Date of Birth is required",
              validate: (v) => {
                if (!v) return "Date of Birth is required";
                const date = new Date(v);
                if (date > new Date())
                  return "Date of Birth cannot be in the future";
                return true;
              },
            }}
          />
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
          )}
          {/* Phone */}
          <Text style={[styles.paragraph]}>Phone</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone && styles.errorInput,
                    { width: "100%" },
                  ]}
                  placeholder="Phone"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
            )}
            name="phone"
            rules={{
              maxLength: { value: 10, message: "Phone max 10 digits" },
              pattern: {
                value: /^\d*$/,
                message: "Phone must be numbers only",
              },
            }}
          />

          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}
        </View>
        {/* Student Info */}
        <ThemedText style={[styles.title, { marginVertical: 20 }]}>
          Student Information
        </ThemedText>
        {/* Student Form */}
        <View style={styles.formSection}>
          {/* Student ID */}
          <Text style={[styles.paragraph]}>Student ID</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[
                    styles.input,
                    errors.studentId && styles.errorInput,
                    { width: "100%" },
                  ]}
                  placeholder="Student ID"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  maxLength={8}
                  keyboardType="numeric"
                />
              </View>
            )}
            name="studentId"
            rules={{
              maxLength: { value: 8, message: "Student ID max 8 digits" },
              pattern: {
                value: /^\d*$/,
                message: "Student ID must be numbers only",
              },
            }}
          />
          {errors.studentId && (
            <Text style={styles.errorText}>{errors.studentId.message}</Text>
          )}
          {/* Department */}
          <Text style={[styles.paragraph]}>Department</Text>
          <Controller
            control={control}
            name="department"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  style={[styles.viewBoxShadow]}
                  onPress={() => {
                    setSheetMode("department");
                    setPendingOnChange(() => onChange);
                    sheetRef.current?.snapToIndex(0);
                  }}
                >
                  <Text
                    style={[styles.input, { color: value ? "#000" : "#888" }]}
                  >
                    {value || "Select Department"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            rules={{
              required: "Department is required",
              validate: (v) =>
                v === ""
                  ? true
                  : DEPARTMENT_OPTIONS.includes(v) || "Invalid department",
            }}
          />
          {errors.department && (
            <Text style={styles.errorText}>{errors.department.message}</Text>
          )}

          {/* Program */}
          <Text style={[styles.paragraph]}>Program</Text>
          <Controller
            control={control}
            name="program"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  style={[styles.viewBoxShadow]}
                  onPress={() => {
                    setSheetMode("program");
                    setPendingOnChange(() => onChange);
                    sheetRef.current?.snapToIndex(0);
                  }}
                >
                  <Text
                    style={[styles.input, { color: value ? "#000" : "#888" }]}
                  >
                    {value || "Select Program"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            rules={{
              validate: (v) =>
                v === ""
                  ? true
                  : PROGRAM_OPTIONS.includes(v) || "Invalid program",
            }}
          />
          {errors.program && (
            <Text style={styles.errorText}>{errors.program.message}</Text>
          )}
          <View
            style={[styles.rowContainer, { justifyContent: "space-between" }]}
          >
            {/* GPA */}
            <View style={{ width: "48%" }}>
              <Text style={[styles.paragraph]}>GPA</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.viewBoxShadow}>
                    <TextInput
                      style={[
                        styles.input,
                        errors.gpa && styles.errorInput,
                        { width: "100%" },
                      ]}
                      placeholder="GPA"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ? value.toString() : ""}
                      keyboardType="decimal-pad"
                    />
                  </View>
                )}
                name="gpa"
                rules={{
                  min: { value: 0, message: "GPA must be at least 0" },
                  max: { value: 4, message: "GPA must be at most 4" },
                  pattern: {
                    value: /^(\d(\.\d{1,2})?|4(\.0{1,2})?)$/,
                    message: "GPA must be a number between 0 and 4",
                  },
                }}
              />
              {errors.gpa && (
                <Text style={styles.errorText}>{errors.gpa.message}</Text>
              )}
            </View>
            {/* Start Year */}
            <View style={{ width: "48%" }}>
              <Text style={[styles.paragraph]}>Start Year</Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.viewBoxShadow}>
                    <TextInput
                      style={[
                        styles.input,
                        errors.startYear && styles.errorInput,
                        { width: "100%" },
                      ]}
                      placeholder="Year of Study"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value ? value.toString() : ""}
                      keyboardType="numeric"
                    />
                  </View>
                )}
                name="startYear"
                rules={{
                  min: { value: 0, message: "Year must be at least 0" },
                  max: { value: 4, message: "Year must be at most 4" },
                  pattern: { value: /^\d*$/, message: "Year must be a number" },
                }}
              />
              {errors.startYear && (
                <Text style={styles.errorText}>{errors.startYear.message}</Text>
              )}
            </View>
          </View>
        </View>
        {/* Social Media */}
        <ThemedText style={[styles.title, { marginVertical: 20 }]}>
          Social Media Accounts
        </ThemedText>
        {/* Social Media Form */}
        <View style={[styles.formSection, { marginBottom: 20 }]}>
          {/*LinkedIn  */}
          <Text style={[styles.paragraph]}>LinkedIn</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[
                    styles.input,
                    errors.linkedin && styles.errorInput,
                    { width: "100%", flexWrap: "wrap" },
                  ]}
                  placeholder="LinkedIn"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline={true}
                  textAlignVertical="top"
                  maxLength={60}
                />
              </View>
            )}
            name="linkedin"
            rules={{
              maxLength: { value: 60, message: "LinkedIn max 60 characters" },
              // Linkedin Regex validation
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
                message: "Invalid LinkedIn URL",
              },
            }}
          />
          {errors.linkedin && (
            <Text style={styles.errorText}>{errors.linkedin.message}</Text>
          )}
          {/* Github */}
          <Text style={[styles.paragraph]}>Github</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[
                    styles.input,
                    errors.linkedin && styles.errorInput,
                    { width: "100%", flexWrap: "wrap" },
                  ]}
                  placeholder="Github"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline={true}
                  textAlignVertical="top"
                  maxLength={60}
                />
              </View>
            )}
            name="github"
            rules={{
              maxLength: { value: 60, message: "LinkedIn max 60 characters" },
              // Github Regex validation
              pattern: {
                value: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
                message: "Invalid GitHub URL",
              },
            }}
          />
          {errors.github && (
            <Text style={styles.errorText}>{errors.github.message}</Text>
          )}
          {/* Facebook */}
          <Text style={[styles.paragraph]}>Facebook</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.viewBoxShadow}>
                <TextInput
                  style={[
                    styles.input,
                    errors.linkedin && styles.errorInput,
                    { width: "100%", flexWrap: "wrap" },
                  ]}
                  placeholder="Facebook"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline={true}
                  textAlignVertical="top"
                  maxLength={60}
                />
              </View>
            )}
            name="facebook"
            rules={{
              maxLength: { value: 60, message: "LinkedIn max 60 characters" },
              // Facebook Regex validation
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/,
                message: "Invalid Facebook URL",
              },
            }}
          />
          {errors.facebook && (
            <Text style={styles.errorText}>{errors.facebook.message}</Text>
          )}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#1E1E1E" }}
        handleIndicatorStyle={{ backgroundColor: "#B9FF66" }}
        style={{ backgroundColor: "#1E1E1E" }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        onClose={() => {
          setSheetMode("main");
        }}
      >
        {sheetMode === "program" && (
          <BottomSheetView style={{ padding: 16 }}>
            {PROGRAM_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                onPress={() => {
                  pendingOnChange(option); // Use the stored onChange
                  sheetRef.current?.close();
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </BottomSheetView>
        )}
        {sheetMode === "department" && (
          <BottomSheetView style={{ padding: 16 }}>
            {DEPARTMENT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                onPress={() => {
                  pendingOnChange(option); // Use the stored onChange
                  sheetRef.current?.close();
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>{option}</Text>
              </TouchableOpacity>
            ))}
          </BottomSheetView>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
function formatDateDMY(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#1E1E1E",
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
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  formSection: {
    backgroundColor: "#1B1B24",
    padding: 16,
    borderRadius: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
    alignSelf: "flex-start",
  },

  input: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 13,
    color: "#000",
    backgroundColor: "#fff",
    fontSize: 16,
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
  viewBoxShadow: {
    boxShadow: "0px 4px 0px 0px #B9FF66",
    borderRadius: 13,
    marginBottom: 5,
  },
});
