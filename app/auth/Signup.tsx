import { ThemedText } from "@/components/ThemedText";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { LogoIcon } from "@/constants/Icons";
import { screenPadding } from "@/constants/tokens";
import { setToken } from "@/helpers/auth.helper";
import { showToast } from "@/hooks/useToastMessage";
import { setCachedToken } from "@/lib/axios";
import { signup } from "@/services/authServices";
import useUserStore from "@/store/useUserStore";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
  Lock,
  Mail,
  UserIcon,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [gender, setGender] = React.useState("male");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");

  const { top, bottom } = useSafeAreaInsets();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];

  const { setCurrentUser } = useUserStore();

  const router = useRouter();

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: (authData: object) => signup(authData),
    onSuccess: (response: any) => {
      const user = response.user as User;
      const token = response.accessToken as string;
      setCurrentUser(user);
      setToken("user", JSON.stringify(user));
      setToken("accessToken", token);
      setCachedToken(token);
    },
  });

  const handleSignUp = async () => {
    if (
      email.trim() === "" ||
      name.trim() === "" ||
      password.trim() === "" ||
      gender.trim() === ""
    ) {
      return showToast("Please enter all details to create an account.");
    }
    if (password.length < 6) {
      return showToast("Password must have at least 6 characters");
    }
    signupMutation({ name, email, password, gender });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <LinearGradient
            colors={[colors.primary + "30", "transparent"]}
            style={StyleSheet.absoluteFill}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: bottom + 40,
              paddingTop: top + 40,
            }}
          >
            <View style={styles.content}>
              {/* Header */}
              <Animated.View
                entering={FadeInUp.duration(800)}
                style={styles.header}
              >
                <LogoIcon styles={{ width: 100, height: 100 }} />
                <Heading style={[styles.title, { color: colors.text }]}>
                  Create Account
                </Heading>
                <ThemedText
                  style={[styles.subtitle, { color: colors.textMuted }]}
                >
                  Join Thunder and explore millions of songs
                </ThemedText>
              </Animated.View>

              {/* Form */}
              <Animated.View
                entering={FadeInDown.delay(200).duration(800)}
                style={styles.formContainer}
              >
                <VStack space="xl">
                  <VStack space="xs">
                    <ThemedText style={styles.label}>Full Name</ThemedText>
                    <Input
                      style={[
                        styles.input,
                        { backgroundColor: colors.secondaryBackground },
                      ]}
                    >
                      <InputIcon
                        as={UserIcon}
                        color={colors.textMuted}
                        style={styles.inputIcon}
                      />
                      <InputField
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                        style={{ color: colors.text }}
                        placeholderTextColor={colors.textMuted}
                      />
                    </Input>
                  </VStack>

                  <VStack space="xs">
                    <ThemedText style={styles.label}>Email Address</ThemedText>
                    <Input
                      style={[
                        styles.input,
                        { backgroundColor: colors.secondaryBackground },
                      ]}
                    >
                      <InputIcon
                        as={Mail}
                        color={colors.textMuted}
                        style={styles.inputIcon}
                      />
                      <InputField
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={{ color: colors.text }}
                        placeholderTextColor={colors.textMuted}
                      />
                    </Input>
                  </VStack>

                  <VStack space="xs">
                    <ThemedText style={styles.label}>Password</ThemedText>
                    <Input
                      style={[
                        styles.input,
                        { backgroundColor: colors.secondaryBackground },
                      ]}
                    >
                      <InputIcon
                        as={Lock}
                        color={colors.textMuted}
                        style={styles.inputIcon}
                      />
                      <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        style={{ color: colors.text }}
                        placeholderTextColor={colors.textMuted}
                      />
                      <InputSlot
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                      >
                        <InputIcon
                          as={showPassword ? EyeIcon : EyeOffIcon}
                          color={colors.textMuted}
                        />
                      </InputSlot>
                    </Input>
                  </VStack>

                  {/* Gender Selection */}
                  <VStack space="xs">
                    <ThemedText style={styles.label}>Gender</ThemedText>
                    <View style={styles.genderRow}>
                      {["male", "female"].map((g) => (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setGender(g)}
                          style={[
                            styles.genderOption,
                            {
                              backgroundColor:
                                gender === g
                                  ? colors.primary
                                  : colors.secondaryBackground,
                              borderColor:
                                gender === g
                                  ? colors.primary
                                  : colors.borderColor,
                            },
                          ]}
                        >
                          <CheckCircle2
                            size={18}
                            color={gender === g ? "white" : "transparent"}
                          />
                          <ThemedText
                            style={[
                              styles.genderText,
                              { color: gender === g ? "white" : colors.text },
                            ]}
                          >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </VStack>

                  <TouchableOpacity
                    style={[
                      styles.signupBtn,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSignUp}
                    activeOpacity={0.8}
                    disabled={isPending}
                  >
                    <ThemedText style={styles.signupBtnText}>
                      {isPending ? "Creating account..." : "Create account"}
                    </ThemedText>
                    {isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <ArrowRight color="white" size={20} />
                    )}
                  </TouchableOpacity>

                  <View style={styles.dividerContainer}>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.borderColor },
                      ]}
                    />
                    <ThemedText
                      style={[styles.dividerText, { color: colors.textMuted }]}
                    >
                      or
                    </ThemedText>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.borderColor },
                      ]}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.loginLink, { borderColor: colors.primary }]}
                    onPress={() => router.navigate("/auth/Login")}
                  >
                    <ThemedText
                      style={[styles.loginText, { color: colors.text }]}
                    >
                      Already have an account?{" "}
                      <ThemedText
                        style={{ color: colors.primary, fontWeight: "800" }}
                      >
                        Login
                      </ThemedText>
                    </ThemedText>
                  </TouchableOpacity>
                </VStack>
              </Animated.View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  formContainer: {
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    height: 60,
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    paddingRight: 16,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  genderText: {
    fontSize: 16,
    fontWeight: "700",
  },
  signupBtn: {
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signupBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Signup;
