import { Colors } from "@/constants/Colors";
import { Show } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { Card } from "./ui/card";
import { Skeleton, SkeletonText } from "./ui/skeleton";
import { VStack } from "./ui/vstack";

type ShowCardProps = {
  show: Show;
  isLoading: boolean;
};

const ShowCard = React.memo(({ show, isLoading }: ShowCardProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  
  const imageUrl = show.image && show.image.length > 0 
    ? show.image[show.image.length - 1].link 
    : show.bannerImage;

  return (
    <Pressable
      onPress={() =>
        // Using playlist route assuming it exists or fallback
        router.push({ pathname: "/playlist/[id]", params: { id: show.url } })
      }
    >
      <Card size="md" variant="ghost" className="p-2 rounded-lg m-0">
        <View>
          {isLoading ? (
            <Skeleton className="max-w-36 max-h-36 rounded-md" />
          ) : (
            <Image
              source={{
                uri: `${imageUrl}`,
              }}
              className="mb-1 w-54 rounded-md aspect-[263/240]"
              alt={show.name}
            />
          )}
        </View>

        <VStack className="truncate w-48">
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
                {show.name}
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
                {show.subtitle || (show.seasonNumber ? `Season ${show.seasonNumber}` : "")}
              </Text>
            )}
          </View>
        </VStack>
      </Card>
    </Pressable>
  );
});

export default ShowCard;
