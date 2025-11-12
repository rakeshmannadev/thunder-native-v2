import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { SongResult } from "@/types";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const SongResultCard = ({
  result,
  isLoading,
}: {
  result: SongResult;
  isLoading: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        marginBottom: 8,
        backgroundColor: colors.component,
        borderRadius: borderRadius.md,
        padding: 16,
      }}
      onPressIn={() => router.push(`../../song/${result.id}`)}
    >
      <View className="flex-row w-full gap-4 items-center">
        {isLoading ? (
          <Skeleton className="w-16 h-20 rounded-xl" />
        ) : (
          <Image
            source={{
              uri: `${result.image[result.image.length - 1].url}`,
            }}
            className="aspect-square w-24 rounded-xl"
          />
        )}
        <View className="flex-col gap-2 items-start h-full w-9/12">
          {isLoading ? (
            <SkeletonText className="w-20 h-4" />
          ) : (
            <ThemedText numberOfLines={1} type="subtitle">
              {result.title}
            </ThemedText>
          )}
          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <ThemedText numberOfLines={1} type="default" className=" max-w-48">
              {result.singers}
            </ThemedText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SongResultCard;
