import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CurrentlyBroadcastSong = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: screenPadding.horizontal,
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      <Card variant="filled" style={{ borderRadius: borderRadius.lg }}>
        <View className="flex flex-row items-stretch justify-between gap-4">
          <View className="flex flex-col gap-1 ">
            <Text
              style={{ color: "green" }}
              className="text-lg font-normal leading-normal"
            >
              Broadcasting by: @dj_vibes
            </Text>
            <ThemedText className=" text-base font-bold leading-tight">
              Midnight City
            </ThemedText>
            <ThemedText
              darkColor={colors.textMuted}
              className=" text-sm font-normal leading-normal"
            >
              M83
            </ThemedText>
          </View>
          <Image
            alt="album_art"
            style={{
              width: 120,
              height: 140,
              borderRadius: borderRadius.md,
            }}
            source={{
              uri: "https://c.saavncdn.com/317/Agneepath-Hindi-2011-20190603132941-500x500.jpg",
            }}
          />
        </View>
      </Card>
    </View>
  );
};

export default CurrentlyBroadcastSong;
