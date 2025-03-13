import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm, useWatch } from "react-hook-form";
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import { TouchableOpacity } from "react-native";
import { EffectCallback, useEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import AuthButton from "@/components/auth/AuthButton";
import AnimatedPressable from "@/components/AnimatedPressable";
import GradientText from "@/components/GradientText";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import AuthButtonTransparent from "@/components/auth/AuthButtonTransparent";
import { useLocalSearchParams, useRouter } from "expo-router";
type FormData = {
  email: string;
  password: string;
};
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { login, sendAccountOTP, resetLoggedIn } from "@/redux/slices/authSlice";
import { LoginCredentials } from "@/interfaces/authInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAccountVerified } = useAppSelector(state => state.auth)
  const { userAccessToken, userRefreshToken } = useAppSelector(state => state.user)

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const emailWatch = watch('email')

  const [init, setInit] = useState(false)

  const onSubmit = (data: LoginCredentials) => {
    dispatch(login(data))
    // Alert.alert("Login Successful", `Welcome, ${data.email}`);
    // router.replace("/(tabs)");
  };

  // Init
  useEffect(() => {
    // Reset
    dispatch(resetLoggedIn(false))

    setInit(true)
  }, [])

  useEffect(() => {
    if (!init) return

    if (isLoggedIn && !isAccountVerified) {
      router.push({
        pathname: "/auth/verify-account-otp",
        params: { resendEmail: emailWatch } 
      });
    }

    if (isLoggedIn && isAccountVerified && userAccessToken && userRefreshToken) {
      console.log(isLoggedIn)
      console.log(isAccountVerified)
      console.log(userAccessToken)
      console.log(userRefreshToken)
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, isAccountVerified, userAccessToken, userRefreshToken])


  const [isRememberChecked, setRememberChecked] = useState(false);
  const handleToggleCheckbox = () => {
    setRememberChecked(!isRememberChecked);
  };
  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
  };
  return (
    <ThemedView
      style={styles.container}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <View>
        <AuthHeader />
      </View>
      <View>
        <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
          Login
        </GradientText>
        <Text style={styles.text}>to get started!</Text>
      </View>

      <ThemedView style={styles.formContainer}>
        {/* Email Input */}
        <Text style={[styles.paragraph]}>Username</Text>
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
                style={[{ borderRadius: 20 }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[styles.input, errors.password && styles.errorInput]}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword} // Toggle secure text entry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
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
          name="password"
        />

        {errors.password && (
          <ThemedText style={styles.errorText}>
            {errors.password.message}
          </ThemedText>
        )}

        <View style={[styles.section, { justifyContent: "space-between" }]}>
          {/* Remember Me */}

          <TouchableOpacity style={styles.section} onPress={handleToggleCheckbox}>
            <Checkbox
              style={styles.checkbox}
              value={isRememberChecked}
              onValueChange={setRememberChecked}
              color={isRememberChecked ? "#B9FF66" : undefined}
            />
            <Text style={styles.paragraph}>Remember me</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword}>
            <GradientText
              style={[
                styles.text,
                { textDecorationLine: "underline", fontSize: 15 },
              ]}
              colors={["#B9FF66", "#9DE8EE"]}
            >
              Forgot password?
            </GradientText>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <AuthButtonGradient
          label="Sign In"
          onPress={handleSubmit(onSubmit)}
          style={[{ marginTop: 10, width: "100%", marginHorizontal: 0 }]}
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
      </ThemedView>

      {/* Sign Up Link*/}
      <TouchableOpacity style={{ alignSelf:'flex-start', marginHorizontal: 10 }} onPress={handleSignUp}>
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
          Don't have a account,{" "}
          <ThemedText
            type="link"
            style={[
              {
                color: "#fff",
                fontWeight: "bold",
              },
            ]}
          >
            Sign Up
          </ThemedText>
        </ThemedText>
      </TouchableOpacity>
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
    fontSize: 50,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "flex-start",
  },
  formContainer: {
    width: "100%",
    marginTop: 20,
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
    marginBottom: 10,
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

  gradient: {
    width: "auto",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 0, // Space for the gradient to show
  },
});
