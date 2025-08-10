import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthHeader from "@/components/auth/AuthHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import GradientText from "@/components/GradientText";
import { EffectCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sendAccountOTP, verifyAccountOTP } from "@/redux/slices/authSlice";
import { VerifyAccountCredentials } from "@/interfaces/authInterface";
import { useAppDispatch, useAppSelector } from "@/redux/hook";

type FormData = {
  otp: number;
};

const useMountEffect = (fun: EffectCallback) => useEffect(fun, []);

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  const searchParams = useLocalSearchParams<{ resendEmail: string }>();
  const { isLoggedIn, isAccountVerified } = useAppSelector(
    (state) => state.auth
  );

  // Add timeout state
  const [resendTimeout, setResendTimeout] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  // Init
  useEffect(() => {
    dispatch(sendAccountOTP({ email: searchParams.resendEmail }));
  }, []);

  useEffect(() => {
    if (isLoggedIn && isAccountVerified) {
      router.dismissTo("/auth/login");
    }
  }, [isLoggedIn, isAccountVerified]);

  // Countdown effect for resend timeout
  useEffect(() => {
    let interval: any;

    if (resendTimeout > 0) {
      interval = setInterval(() => {
        setResendTimeout((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 5000); // 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendTimeout]);

  const onSubmit = (data: any) => {
    const verifyData: VerifyAccountCredentials = {
      email: searchParams.resendEmail,
      otp: data.otp,
    };

    dispatch(verifyAccountOTP(verifyData));
  };
  const handleBack = () => {
    router.back();
  };
  const handleResend = () => {
    if (!canResend) {
      ToastAndroid.show(
        `Please wait ${resendTimeout} seconds before resending`,
        ToastAndroid.SHORT
      );
      return;
    }

    dispatch(sendAccountOTP({ email: searchParams.resendEmail }))
      .then((result) => {
        // Check if the request was successful
        if (result.meta.requestStatus === "fulfilled") {
          ToastAndroid.show("OTP resent successfully", ToastAndroid.SHORT);

          // Start 1-minute countdown
          setCanResend(false);
          setResendTimeout(60); // 1 minute
        } else {
          ToastAndroid.show(
            "Failed to resend OTP. Please try again.",
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        ToastAndroid.show(
          "Failed to resend OTP. Please try again.",
          ToastAndroid.SHORT
        );
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView
        style={styles.container}
        darkColor="#1E1E1E"
        lightColor="#1E1E1E"
      >
        <AuthHeader />
        <Pressable
          onPress={handleBack}
          style={{ alignSelf: "flex-start", padding: 10 }}
        >
          <ThemedText style={[{ color: "white" }]}>{" < "}Back</ThemedText>
        </Pressable>

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
            Your account has not been verified. Therefore, a verification OTP
            has been sent to your email.
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
            type="default"
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={!canResend}
              style={{ opacity: canResend ? 1 : 0.5 }}
            >
              <ThemedText
                type="default"
                style={[
                  {
                    color: canResend ? "#B9FF66" : "#888",
                    fontWeight: "bold",
                    marginTop: 5,
                  },
                ]}
              >
                {canResend ? "Resend" : `Can resend in (${resendTimeout}s)`}
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
    </ScrollView>
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
