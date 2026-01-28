import { Heading } from "@/components/ui/heading";
import React from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Colors } from "@/constants/Colors";
import { LogoIcon } from "@/constants/Icons";
import { borderRadius } from "@/constants/tokens";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import {
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  Mail,
} from "lucide-react-native";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const colorSchema = useColorScheme();

  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];
  const { login } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    if (email.trim() === "" || password.trim() === "") {
      return ToastAndroid.show(
        "Please enter email and password to login.",
        ToastAndroid.SHORT
      );
    }
    await login({ email, password });
  };

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Center className="mt-10">
          <View className="gap-8">
            <LogoIcon styles={{ width: 86 }} />
            <Heading className=" text-4xl text-center">Sign in</Heading>
          </View>
          <FormControl className="p-4 mt-24">
            <View className="flex flex-col gap-10">
              <View className="flex flex-col gap-5">
                <Input className="min-w-[250px]  rounded-xl">
                  <InputIcon as={Mail} className="ml-2" />
                  <InputField
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                  />
                </Input>
              </View>
              <View className="flex flex-col gap-4">
                <Input className="text-center rounded-xl  ">
                  <InputIcon as={LockKeyholeIcon} className="ml-2" />
                  <InputField
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <InputSlot className="pr-3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      className=""
                    />
                  </InputSlot>
                </Input>
              </View>
              <Button
                variant="solid"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.lg,
                }}
                onPress={() => handleLogin(email, password)}
                className="ml-auto w-full rounded-3xl bg-green-500 hover:!bg-green-800"
              >
                <ButtonText style={{ color: colors.text }}>Login</ButtonText>
              </Button>

              <View className="flex flex-row items-center justify-center gap-3">
                <Divider className="w-24" />
                <Text className="text-zinc-200 font-medium">Or</Text>
                <Divider className="w-24" />
              </View>

              <Button
                variant="outline"
                className="ml-auto w-full rounded-3xl hover:!bg-green-800"
                onPress={() => router.navigate("/auth/Signup")}
              >
                <ButtonText style={{ color: colors.text }}>Sign Up</ButtonText>
              </Button>
            </View>
          </FormControl>
        </Center>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
