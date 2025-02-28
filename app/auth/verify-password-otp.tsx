import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, } from "react-native";
import GradientText from "@/components/GradientText";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useAppSelector } from "@/redux/hook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendAccountOTP, sendPasswordOTP, resetPasswordVerified, verifyPasswordOTP } from "@/redux/slices/authSlice";

type FormData = {
  otp: number;
};

export default function SignUpScreen() {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const dispatch = useDispatch()
  const otpWatch = watch('otp')
  const searchParams = useLocalSearchParams<{ resendEmail: string }>()
  const { isPasswordVerified } = useAppSelector(state => state.auth)

  // Init
  useEffect(() => {
    dispatch(sendPasswordOTP({ email: searchParams.resendEmail }))
  }, [])

  useEffect(() => {
    if (isPasswordVerified) {
      // Reset
      dispatch(resetPasswordVerified(false))
      router.push(`/auth/set-password?email=${searchParams.resendEmail}`);
    }
  }, [isPasswordVerified])

  const onSubmit = (data: FormData) => {
    dispatch(verifyPasswordOTP({ email: searchParams.resendEmail, otp: otpWatch.toString() }))
  };
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };
  const handleResend = () => {
    dispatch(sendPasswordOTP({ email: searchParams.resendEmail }))
  }
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
          A password change OTP has been sent to your email.
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
          <TouchableOpacity onPress={handleResend}>
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
          </TouchableOpacity>
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
