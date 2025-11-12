import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { Artist, Song } from "@/types";
import { useRouter } from "expo-router";
import { EllipsisVerticalIcon, PlayIcon } from "lucide-react-native";
import React from "react";
import {
  Image,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MusicVisualizer from "../songs/MusicVisualizer";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const AlbumItem = ({ isLoading, song }: { isLoading: boolean; song: Song }) => {
  const router = useRouter();

  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { status } = usePlayer();
  const { currentSong, setCurrentSong } = usePlayerStore();
  const isActive = currentSong?.audioUrl == song.audioUrl;

  return (
    <TouchableOpacity
      onPress={() => setCurrentSong(song)}
      className="flex flex-row gap-5 justify-between items-center  rounded-xl  mb-4 "
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
              width: 60,
              aspectRatio: 1,
              objectFit: "cover",
              borderRadius: borderRadius.md,
            }}
          />
        )}
        {isActive && (
          <View
            className="absolute top-0 left-0 aspect-square w-[60] rounded-lg flex flex-row items-center justify-center 
             bg-gray-600/80"
          >
            {status.playing ? (
              <MusicVisualizer size={30} />
            ) : (
              <PlayIcon color={"white"} size={30} />
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
              <ThemedText
                numberOfLines={1}
                type="default"
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {song.artists.primary
                  .map((artist: Artist) => artist.name)
                  .join(", ")}{" "}
                {"•"}
              </ThemedText>

              <ThemedText
                className="text-xs"
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {formatDuration(song.duration ?? 0)}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      <Pressable
        onPressIn={() =>
          router.push({
            pathname: "/menu",
            params: {
              items: JSON.stringify([
                {
                  key: "play_next",
                  label: "Play next",
                  icon: "play_next",
                  data: song,
                },
                {
                  key: "add_to_queue",
                  label: "Add to Queue",
                  icon: "queue",
                  data: song,
                },
                {
                  key: "add_to_playlist",
                  label: "Add to Playlist",
                  icon: "playlist",
                  data: song,
                },
                {
                  key: "go_to_artist",
                  label: "Go to Artist",
                  icon: "artist",
                  data: song.artists.primary[0],
                },
                {
                  key: "go_to_album",
                  label: "Go to Album",
                  icon: "album",
                  data: song.albumId,
                },
                {
                  key: "download",
                  label: "Download",
                  icon: "download",
                  data: song,
                },
                {
                  key: "share",
                  label: "Share",
                  icon: "share",
                  data: song,
                },
              ]),
            },
          })
        }
        className="w-fit p-2 rounded-full"
      >
        <EllipsisVerticalIcon size={20} color={colors.icon} />
      </Pressable>
    </TouchableOpacity>
  );
};

export default AlbumItem;
