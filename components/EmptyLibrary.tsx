import { Music2Icon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { colors } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Button, ButtonText } from "./ui/button";

const EmptyLibrary = () => {
  const router = useRouter();
  return (
    <View className="flex flex-1 dark:bg-dark-background justify-evenly items-center gap-4 p-5 ">
      <Music2Icon size={56} color={colors.icon} />

      <View className="flex gap-10 items-center">
        <ThemedText type="subtitle" style={{ fontSize: 19 }}>
          Library songs will appeare here,login now!
        </ThemedText>

        <Button
          onPress={() => router.push("/auth/Login")}
          className=" min-w-full rounded-3xl bg-green-500"
        >
          <ButtonText className="text-typography-0 ">Login</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default EmptyLibrary;
