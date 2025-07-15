import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPassword, setNewPassword } from "@/redux/slices/userSlice";
import { setCurrentPasswordIncorrect } from "@/redux/slices/authSlice";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function ChangePasswordScreen() {
  const {
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const dispatch = useAppDispatch();
  const { isCurrentPasswordIncorrect } = useAppSelector((state) => state.auth);
  const currentPassword = watch("currentPassword");
  // console.log(currentPassword);
  const newPassword = watch("newPassword");
  const mockData: string = "12345678";

  useEffect(() => {
    dispatch(setCurrentPasswordIncorrect(false));

    dispatch(setCurrentPassword(currentPassword));
  }, [currentPassword]);

  useEffect(() => {
    dispatch(setNewPassword(newPassword));
  }, [newPassword]);

  // Trigger the Current Password validation every times isCurrentPasswordIncorrect changes
  useEffect(() => {
    trigger("currentPassword");
  }, [isCurrentPasswordIncorrect]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <ThemedText style={styles.title}>Change Password</ThemedText>
      <ThemedText style={styles.description}>
        Regularly updating your password is essential for maintaining security
        and protecting sensitive information
      </ThemedText>
      {/* Change Password Form */}
      <View style={styles.formSection}>
        {/* Current Password */}
        <ThemedText style={styles.paragraph}>Current Password</ThemedText>
        <Controller
          control={control}
          rules={{
            required: "Current password is required",
            validate: (value) => {
              console.log(value);
              return (
                !isCurrentPasswordIncorrect || "Current password is incorrect"
              );
            },
            onChange: () => {
              dispatch(setCurrentPasswordIncorrect(false));
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const [showPassword, setShowPassword] = useState(false);
            return (
              <View>
                <View style={styles.viewBoxShadow}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.currentPassword && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your current password"
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10, // Position inside the input
                    padding: 10,
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          name="currentPassword"
        />
        {errors.currentPassword && (
          <ThemedText style={styles.errorText}>
            {errors.currentPassword.message}
          </ThemedText>
        )}
        {/* New Password */}
        <ThemedText style={styles.paragraph}>New Password</ThemedText>
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            maxLength: {
              value: 20,
              message: "Password must be at most 20 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,20}$/,
              message:
                "Password must contain uppercase, lowercase, number, and special character",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const [showPassword, setShowPassword] = useState(false);
            return (
              <View>
                <View style={styles.viewBoxShadow}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.newPassword && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter your new password"
                    secureTextEntry={!showPassword}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    padding: 10,
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        {errors.newPassword && (
          <ThemedText style={styles.errorText}>
            {errors.newPassword.message}
          </ThemedText>
        )}
        {/* Confirm New Password */}
        <ThemedText style={styles.paragraph}>Confirm New Password</ThemedText>
        <Controller
          control={control}
          name="confirmNewPassword"
          rules={{
            required: "Confirm new password is required",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            maxLength: {
              value: 20,
              message: "Password must be at most 20 characters",
            },
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,20}$/,
              message:
                "Password must contain uppercase, lowercase, number, and special character",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const [showPassword, setShowPassword] = useState(false);
            return (
              <View>
                <View style={styles.viewBoxShadow}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmNewPassword && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Confirm your new password"
                    secureTextEntry={!showPassword}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    padding: 10,
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        {errors.confirmNewPassword && (
          <ThemedText style={styles.errorText}>
            {errors.confirmNewPassword.message}
          </ThemedText>
        )}
      </View>
    </View>
  );
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
    padding: 10,
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
