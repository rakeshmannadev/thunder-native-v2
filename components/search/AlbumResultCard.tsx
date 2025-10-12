import { AlbumResult } from "@/types";
import { Link } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { ThemedText } from "../ThemedText";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

const AlbumResultCard = ({
  result,
  isLoading,
}: {
  result: AlbumResult;
  isLoading: boolean;
}) => {
  return (
    <Card
      size="sm"
      variant="outline"
      className="rounded-2xl mb-3 w-full overflow-hidden"
    >
      <Link href={`../../album/${result.id}`}>
        <HStack space="md" className="items-center">
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
          <VStack space="md" className="items-start h-full">
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
                {result.artist}
              </ThemedText>
            )}
          </VStack>
        </HStack>
      </Link>
    </Card>
  );
};

export default AlbumResultCard;
