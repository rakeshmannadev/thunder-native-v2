import { colors } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { Artist, Song } from "@/types";
import { EllipsisVerticalIcon, PlayIcon } from "lucide-react-native";
import React from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import MusicVisualizer from "../songs/MusicVisualizer";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const AlbumItem = ({ isLoading, song }: { isLoading: boolean; song: Song }) => {
  const { status } = usePlayer();
  const { currentSong, setCurrentSong } = usePlayerStore();
  const isActive = currentSong?.audioUrl == song.audioUrl;

  return (
    <TouchableOpacity
      onPress={() => setCurrentSong(song)}
      className="flex flex-row gap-5 justify-between items-center p-2 rounded-xl  mb-4 "
    >
      <View>
        {isLoading ? (
          <Skeleton variant="rounded" className="w-12 h-10" />
        ) : (
          <Image
            source={{
              uri: `${song.imageUrl}`,
            }}
            alt=""
            style={{
              width: 56,
              height: 40,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        )}
        {isActive && (
          <View
            className="absolute top-0 left-0 h-12 w-16 rounded-lg flex flex-row items-center justify-center 
             bg-gray-600/80"
          >
            {status.playing ? (
              <MusicVisualizer />
            ) : (
              <PlayIcon color={colors.icon} size={25} />
            )}
          </View>
        )}
      </View>
      <View className="flex flex-1 gap-1 pr-4 ">
        {isLoading ? (
          <SkeletonText className="w-28 h-4" />
        ) : (
          <ThemedText numberOfLines={1} type="defaultSemiBold">
            {song.title}
          </ThemedText>
        )}
        <View className="flex flex-row items-center gap-2">
          {isLoading ? (
            <SkeletonText className="w-24 h-4" />
          ) : (
            <View className="flex-1 flex-row items-center justify-start gap-2">
              <ThemedText numberOfLines={1} type="default">
                {song.artists.primary
                  .map((artist: Artist) => artist.name)
                  .join(", ")}{" "}
                {"●"}
              </ThemedText>

              <ThemedText className="text-xs">
                {formatDuration(song.duration ?? 0)}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      <Pressable
        onPressIn={(e) => e.stopPropagation()}
        className="w-fit p-2 rounded-full hover:bg-hover-background"
      >
        <EllipsisVerticalIcon size={20} color={colors.icon} />
      </Pressable>
    </TouchableOpacity>
  );
};

export default AlbumItem;
