import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { VStack } from "@/components/ui/vstack";
import { Colors } from "@/constants/Colors";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import {
  CircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  Mail,
  User,
} from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [gender, setGender] = React.useState("male");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");

  const colorScheme = useColorScheme();
  const { signup } = useAuthStore();

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const handleSignUp = async () => {
    if (!email || !password || !name) return;
    if (password.length < 6) return;
    signup({ name, email, password, gender });
  };

  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      <Center className="mt-10 ">
        <Heading className=" text-2xl text-center">SignUp</Heading>
        <FormControl className="p-4 mt-10">
          <VStack space="4xl">
            <VStack space="xs">
              <Input className="min-w-[250px] group rounded-xl">
                <InputIcon
                  as={Mail}
                  className="ml-2 group-focus-within:text-green-400"
                />
                <InputField
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Input className="min-w-[250px] group rounded-xl">
                <InputIcon
                  as={User}
                  className="ml-2 group-focus-within:text-green-400"
                />
                <InputField
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Input className="text-center group rounded-xl  ">
                <InputIcon
                  as={LockKeyholeIcon}
                  className="ml-2 group-focus-within:text-green-400"
                />
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    className="group-focus-within:text-green-400"
                  />
                </InputSlot>
              </Input>
            </VStack>
            <VStack space="xs">
              <RadioGroup value={gender} onChange={setGender}>
                <HStack space="2xl">
                  <Radio value="male">
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>Male</RadioLabel>
                  </Radio>
                  <Radio value="female">
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>Female</RadioLabel>
                  </Radio>
                </HStack>
              </RadioGroup>
            </VStack>
            <Button className="ml-auto w-full rounded-3xl bg-green-500 hover:!bg-green-800">
              <ButtonText className="text-typography-0 ">Sign Up</ButtonText>
            </Button>
            {/* Divider section */}
            <View className="flex flex-row items-center justify-center gap-3">
              <Divider className="w-24" />
              <Text className="text-zinc-200 font-medium">Or</Text>
              <Divider className="w-24" />
            </View>

            <Button
              variant="outline"
              className="ml-auto w-full rounded-3xl hover:!bg-green-800"
              onPress={() => router.navigate("/auth/Login")}
            >
              <ButtonText className=" text-zinc-300 ">Login</ButtonText>
            </Button>
          </VStack>
        </FormControl>
      </Center>
    </SafeAreaView>
  );
};

export default Signup;
