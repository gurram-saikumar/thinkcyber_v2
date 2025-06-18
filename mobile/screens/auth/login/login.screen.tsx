import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import { commonStyles } from "@/styles/common/common.styles";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [required, setRequired] = useState("");
  const [error, setError] = useState({
    password: "",
  });

  let [fontsLoaded, fontError] = useFonts({
    Raleway_600SemiBold,
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
    await axios
      .post(`${SERVER_URI}/login`, {
        email: userInfo.email,
        password: userInfo.password,
      })
      .then(async (res) => {
        await AsyncStorage.setItem("access_token", res.data.accessToken);
        await AsyncStorage.setItem("refresh_token", res.data.refreshToken);
        router.push("/(tabs)");
      })
      .catch((error) => {
        console.log(error);
        Toast.show("Email or password is not correct!", {
          type: "danger",
        });
      });
  };

return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1, marginTop: 18 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Skip / Later */}
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Sign Up Later</Text>
        </TouchableOpacity>

        {/* Branding */}
        <View style={styles.headerPanel}>
          <Text style={styles.brandTitle}>ThinkCyber</Text>
          <Text style={styles.brandSubTitle}>
            Learn coding from industry experts and top universities
          </Text>
        </View>

        {/* Login or Signup Title */}
        <Text style={styles.sectionTitle}>Log in or Sign up</Text>

        {/* Social Buttons */}
        {/* <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={20} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View> */}

        {/* SSO */}
        <TouchableOpacity style={styles.ssoButton}>
          <SimpleLineIcons name="organization" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.ssoText}>Google</Text>
        </TouchableOpacity>

        {/* Login with Email */}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push("/(routes)/sign-in-email")}
        >
          <Text style={styles.emailText}>Log in with Email</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        {/* Sign Up */}
        <TouchableOpacity
          onPress={() => router.push("/(routes)/sign-up")}
          style={styles.signupButton}
        >
          {buttonSpinner ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.signupText}>New to ThinkCyber? Create an Account!</Text>
          )}
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legalText}>
          By creating an account under any method above, you accept ThinkCyber’s{" "}
          <Text style={styles.legalLink}>Terms of Use</Text> and{" "}
          <Text style={styles.legalLink}>Privacy Notice</Text>.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  skipButton: {
    alignSelf: "flex-start",
    paddingBottom: 10,
  },
  skipText: {
    color: "#2467EC",
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
  },
  headerPanel: {
    backgroundColor: "#2467EC",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 8,
  },
  brandTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
  },
  brandSubTitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Nunito_400Regular",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  socialText: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Nunito_400Regular",
  },
  ssoButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ssoText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  emailButton: {
    borderWidth: 1,
    borderColor: "#2467EC",
    borderRadius: 6,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  emailText: {
    color: "#2467EC",
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
    fontFamily: "Nunito_400Regular",
  },
  signupButton: {
    backgroundColor: "#2467EC",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 24,
  },
  signupText: {
    color: "white",
    fontFamily: "Raleway_700Bold",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  legalText: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 10,
    lineHeight: 18,
    fontFamily: "Nunito_400Regular",
  },
  legalLink: {
    color: "#2467EC",
    textDecorationLine: "underline",
  },
});
