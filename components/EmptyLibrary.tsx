import { BookHeartIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Button, ButtonText } from "./ui/button";

const EmptyLibrary = () => {
  const router = useRouter();
  const colorSchema = useColorScheme();

  const colors = Colors[colorSchema === "dark" ? "dark" : "light"];
  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
        },
      ]}
      className="flex flex-1 justify-center items-center gap-4 p-5 "
    >
      <BookHeartIcon size={96} color={colors.icon} />
      <ThemedText type="defaultSemiBold">Your Library is Empty</ThemedText>

      <View className="flex gap-10 items-center justify-center">
        <ThemedText
          type="default"
          style={{ fontSize: 19, width: 300, textAlign: "center" }}
          // textBreakStrategy="simple"
        >
          Library songs will appeare here, login now!
        </ThemedText>

        <Button
          variant="solid"
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.md,
          }}
          onPress={() => router.push("/auth/Login")}
          className=" min-w-full rounded-3xl "
        >
          <ButtonText style={{ color: colors.text }}>Login</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default EmptyLibrary;
