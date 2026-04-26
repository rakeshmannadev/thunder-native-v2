import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import { playSong } from "@/hooks/useTrackPlayerActions";
import { PlaylistSongs } from "@/types";
import { EllipsisVerticalIcon, PlayIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useActiveTrack, useIsPlaying } from "react-native-track-player";
import MenuModal, { MenuItem } from "../MenuModal";
import MusicVisualizer from "../songs/MusicVisualizer";
import { ThemedText } from "../ThemedText";
import { Skeleton, SkeletonText } from "../ui/skeleton";

const PlaylistCard = ({
  isLoading,
  song,
}: {
  isLoading: boolean;
  song: PlaylistSongs;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const currentSong = useActiveTrack();
  const isPlaying = useIsPlaying();

  const isActive = currentSong?.id == song.id;

  const [menuVisible, setMenuVisible] = useState(false);
  const filteredSong = {
    _id: song.id,
    title: song.name,
    artists: {
      primary: song.artist_map?.artists,
    },
    imageUrl: song.image?.[2]?.link,
    audioUrl: song.download_url[song.download_url.length - 1].link,
    duration: song.duration,
  };

  const playTrack = async () => {
    playSong(filteredSong);
  };

  const menuItems: MenuItem[] = isLoading
    ? []
    : [
        {
          key: "play_next",
          label: "Play next",
          icon: "play_next",
          data: filteredSong,
        },
        {
          key: "add_to_queue",
          label: "Add to Queue",
          icon: "queue",
          data: [filteredSong],
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
          data: song.artist_map?.artists?.[0].id,
        },
        {
          key: "go_to_album",
          label: "Go to Album",
          icon: "album",
          data: song.album_id,
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
      ];

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={playTrack}
      className="flex flex-row gap-5 justify-between items-center  rounded-xl  mb-4  "
    >
      <View>
        {isLoading ? (
          <Skeleton variant="rounded" className="w-16 h-16" />
        ) : (
          <Image
            source={{
              uri: `${song.image?.[2]?.link}`,
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
        {!isLoading && isActive && (
          <View
            className="absolute top-0 left-0 aspect-square w-[60] rounded-lg flex flex-row items-center justify-center 
             bg-gray-600/80"
          >
            {isPlaying ? (
              <MusicVisualizer size={30} />
            ) : (
              <PlayIcon color={"white"} size={30} />
            )}
          </View>
        )}
      </View>
      <View className="flex flex-1 gap-1  ">
        {isLoading ? (
          <SkeletonText className="w-28 h-4" />
        ) : (
          <ThemedText numberOfLines={1} type="defaultSemiBold">
            {song.name}
          </ThemedText>
        )}
        <View className="flex flex-row items-center gap-2">
          {isLoading ? (
            <SkeletonText className="w-24 h-4" />
          ) : (
            <View className="flex-1 flex-row items-center justify-between gap-2 pr-10">
              <ThemedText
                numberOfLines={1}
                type="default"
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {song.artist_map.artists
                  .map((artist) => artist.name)
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
        onPressIn={() => setMenuVisible(true)}
        className="w-fit p-2 rounded-full"
      >
        <EllipsisVerticalIcon size={20} color={colors.icon} />
      </Pressable>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title="Song Options"
      />
    </TouchableOpacity>
  );
};

export default PlaylistCard;
