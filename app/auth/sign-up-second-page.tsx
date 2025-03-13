import AuthHeader from "@/components/auth/AuthHeader";
import GradientText from "@/components/GradientText";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthButtonTransparent from "@/components/auth/AuthButtonTransparent";
import { router, useLocalSearchParams } from "expo-router";
import Checkbox from "expo-checkbox";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { SignUpCredentials } from "@/interfaces/authInterface";
import { signup } from "@/redux/slices/authSlice";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpSecondPage() {
  // get the data from the previous page
  const { data } = useLocalSearchParams();
  const { firstName, lastName, username } = JSON.parse(data as string);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useAppDispatch();

  const password = watch("password");
  const { isAccountCreated } = useAppSelector(state => state.auth)

  const [isTermChecked, setTermChecked] = useState(false);
  const handleToggleCheckbox = () => {
    setTermChecked(!isTermChecked);
  };

  useEffect(() => {
    if (isAccountCreated) {
      if (router.canDismiss()) {
        router.dismissTo("/auth/login")
      }
    }
  }, [isAccountCreated]);
  
  const onSubmit = (data: FormData) => {
    if (!isTermChecked) {
      Alert.alert("Please accept the terms and conditions");
    } else {
      const signUpData: SignUpCredentials = {
        email: data.email,
        username: username,
        password: data.password,
      };

      console.log("test");
      dispatch(signup(signUpData));
    }
  };
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };
  return (
    // change light color to #000 later because figma didn't have a color for light mode
    <ThemedView
      style={[styles.container]}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <AuthHeader signUp={false} />
      <View style={{ alignSelf: "flex-start", padding: 10 }}>
        <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
          <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
            Sign up
          </GradientText>
          <Text style={styles.text}> now.</Text>
        </View>
        <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
          <Text style={styles.smalltext}>Let's set up your account, </Text>
          <Text style={[styles.smalltext, { color: "#B9FF66" }]}>
            {username}
          </Text>
          <Text style={styles.smalltext}>!</Text>
        </View>
      </View>
      <ThemedView style={styles.formContainer}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  smalltext: {
    fontSize: 16,
    color: "#fff",
    alignSelf: "flex-start",
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
