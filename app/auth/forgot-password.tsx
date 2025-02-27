
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedPressable from "@/components/AnimatedPressable";
import GradientText from "@/components/GradientText";
import AuthButtonTransparent from "@/components/auth/AuthButtonTransparent";
type FormData = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const onSubmit = (data: any) => {
    router.push("/auth/verify-otp");
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
      <AnimatedPressable
        onPress={handleBackToLogin}
        style={{ alignSelf: "flex-start", padding: 10 }}
      >
        <ThemedText style={[{ color: "white" }]}>
          {" < "}Back to login
        </ThemedText>
      </AnimatedPressable>

      <View style={{ alignSelf: "flex-start", flexDirection: "row", paddingHorizontal: 10 }}>
        <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
          Forgot password?
        </GradientText>
      </View>
      
      <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
        <ThemedText style={styles.paragraph}>
          Don't worry, happens to all of us. Enter your email below to recover
          your password.
        </ThemedText>
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
        <AuthButtonGradient
          label="Reset Password"
          onPress={handleSubmit(onSubmit)}
          style={[{ marginTop: 15, width: "100%", marginHorizontal: 0 }]}
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

        <ThemedText
          type="link"
          style={[
            {
              color: "#fff",
              alignSelf: "flex-start",
              marginTop: 5,
              textDecorationLine: "underline",
              marginHorizontal: 10,
            },
          ]}
        >
          Don't have a account,{" "}
          <ThemedText
            type="link"
            style={[
              {
                color: "#fff",
                textDecorationLine: "underline",
                fontWeight: "bold",
              },
            ]}
          >
            Sign Up
          </ThemedText>
        </ThemedText>
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
});
