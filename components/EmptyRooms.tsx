import { CoffeeIcon } from "lucide-react-native";
import React from "react";
import { useColorScheme, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { useRouter } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Button, ButtonText } from "./ui/button";

const EmptyRooms = () => {
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
      <CoffeeIcon size={96} color={colors.icon} />
      <ThemedText type="defaultSemiBold">
        Oops, looks like you are not logged in
      </ThemedText>

      <View className="flex gap-10 items-center justify-center">
        <ThemedText
          type="default"
          style={{ fontSize: 19, width: 300, textAlign: "center" }}
          // textBreakStrategy="simple"
        >
          Rooms will appear here, login now to explore and join rooms!
        </ThemedText>

        <Button
          variant="solid"
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.lg,
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

export default EmptyRooms;
