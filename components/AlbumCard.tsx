import { Colors } from "@/constants/Colors";
import { Album } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { Card } from "./ui/card";
import { Skeleton, SkeletonText } from "./ui/skeleton";
import { VStack } from "./ui/vstack";

type SectionGridProps = {
  album: Album;
  isLoading: boolean;
};
const AlbumCard = React.memo(({ album, isLoading }: SectionGridProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/album/[id]", params: { id: album.albumId } })
      }
    >
      <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
        <View>
          {isLoading ? (
            <Skeleton className="w-36 rounded-md" />
          ) : (
            <Image
              source={{
                uri: `${album.imageUrl}`,
              }}
              className="mb-1  w-36  rounded-md aspect-[263/240]"
              alt={album.title}
            />
          )}
        </View>

        <VStack className="truncate w-32 ">
          <View className="w-full h-6 truncate">
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
                }}
              >
                {album.title}
              </Text>
            )}
          </View>
          <View className="w-full h-6">
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
                {album.artists.primary.map((artist) => artist.name).join(", ")}
              </Text>
            )}
          </View>
        </VStack>
      </Card>
    </Pressable>
  );
});

export default AlbumCard;
