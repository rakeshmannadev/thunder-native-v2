import { Colors } from "@/constants/Colors";
import { TopArtists } from "@/types";
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

type TopArtistCardProps = {
  artist: TopArtists;
  isLoading?: boolean;
};

const TopArtistCard = React.memo(
  ({ artist, isLoading = false }: TopArtistCardProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = () => {
      if (artist?.id) {
        router.push({ pathname: "/artist/[id]", params: { id: artist.id } });
      }
    };

    const imageUrl =
      artist?.image?.[2]?.link ||
      artist?.image?.[1]?.link ||
      artist?.image?.[0]?.link;

    return (
      <TouchableOpacity onPress={handlePress}>
        <Card
          size="sm"
          variant="ghost"
          className="p-2 rounded-lg !max-w-xs m-0 items-center"
        >
          <View className="items-center">
            {isLoading ? (
              <Skeleton className="max-w-36 max-h-36 w-36 h-36 rounded-full aspect-square mb-2" />
            ) : (
              <Image
                source={{
                  uri: imageUrl,
                }}
                className="mb-2 w-36 h-36 rounded-full aspect-square"
                alt={artist?.name}
              />
            )}
          </View>

          <VStack className="truncate w-32 items-center">
            <View className="w-full h-6 truncate items-center justify-center">
              {isLoading ? (
                <SkeletonText className="w-20 h-4 rounded-md" />
              ) : (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    letterSpacing: 0.5,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {artist?.name}
                </Text>
              )}
            </View>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  }
);

export default TopArtistCard;
