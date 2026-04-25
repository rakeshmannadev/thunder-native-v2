import { Colors } from "@/constants/Colors";
import { Featured } from "@/types";
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

type FeaturedCardProps = {
  featured: Featured;
  isLoading?: boolean;
};

const FeaturedCard = React.memo(
  ({ featured, isLoading = false }: FeaturedCardProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    const handlePress = () => {
      if (featured?.type === "playlist") {
        router.push({
          pathname: "/playlist/[id]",
          params: { id: featured.id },
        });
      }
    };

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
                  uri: featured?.image,
                }}
                className="mb-1 w-36 rounded-md aspect-[263/240]"
                alt={featured?.name}
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
                  {featured?.name}
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
                  {featured?.subtitle}
                </Text>
              )}
            </View>
          </VStack>
        </Card>
      </TouchableOpacity>
    );
  }
);

export default FeaturedCard;
