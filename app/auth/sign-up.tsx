import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import AnimatedPressable from "@/components/AnimatedPressable";
import GradientText from "@/components/GradientText";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { Pressable } from "react-native";
import { ScrollView } from "react-native";
import AuthButtonTransparent from "@/components/auth/AuthButtonTransparent";
import { useDispatch } from "react-redux";
import { resetAccountCreated, signup } from "@/redux/slices/authSlice";
import { SignUpCredentials } from "@/interfaces/authInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAccountCreated } = useAppSelector(state => state.auth)

  const password = watch("password");

  const [isTermChecked, setTermChecked] = useState(false);

  useEffect(() => {
    dispatch(resetAccountCreated(false))
  }, [])

  useEffect(() => {
    if (isAccountCreated) {
      router.back()
    }
  }, [isAccountCreated])

  const handleToggleCheckbox = () => {
    setTermChecked(!isTermChecked);
  };
  const onSubmit = (data: FormData) => {
    if (!isTermChecked) {
      Alert.alert("Please accept the terms and conditions");
    } else {
      const signUpData: SignUpCredentials = {
        email: data.email,
        username: data.username,
        password: data.password
      }

      console.log("test")
      dispatch(signup(signUpData))
    }
  };
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: "#1E1E1E" }]}
      //   darkColor="#1E1E1E"
      //   lightColor="#1E1E1E"
    >
      <AuthHeader signUp={false} />
      <View
        style={{ alignSelf: "flex-start", padding: 10, flexDirection: "row" }}
      >
        <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
          Sign up
        </GradientText>
        <Text style={styles.text}> now.</Text>
      </View>

      <ThemedView style={styles.formContainer}>
        {/* First name and last name */}
        <View style={[styles.section, { justifyContent: "space-between" }]}>
          {/* First Name */}
          <View style={{ width: "48%" }}>
            <Text style={[styles.paragraph]}>First Name</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <LinearGradient
                  colors={["#B9FF66", "#9DE8EE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 20 }}
                >
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
                  />
                </LinearGradient>
              )}
              name="firstName"
              rules={{ required: "First Name is required" }}
              defaultValue=""
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName.message}</Text>
            )}
          </View>
          {/* First Name */}
          <View style={{ width: "48%" }}>
            <Text style={[styles.paragraph]}>Last Name</Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <LinearGradient
                  colors={["#B9FF66", "#9DE8EE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 20 }}
                >
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
                </LinearGradient>
              )}
              name="lastName"
              rules={{ required: "Last Name is required" }}
              defaultValue=""
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName.message}</Text>
            )}
          </View>
        </View>
        {/* Email Input */}
        <Text style={[styles.paragraph]}>Email</Text>
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <LinearGradient
              colors={["#B9FF66", "#9DE8EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20 }}
            >
              <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                placeholder="Email"
                placeholderTextColor="#999"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </LinearGradient>
          )}
          name="email"
          defaultValue=""
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>
            {errors.email.message}
          </ThemedText>
        )}

        {/* Username Input */}
        <Text style={[styles.paragraph]}>Username</Text>
        <Controller
          control={control}
          rules={{
            required: "Username is required",
            minLength: {
              value: 6,
              message: "Username must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <LinearGradient
              colors={["#B9FF66", "#9DE8EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 20 }}
            >
              <TextInput
                style={[styles.input, errors.username && styles.errorInput]}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            </LinearGradient>
          )}
          name="username"
          defaultValue=""
        />
        {errors.username && (
          <ThemedText style={styles.errorText}>
            {errors.username.message}
          </ThemedText>
        )}

        {/* Password Input */}
        <Text style={[styles.paragraph]}>Password</Text>
        <Controller
          control={control}
          rules={{
            required: "Password is required",
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
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[styles.input, errors.password && styles.errorInput]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                  />
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
              </LinearGradient>
            );
          }}
          name="password"
          defaultValue=""
        />
        {errors.password && (
          <ThemedText style={styles.errorText}>
            {errors.password.message}
          </ThemedText>
        )}

        {/* Confirm Password Input */}
        <Text style={[styles.paragraph]}>Confirm Password</Text>
        <Controller
          control={control}
          rules={{
            required: "Confirm Password is required",
            validate: (value) => value === password || "Passwords do not match",
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
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.errorInput,
                    ]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Confirm Password"
                    secureTextEntry={!showPassword}
                  />
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
              </LinearGradient>
            );
          }}
          name="confirmPassword"
          defaultValue=""
        />
        {errors.confirmPassword && (
          <ThemedText style={styles.errorText}>
            {errors.confirmPassword.message}
          </ThemedText>
        )}
        <TouchableOpacity style={styles.section} onPress={handleToggleCheckbox}>
          <Checkbox
            style={styles.checkbox}
            value={isTermChecked}
            onValueChange={setTermChecked}
            color={isTermChecked ? "#B9FF66" : undefined}
          />
          <Text style={[styles.paragraph, { paddingHorizontal: 0 }]}>
            I accept the all terms and conditions
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <AuthButtonGradient
          label="Sign Up"
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 20, marginHorizontal: 0, width: "100%" }}
        />

        {/* Other Options */}
        <ThemedText
          type="default"
          style={[{ color: "#fff", alignSelf: "center" }]}
        >
          Or
        </ThemedText>
        {/* Or Google or Facebook */}
        <View style={[styles.section, { justifyContent: "space-between" }]}>
          <AuthButtonTransparent label="Google" style={styles.otherButton} />

          <AuthButtonTransparent label="Facebook" style={styles.otherButton} />
        </View>

        {/* Sign In Link*/}
        <TouchableOpacity onPress={handleBackToLogin}>
          <ThemedText
            type="link"
            style={[
              {
                color: "#fff",
                alignSelf: "flex-start",
                marginTop: 5,
                textDecorationLine: "underline",
              },
            ]}
          >
            Have an account yet,{" "}
            <ThemedText
              type="link"
              style={[
                {
                  color: "#fff",

                  fontWeight: "bold",
                },
              ]}
            >
              Sign In
            </ThemedText>
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
