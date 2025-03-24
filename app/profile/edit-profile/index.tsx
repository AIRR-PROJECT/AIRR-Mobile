import UploadProfileComponent from "@/components/profile/UploadProfileComponent";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
const sample_avatar = require("@/assets/images/sample-avatar.png");

type PersonalInfoForm = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
export default function EditProfileScreen() {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<UnifiedForm>({
    mode: "onChange",
    defaultValues: mockData,
  });

  return (
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
                    placeholder="First Name" // set the user's first name to the value
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="firstName"
              rules={{ required: "First Name is required" }}
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
                  />
                </View>
              )}
              name="lastName"
              rules={{ required: "Last Name is required" }}
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
        {/* Email */}
        <Text style={[styles.paragraph]}>Email</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.viewBoxShadow}>
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.errorInput,
                  { width: "100%" },
                ]}
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
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
              />
            </View>
          )}
          name="phone"
          rules={{ required: "Phone is required" }}
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
              />
            </View>
          )}
          name="studentId"
          rules={{ required: "Student ID is required" }}
        />
        {errors.studentId && (
          <Text style={styles.errorText}>{errors.studentId.message}</Text>
        )}
        {/* Department */}
        <Text style={[styles.paragraph]}>Department</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.viewBoxShadow}>
              <TextInput
                style={[
                  styles.input,
                  errors.department && styles.errorInput,
                  { width: "100%" },
                ]}
                placeholder="Department"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="department"
          rules={{ required: "Department is required" }}
        />
        {errors.department && (
          <Text style={styles.errorText}>{errors.department.message}</Text>
        )}
        {/* Program */}
        <Text style={[styles.paragraph]}>Program</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.viewBoxShadow}>
              <TextInput
                style={[
                  styles.input,
                  errors.program && styles.errorInput,
                  { width: "100%" },
                ]}
                placeholder="Program"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="program"
          rules={{ required: "Program is required" }}
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
                  />
                </View>
              )}
              name="gpa"
              rules={{ required: "GPA is required" }}
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
                    placeholder="Start Year"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toString() : ""}
                  />
                </View>
              )}
              name="startYear"
              rules={{ required: "Start Year is required" }}
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
                  { width: "100%" },
                ]}
                placeholder="LinkedIn"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="linkedin"
          rules={{ required: "LinkedIn is required" }}
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
                  errors.github && styles.errorInput,
                  { width: "100%" },
                ]}
                placeholder="Github"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="github"
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
                  errors.facebook && styles.errorInput,
                  { width: "100%" },
                ]}
                placeholder="Facebook"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </View>
          )}
          name="facebook"
        />
        {errors.facebook && (
          <Text style={styles.errorText}>{errors.facebook.message}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
