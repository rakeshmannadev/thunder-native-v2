import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { AlbumResult } from "@/types";
import { router } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const AlbumResultCard = ({
  result,
  isLoading,
}: {
  result: AlbumResult;
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
        flexDirection: "row",
        alignItems: "center",
      }}
      onPressIn={() => router.push(`../../album/${result.id}`)}
    >
      <View className="flex-1 flex-row w-full gap-4 items-center">
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
        <View className="flex-col gap-2 items-start  h-full w-9/12">
          {isLoading ? (
            <SkeletonText className="w-20 h-4" />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: colors.text,
                letterSpacing: 0.5,
                fontWeight: 700,
                maxWidth: "85%",
              }}
            >
              {result.title}
            </Text>
          )}
          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: colors.textMuted,
                letterSpacing: 0.5,
                fontWeight: 500,
              }}
            >
              {result.artist}
            </Text>
          )}
        </View>
      </View>
      <ChevronRightIcon onPress={() => null} size={20} color={colors.icon} />
    </TouchableOpacity>
  );
};

export default AlbumResultCard;
