import { Music2Icon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/button";

const EmptyLibrary = () => {
  const router = useRouter();
  return (
    <View className="flex flex-1 dark:bg-dark-background justify-center items-center gap-4 p-5 ">
      <Music2Icon className="animate-bounce w-10 h-10 " />

      <ThemedText type="subtitle">
        Library songs will appeare here, login now !
      </ThemedText>

      <Button
        onPress={() => router.navigate("/auth")}
        variant="outline"
        size="xl"
        className="rounded-xl w-full p-3"
      >
        <ThemedText type="defaultSemiBold">Login </ThemedText>
      </Button>
    </View>
  );
};

export default EmptyLibrary;
