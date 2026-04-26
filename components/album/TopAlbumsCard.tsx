import { Colors } from "@/constants/Colors";
import { TopAlbums } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Card } from "../ui/card";
import { Skeleton, SkeletonText } from "../ui/skeleton";
import { VStack } from "../ui/vstack";

type TopAlbumsCardProps = {
  album: TopAlbums;
  isLoading?: boolean;
};

const TopAlbumsCard = React.memo(
  ({ album, isLoading = false }: TopAlbumsCardProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];
    console.log("album", album);
    const handlePress = () => {
      if (album?.album_id) {
        router.push({
          pathname: "/album/[id]",
          params: { id: album.album_id },
        });
      }
    };

    const imageUrl =
      album?.image?.[2]?.link ||
      album?.image?.[1]?.link ||
      album?.image?.[0]?.link;

    // Extract artists from artistMap.primaryArtists or artists
    const artists =
      album?.artist_map?.artists?.map((a) => a.name).join(", ") ||
      "Unknown Artist";

    return (
      <TouchableOpacity onPress={handlePress}>
        <Card
          size="sm"
          variant="ghost"
          className="p-2 rounded-lg !max-w-xs m-0"
        >
          <View>
            {isLoading ? (
              <Skeleton className="max-w-36 max-h-36 rounded-md aspect-[263/240]" />
            ) : (
              <Image
                source={{
                  uri: imageUrl,
                }}
                className="mb-1 w-36 rounded-md aspect-[263/240]"
                alt={album?.name || "Album"}
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
                    fontWeight: "700",
                  }}
                >
                  {album?.name}
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
                    fontWeight: "500",
                  }}
                >
                  {artists}
                </Text>
              )}
            </View>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  }
);

export default TopAlbumsCard;
