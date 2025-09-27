import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Divider } from "@/components/ui/divider";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { User2Icon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          Colors[colorScheme === "light" ? "light" : "dark"].background,
      }}
    >
      <View className="flex-1 p-4 justify-between">
        <View>
          <ThemedText type="title" className="text-center font-bold">
            Let you in
          </ThemedText>
          <View className="flex w-full justify-start items-center mt-20">
            <View className="flex justify-center items-center">
              <Image
                source={require("../../assets/images/Thunder_logo.png")}
                style={{
                  width: 70,
                  height: 70,
                }}
              />
            </View>
          </View>
        </View>
        <View className=" flex flex-col gap-6 mt-48">
          {/* Guest account section */}
          <TouchableOpacity className="flex flex-row justify-center rounded-3xl border-white border p-2 mb-2 w-full">
            <View className="flex flex-row gap-4 items-center">
              <User2Icon
                size={20}
                color={colorScheme === "light" ? "black" : "white"}
              />

              <ThemedText type="defaultSemiBold">
                Continue with guest account
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View className="flex flex-row items-center justify-center gap-3">
            <Divider className="w-24" />
            <Text className="text-zinc-200 font-medium">Or</Text>
            <Divider className="w-24" />
          </View>
          {/* Sign in with password section */}
          <TouchableOpacity className="flex flex-row bg-green-500 justify-center rounded-3xl p-2 mb-2 w-full">
            <View className="flex flex-row gap-4 items-center">
              <FontAwesome name="google" size={20} color={"black"} />

              <ThemedText type="defaultSemiBold" style={{ color: "#000" }}>
                Sign in with email and password
              </ThemedText>
            </View>
          </TouchableOpacity>

          <Text className="text-zinc-200 text-center mt-4">
            Don't have account?{" "}
            <Link
              className="text-green-500 font-semibold"
              href={"/auth/Signup"}
            >
              Singup
            </Link>{" "}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;
