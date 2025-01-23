import { Alert, StyleSheet, TextInput, View, Text, Pressable } from "react-native";
import AuthHeader from "@/components/auth/header";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import ButtonGradient from "@/components/auth/button_gradient";

import { useState } from "react";
import Checkbox from "expo-checkbox";
import Button from "@/components/auth/button";
type FormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: any) => {
    Alert.alert("Login Successful", `Welcome, ${data.email}`);
  };

  const [isRememberChecked, setRememberChecked] = useState(false);

  return (
    <ThemedView
      style={styles.container}
      darkColor="#1E1E1E"
      lightColor="#1E1E1E"
    >
      <View>
        <AuthHeader />
      </View>
      
      <Text style={[styles.text, {color: 'green'}]} >
        Login
        <Text style={styles.text} >
          {' '}to get started!
        </Text>
      </Text>
      
      <ThemedView style={styles.formContainer}>
        {/* Email Input */}
        <Text style={[styles.paragraph,]}>
          Username
        </Text>
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
              placeholder="Email"
              placeholderTextColor="#999"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>
            {errors.email.message}
          </ThemedText>
        )}

        {/* Password Input */}
        <Text style={[styles.paragraph,]}>
          Password
        </Text>
        <Controller
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="password"
        />
        {errors.password && (
          <ThemedText style={styles.errorText}>
            {errors.password.message}
          </ThemedText>
        )}
        {/* Forgot Password */}
        
        <View style={[styles.section, {justifyContent: 'space-between'}]}>
          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={isRememberChecked}
              onValueChange={setRememberChecked}
              color={isRememberChecked ? '#4630EB' : undefined}
            />
            <Text style={styles.paragraph}>Remember me</Text>
          </View>
          <ThemedText type="link" style={[{textDecorationLine: 'underline'}]}>
            Forgot Password?
          </ThemedText>
        </View>
        
        
        {/* Submit Button */}
        <ButtonGradient label="Sign In" onPress={handleSubmit(onSubmit)} />
        
        {/* Or Google or Facebook */}
        <View style={[styles.section, {justifyContent: 'space-between'}]}>
          <Pressable >
            <Text>
              Google
            </Text>
          </Pressable>
          <Pressable>
            <Text>
              Facebook
            </Text>
          </Pressable>
        </View>
      </ThemedView>
      <ThemedText type="link">Don't have a account,{' '}
        <ThemedText type="link" style={[{textDecorationLine: 'underline', fontWeight: 'bold'}]}>
          Sign Up
        </ThemedText>
      </ThemedText>
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
    backgroundColor: 'transparent',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
    borderRadius: 10,
  },
  paragraph: {
    fontSize: 15,
    color: 'white', 
    padding: 10,
  },
});
