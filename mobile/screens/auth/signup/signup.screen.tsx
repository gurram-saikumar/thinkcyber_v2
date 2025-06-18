import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";

export default function SignUpScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });
  const [isChecked, setChecked] = useState(false);

  const handlePasswordValidation = (value: string) => {
    const password = value;
    const passwordSpecialCharacter = /(?=.*[!@#$&*])/;
    const passwordOneNumber = /(?=.*[0-9])/;
    const passwordSixValue = /(?=.{6,})/;

    if (!passwordSpecialCharacter.test(password)) {
      setError({
        ...error,
        password: "Write at least one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordOneNumber.test(password)) {
      setError({
        ...error,
        password: "Write at least one number",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!passwordSixValue.test(password)) {
      setError({
        ...error,
        password: "Write at least 6 characters",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({
        ...error,
        password: "",
      });
      setUserInfo({ ...userInfo, password: value });
    }
  };

  const handleSignIn = async () => {
    // Prevent API call if there is a password error
    if (error.password) {
      Toast.show(error.password, { type: "danger" });
      return;
    }
    setButtonSpinner(true);
    const requestData = {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password,
    };
    console.log('[SIGNUP REQUEST]', `${SERVER_URI}/registration`, requestData);
    await axios
      .post(`${SERVER_URI}/registration`, requestData)
      .then(async (res) => {
        await AsyncStorage.setItem(
          "activation_token",
          res.data.activationToken
        );
        Toast.show(res.data.message, {
          type: "success",
        });
        setUserInfo({
          name: "",
          email: "",
          password: "",
        });
        setButtonSpinner(false);
        router.push("/(routes)/verifyAccount");
      })
      .catch((error) => {
        setButtonSpinner(false);
        if (error.response) {
          console.log('[SIGNUP ERROR]', error.message, error.response.data);
          Toast.show(error.response.data?.message || "Registration failed!", {
            type: "danger",
          });
        } else {
          console.log('[SIGNUP ERROR]', error.message);
          Toast.show("Network or server error!", {
            type: "danger",
          });
        }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip}>
        <Text style={styles.skipText}>Sign Up Later</Text>
      </TouchableOpacity>

      <View style={styles.logoBox}>
        <Text style={styles.logo}>ThinkCyber</Text>
        <Text style={styles.heading}>Sign up</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name (Required)"
          value={userInfo.name}
          onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail (Required)"
          keyboardType="email-address"
          value={userInfo.email}
          onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password (Required)"
            secureTextEntry={!isPasswordVisible}
            value={userInfo.password}
            onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#747474"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.termsRow}>
          <TouchableOpacity onPress={() => setChecked(!isChecked)}>
            <View style={styles.checkbox}>
              {isChecked && <View style={styles.checkedBox} />}
            </View>
          </TouchableOpacity>
          <Text style={styles.termsText}>
            By creating an account, I accept ThinkCyber's{' '}
            <Text style={styles.link}>Terms of Use</Text> and{' '}
            <Text style={styles.link}>Privacy Notice</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: isChecked ? '#0056D2' : '#D3D3D3' }]}
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  skip: {
    alignItems: 'flex-end',
    paddingRight: 20,
    marginBottom: 10,
  },
  skipText: {
    color: '#2467EC',
    fontWeight: '600',
  },
  logoBox: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0056D2',
  },
  heading: {
    fontSize: 22,
    marginTop: 8,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 20,
    rowGap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#555',
    marginRight: 10,
    marginTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: 12,
    height: 12,
    backgroundColor: '#2467EC',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#444',
  },
  link: {
    color: '#2467EC',
    textDecorationLine: 'underline',
  },
  createButton: {
    marginTop: 20,
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
