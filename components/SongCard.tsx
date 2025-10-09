import React from "react";
import { Image, View } from "react-native";
import { Song } from "../types/index";
import { ThemedText } from "./ThemedText";
import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";

import PlayButton from "./songs/PlayButton";
import { Skeleton, SkeletonText } from "./ui/skeleton";

const SongCard = ({ song, isLoading }: { song: Song; isLoading: boolean }) => {
  return (
    <Card size="sm" variant="ghost" className="p-2 rounded-lg !max-w-xs  m-0">
      <View>
        {isLoading ? (
          <Skeleton className="w-36 rounded-md" />
        ) : (
          <Image
            source={{
              uri: song.imageUrl,
            }}
            className="mb-1  w-36  rounded-md aspect-[263/240]"
            alt="image"
          />
        )}
        <PlayButton song={song} />
      </View>

      <VStack className=" w-36 ">
        <View className="w-full h-6 truncate">
          {isLoading ? (
            <SkeletonText className="w-20 h-4" />
          ) : (
            <ThemedText type="defaultSemiBold">{song.title}</ThemedText>
          )}
        </View>
        <View className="w-full h-6 truncate">
          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <ThemedText type="default">
              {song.artists.primary.map((artist) => artist.name).join(", ")}
            </ThemedText>
          )}
        </View>
      </VStack>
    </Card>
  );
};

export default SongCard;
