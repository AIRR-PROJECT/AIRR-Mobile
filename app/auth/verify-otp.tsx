import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import GradientText from "@/components/GradientText";
import AnimatedPressable from "@/components/AnimatedPressable";
type FormData = {
  otp: number;
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const onSubmit = (data: any) => {
    router.push("/auth/set-password");
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

      <View
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <GradientText style={[styles.text]} colors={["#B9FF66", "#9DE8EE"]}>
          Verify code
        </GradientText>
      </View>

      <View style={{ alignSelf: "flex-start", flexDirection: "row" }}>
        <ThemedText style={styles.paragraph}>
          An authentication code has been sent to your email.
        </ThemedText>
      </View>

      <ThemedView style={styles.formContainer}>
        {/* OTP Input */}
        <Text style={[styles.paragraph]}>Enter OTP</Text>
        <Controller
          control={control}
          rules={{
            required: "OTP is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Invalid OTP",
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
                style={[styles.input, errors.otp ? styles.errorInput : {}]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? String(value) : ""}
                placeholder="OTP"
                keyboardType="numeric"
              />
            </LinearGradient>
          )}
          name="otp"
        />
        {errors.otp && (
          <Text style={styles.errorText}>{errors.otp.message}</Text>
        )}

        <ThemedText
          type="link"
          style={[
            {
              color: "#fff",
              alignSelf: "flex-start",
              marginTop: 20,
              marginHorizontal: 10,
            },
          ]}
        >
          Didn't receive a code?{" "}
          <ThemedText
            type="default"
            style={[
              {
                color: "#B9FF66",
                fontWeight: "bold",
              },
            ]}
          >
            Resend
          </ThemedText>
        </ThemedText>
        <AuthButtonGradient
          style={{ width: "100%", marginTop: 10, marginHorizontal: 0 }}
          label="Verify OTP"
          onPress={handleSubmit(onSubmit)}
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
    marginBottom: -20,
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
