import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import GradientText from "@/components/GradientText";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useDispatch } from "react-redux";
import { resetChangedPassword, setPassword } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
type FormData = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function SetPasswordScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const newPassword = watch("newPassword");
  const searchParams = useLocalSearchParams<{ email: string }>()
  const { changedPassword } = useAppSelector(state => state.auth)

  useEffect(() => {
    console.log(changedPassword)
    if (changedPassword) {
      // Reset
      dispatch(resetChangedPassword(false))

      router.push("/auth/login");
    }
  }, [changedPassword])

  const onSubmit = (data: FormData) => {
    const setPasswordData = {
      email: searchParams.email,
      password: newPassword
    }
    
    dispatch(setPassword(setPasswordData))
  };
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <ThemedView
      style={styles.container}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <AuthHeader />
      <TouchableOpacity
        onPress={handleBackToLogin}
        style={{ alignSelf: "flex-start", padding: 10 }}
      >
        <ThemedText style={[{ color: "white" }]}>
          {" < "}Back to login
        </ThemedText>
      </TouchableOpacity>
      <View style={{ alignSelf: "flex-start", flexDirection: "row", paddingHorizontal: 10 }}>
        <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
          Set a password!
        </GradientText>
      </View>

      <View style={{ alignSelf: "flex-start", flexDirection: "row", }}>
        <ThemedText style={styles.paragraph}>
          Your previous password has been resetted. Please set a new password for
          your account.
        </ThemedText>
      </View>
      <ThemedView style={styles.formContainer}>
        {/* New Password Input */}
        <Text style={[styles.paragraph]}>New Password</Text>
        <Controller
          control={control}
          rules={{
            required: "New Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          
          render={({ field: { onChange, onBlur, value } }) => {
            const [showPassword, setShowPassword] = useState(false);
            return (
              <LinearGradient
                colors={["#B9FF66", "#9DE8EE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 20 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.newPassword && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="New Password"
                    secureTextEntry={!showPassword} // Toggle secure text entry
                  />
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
              </LinearGradient>
            );
          }}
          name="newPassword"
          defaultValue=""
        />
        {errors.newPassword && (
          <ThemedText style={styles.errorText}>
            {errors.newPassword.message}
          </ThemedText>
        )}

        {/* Confirm New Password Input */}
        <Text style={[styles.paragraph]}>Confirm New Password</Text>
        <Controller
          control={control}
          rules={{
            required: "Confirm New Password is required",
            validate: (value) =>
              value === newPassword || "Passwords do not match",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            const [showPassword, setShowPassword] = useState(false);
            return (
            <LinearGradient
              colors={["#B9FF66", "#9DE8EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmNewPassword && styles.errorInput,
                  ]}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Confirm New Password"
                  secureTextEntry={!showPassword} // Toggle secure text entry
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
            </LinearGradient>
          )}}
          name="confirmNewPassword"
          defaultValue=""
        />
        {errors.confirmNewPassword && (
          <ThemedText style={styles.errorText}>
            {errors.confirmNewPassword.message}
          </ThemedText>
        )}

        <AuthButtonGradient
          label="Set Password"
          onPress={handleSubmit(onSubmit)}
          style={[{ marginTop: 15, width: "100%", marginHorizontal: 0 }]}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#fff",
    alignSelf: "flex-start",
  },
  formContainer: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "transparent",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginBottom: 5,
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

  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
  paragraph: {
    fontSize: 15,
    color: "white",
    padding: 10,
  },

  otherButton: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
});
