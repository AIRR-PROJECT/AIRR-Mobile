import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
} from "react-native";
import AuthHeader from "@/components/auth/header";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Controller, useForm } from "react-hook-form";
import ButtonGradient from "@/components/auth/button_gradient";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import Button from "@/components/auth/button";
import GradientText from "@/components/GradientText";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonTransaparent from "@/components/auth/button_transparent";
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
  const handleToggleCheckbox = () => {
    setRememberChecked(!isRememberChecked);
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
                style={{ borderRadius: 20 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.password && styles.errorInput,
                    ]}
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
        {/* Forgot Password */}

        <View style={[styles.section, { justifyContent: "space-between" }]}>
          {/* Remember Me */}

          <Pressable style={styles.section} onPress={handleToggleCheckbox}>
            <Checkbox
              style={styles.checkbox}
              value={isRememberChecked}
              onValueChange={setRememberChecked}
              color={isRememberChecked ? "#B9FF66" : undefined}
            />
            <Text style={styles.paragraph}>Remember me</Text>
          </Pressable>
          <GradientText
            style={[
              styles.text,
              { textDecorationLine: "underline", fontSize: 15 },
            ]}
            colors={["#B9FF66", "#9DE8EE"]}
          >
            Forgot password?
          </GradientText>
        </View>

        {/* Submit Button */}
        <ButtonGradient label="Sign In" onPress={handleSubmit(onSubmit)} />

        {/* Other Options */}
        <ThemedText
          type="default"
          style={[{ color: "#fff", alignSelf: "center" }]}
        >
          Or
        </ThemedText>      
        {/* Or Google or Facebook */}
        <View style={[styles.section, { justifyContent: "space-between" }]}>
          <ButtonTransaparent label="Google" style={styles.otherButton}/>
          
          <ButtonTransaparent label="Facebook" style={styles.otherButton}/>
        </View>
      </ThemedView>
      <ThemedText type="link" style={[{ color: "#fff", alignSelf: "flex-start", marginTop: 5,textDecorationLine: "underline" }]}>
        Don't have a account,{" "}
        <ThemedText
          type="link"
          style={[{color:'#fff', textDecorationLine: "underline", fontWeight: "bold", }]}
        >
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

  otherButton: {
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    
  },

});
