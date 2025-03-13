import AuthHeader from "@/components/auth/AuthHeader";
import GradientText from "@/components/GradientText";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AuthButtonGradient from "@/components/auth/AuthButtonGradient";
import AuthButtonTransparent from "@/components/auth/AuthButtonTransparent";
import { router } from "expo-router";
import { resetAccountCreated } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hook";
type FormData = {
  firstName: string;
  lastName: string;
  username: string;
};

export default function SignUpFirstPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(resetAccountCreated(false));
  }, []);

  const onSubmit = (data: FormData) => {
    router.push(
      {
        pathname: "/auth/sign-up-second-page",
        params: {data: JSON.stringify(data)}
      },
    );
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
      <View
        style={{ alignSelf: "flex-start", padding: 10,  }}
      >
        <GradientText style={styles.text} colors={["#B9FF66", "#9DE8EE"]}>
          Join us today!
        </GradientText>
      <ThemedText style={styles.smalltext}>What should we call you?</ThemedText>
      </View>
      <ThemedView style={styles.formContainer}>
        {/* First name */}
        <View >
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
        {/* Last Name */}
        <View>
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

       
        {/* Next Button */}
        <AuthButtonGradient
          label="Next"
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
