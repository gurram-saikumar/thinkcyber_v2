import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri"; 

const LoginWithEmail = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleLogin = async () => {
    if (password.length < 8) {
      setShowPasswordError(true);
      return;
    }
    setShowPasswordError(false);

    try {
      const res = await axios.post(`${SERVER_URI}/loginEmail`, {
        email,
        password,
      });

      if (res.data && res.data.success) {
        await AsyncStorage.setItem("access_token", res.data.accessToken);
        await AsyncStorage.setItem("refresh_token", res.data.refreshToken);

        Alert.alert("Login successful!");

      } else {
        Alert.alert("Login failed", res.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("An error occurred", "Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <TouchableOpacity style={styles.signupLater}>
        <Text style={styles.signupLaterText}>Sign Up Later</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>ThinkCyber</Text>
      <Text style={styles.subtitle}>Log into your account</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail (Required)</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password (Required)</Text>
        <TextInput
          style={[
            styles.input,
            showPasswordError && styles.inputError,
          ]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {showPasswordError && (
          <Text style={styles.errorText}>
            Password must be at least 8 characters.
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginWithEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", 
    paddingHorizontal: 24,
  },
  signupLater: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  signupLaterText: {
    color: "#91BFFF",
    fontWeight: "bold",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#91BFFF",
    alignSelf: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#E0E0E0",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  errorText: {
    color: "#FF6B6B",
    marginBottom: 12,
  },
  forgot: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#91BFFF",
  },
  loginButton: {
    backgroundColor: "#91BFFF",
    borderRadius: 6,
    paddingVertical: 14,
    marginTop: 24,
  },
  loginButtonText: {
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});