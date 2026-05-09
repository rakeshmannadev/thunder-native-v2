import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import { LogoIcon } from "@/constants/Icons";
import { borderRadius, screenPadding } from "@/constants/tokens";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import {
  EyeIcon,
  EyeOffIcon,
  Lock,
  Mail,
  ArrowRight,
  ChevronLeft,
} from "lucide-react-native";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const { top, bottom } = useSafeAreaInsets();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      return ToastAndroid.show(
        "Please enter email and password to login.",
        ToastAndroid.SHORT
      );
    }
    await login({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar barStyle={colorSchema === 'dark' ? 'light-content' : 'dark-content'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <LinearGradient
            colors={[colors.primary + '30', 'transparent']}
            style={StyleSheet.absoluteFill}
          />

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: bottom + 40, paddingTop: top + 20 }}
          >
            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <ChevronLeft color={colors.text} size={28} />
            </TouchableOpacity>

            <View style={styles.content}>
              {/* Header */}
              <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
                <LogoIcon styles={{ width: 100, height: 100 }} />
                <Heading style={[styles.title, { color: colors.text }]}>Welcome Back</Heading>
                <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
                  Sign in to continue your musical journey
                </ThemedText>
              </Animated.View>

              {/* Form */}
              <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.formContainer}>
                <VStack space="xl">
                  <VStack space="xs">
                    <ThemedText style={styles.label}>Email Address</ThemedText>
                    <Input style={[styles.input, { backgroundColor: colors.secondaryBackground }]}>
                      <InputIcon as={Mail} color={colors.textMuted} style={styles.inputIcon} />
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
                    <View style={styles.labelRow}>
                      <ThemedText style={styles.label}>Password</ThemedText>
                      <TouchableOpacity>
                        <ThemedText style={[styles.forgotText, { color: colors.primary }]}>Forgot?</ThemedText>
                      </TouchableOpacity>
                    </View>
                    <Input style={[styles.input, { backgroundColor: colors.secondaryBackground }]}>
                      <InputIcon as={Lock} color={colors.textMuted} style={styles.inputIcon} />
                      <InputField
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        style={{ color: colors.text }}
                        placeholderTextColor={colors.textMuted}
                      />
                      <InputSlot onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color={colors.textMuted} />
                      </InputSlot>
                    </Input>
                  </VStack>

                  <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: colors.primary }]}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={styles.loginBtnText}>Sign In</ThemedText>
                    <ArrowRight color="white" size={20} />
                  </TouchableOpacity>

                  <View style={styles.dividerContainer}>
                    <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
                    <ThemedText style={[styles.dividerText, { color: colors.textMuted }]}>or</ThemedText>
                    <View style={[styles.divider, { backgroundColor: colors.borderColor }]} />
                  </View>

                  <TouchableOpacity
                    style={[styles.signupLink]}
                    onPress={() => router.navigate("/auth/Signup")}
                  >
                    <ThemedText style={[styles.signupText, { color: colors.text }]}>
                      Don't have an account? <ThemedText style={{ color: colors.primary, fontWeight: '800' }}>Sign Up</ThemedText>
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
  backBtn: {
    paddingHorizontal: screenPadding.horizontal,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    gap: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
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
  loginBtn: {
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
  },
  signupLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  signupText: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default Login;
