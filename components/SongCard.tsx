import React from "react";
import { Image, Text, View } from "react-native";
import { Song } from "../types/index";
import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import PlayButton from "./songs/PlayButton";
import { Skeleton, SkeletonText } from "./ui/skeleton";

const SongCard = React.memo(
  ({ song, isLoading }: { song: Song; isLoading: boolean }) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme === "light" ? "light" : "dark"];

    return (
      <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
        <View>
          {isLoading ? (
            <Skeleton className="max-w-36 max-h-36 rounded-md" />
          ) : (
            <Image
              source={{
                uri: song.imageUrl,
              }}
              className="mb-1  w-36  rounded-md aspect-[263/240]"
              alt="image"
            />
          )}
          {!isLoading && <PlayButton song={song} />}
        </View>

        <VStack className=" w-36 ">
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
                {song.title}
              </Text>
            )}
          </View>
          <View className="w-full h-6 truncate">
            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  fontWeight: 500,
                }}
              >
                {song.artists.primary.map((artist) => artist.name).join(", ")}
              </Text>
            )}
          </View>
        </VStack>
      </Card>
    );
  }
);

export default SongCard;
