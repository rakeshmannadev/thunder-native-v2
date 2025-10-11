import { Album } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Card } from "./ui/card";
import { Skeleton, SkeletonText } from "./ui/skeleton";
import { VStack } from "./ui/vstack";

type SectionGridProps = {
  album: Album;
  isLoading: boolean;
};
const AlbumCard = ({ album, isLoading }: SectionGridProps) => {
  const router = useRouter();
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
              <ThemedText type="defaultSemiBold">{album.title}</ThemedText>
            )}
          </View>
          <View className="w-full h-6">
            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText type="default">
                {album.artists.primary.map((artist) => artist.name).join(", ")}
              </ThemedText>
            )}
          </View>
        </VStack>
      </Card>
    </Pressable>
  );
};

export default AlbumCard;
