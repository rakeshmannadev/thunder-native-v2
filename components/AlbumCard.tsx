import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { Album } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
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
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.component,
        borderRadius: borderRadius.md,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
      onPress={() =>
        router.push({ pathname: "/album/[id]", params: { id: album.id } })
      }
    >
      <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
        <View>
          {isLoading ? (
            <Skeleton className="max-w-36 max-h-36 rounded-md" />
          ) : (
            <Image
              source={{
                uri: album.image[album.image.length - 1].link,
              }}
              className="mb-1  w-36  rounded-md aspect-[263/240]"
              alt={album.name}
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
                {album.name}
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
                {album.subtitle}
              </Text>
            )}
          </View>
        </VStack>
      </Card>
    </TouchableOpacity>
  );
});

export default AlbumCard;
