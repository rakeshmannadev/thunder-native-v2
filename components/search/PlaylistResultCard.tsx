import { PlaylistResult } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { Card } from "../ui/card";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const PlaylistResultCard = ({
  result,
  isLoading,
}: {
  result: PlaylistResult;
  isLoading: boolean;
}) => {
  return (
    <Card
      size="sm"
      variant="outline"
      className="rounded-2xl mb-3 w-full overflow-hidden"
    >
      <Link href={`../../playlist/${result.id}`}>
        <View className="flex-row gap-2 items-center w-full">
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
          <View className="items-start h-full max-w-full gap-2">
            {isLoading ? (
              <SkeletonText className="w-20 h-4" />
            ) : (
              <ThemedText type="subtitle" numberOfLines={1}>
                {result.title}
              </ThemedText>
            )}
            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText type="default" numberOfLines={1}>
                {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
              </ThemedText>
            )}
          </View>
        </View>
      </Link>
    </Card>
  );
};

export default PlaylistResultCard;
