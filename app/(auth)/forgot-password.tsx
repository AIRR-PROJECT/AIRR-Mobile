import Button from "@/components/auth/button";
import ButtonGradient from "@/components/auth/button_gradient";
import AuthHeader from "@/components/auth/header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { LinearGradient } from "expo-linear-gradient";
import { Controller, Form, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";

type FormData = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <ThemedView>
      <AuthHeader />
      <ThemedText>{"< "}Back to login</ThemedText>
      <LinearGradient colors={["#9DE8EE", "#B9FF66"]} style={{ flex: 1 }}>
        <ThemedText>Forgot password?</ThemedText>
      </LinearGradient>

      <ThemedText>
        Don’t worry, happens to all of us. Enter your email below to recover
        your password
      </ThemedText>

      <ThemedView>
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
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
            />
          )}
          name="email"
          defaultValue=""
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>
            {errors.email.message}
          </ThemedText>
        )}
        <ButtonGradient label="Reset Password" />

        <Text>Or</Text>

        <View style={[styles.section, { justifyContent: "space-between" }]}>
          <Pressable>
            <Text>Google</Text>
          </Pressable>
          <Pressable>
            <Text>Facebook</Text>
          </Pressable>
        </View>

        <ThemedText type="link">
          Don't have a account,{" "}
          <ThemedText
            type="link"
            style={[{ textDecorationLine: "underline", fontWeight: "bold" }]}
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
    fontSize: 50,
    fontWeight: "bold",
    marginVertical: 10,
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
    borderRadius: 5,
    marginBottom: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
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
});
