import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import { resolveImageSource } from "@/helpers/resolverImageUrl";
import { playSong } from "@/hooks/useTrackPlayerActions";
import { getUserPlaylists } from "@/services/userServices";
import useUserStore from "@/store/useUserStore";
import { Playlist, Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { useActiveTrack } from "react-native-track-player";
import SongMenu from "../menu/SongMenu";
import { MenuItem } from "../MenuModal";
import MusicVisualizer from "../songs/MusicVisualizer";
import { ThemedText } from "../ThemedText";

const AlbumItem = ({
  song,
  showRemoveFavoriteOption = false,
}: {
  song: Song;
  showRemoveFavoriteOption?: boolean;
}) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const currentSong = useActiveTrack();

  const isActive = currentSong?.id == song?.id;
  const [menuVisible, setMenuVisible] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);

  // query

  const { data: playlists } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: getUserPlaylists,
    enabled: !!currentUser,
  });

  const playTrack = async (song: Song) => {
    if (!song) return;
    playSong(song);
  };

  if (!song) return null;

  const menuItems: MenuItem[] = [
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
      data: [song],
    },
    {
      key: "playlists",
      label: "Add to Playlist",
      icon: "playlist",
      data: song,
      submenu:
        playlists &&
        playlists?.map((playlist: Playlist) => ({
          key: "add_to_playlist",
          label: playlist.playlistName,
          imageUrl: playlist.imageUrl,

          icon: "playlist",
          data: { song, playlist },
        })),
    },
    {
      key: "artists",
      label: "Go to artist",
      icon: "artist",

      submenu:
        song &&
        song.artist_map?.primary_artists?.map((artist) => {
          return {
            key: "go_to_artist",
            label: artist.name,
            icon: "artist",
            data: artist.id,
            imageUrl: artist.image,
          };
        }),
    },
    {
      key: "go_to_album",
      label: "Go to Album",
      icon: "album",
      data: song?.album_id,
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
    ...(showRemoveFavoriteOption
      ? [
          {
            key: "remove-from-favorites",
            label: "Remove from Favorites",
            icon: "delete",
            data: song.id,
            destructive: true,
          },
        ]
      : []),
  ];
  return (
    <TouchableOpacity
      onPress={() => playTrack(song)}
      className="flex flex-row gap-5 justify-between items-center  rounded-xl  mb-4  "
    >
      <View>
        <Image
          source={resolveImageSource(
            song.image[song.image.length - 1].link,
            "track"
          )}
          alt=""
          style={{
            width: 60,
            aspectRatio: 1,
            objectFit: "cover",
            borderRadius: borderRadius.md,
          }}
        />

        {isActive && (
          <View
            className="absolute top-0 left-0 aspect-square w-[60] rounded-lg flex flex-row items-center justify-center 
             bg-gray-600/80"
          >
            <MusicVisualizer size={30} />
          </View>
        )}
      </View>
      <View className="flex flex-1 gap-1  ">
        <ThemedText numberOfLines={1} type="defaultSemiBold">
          {song.name}
        </ThemedText>

        <View className="flex flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center justify-between gap-2 pr-10">
            <ThemedText
              numberOfLines={1}
              type="default"
              darkColor={colors.textMuted}
              lightColor={colors.textMuted}
            >
              {song.subtitle} {"•"}
            </ThemedText>

            <ThemedText
              className="text-xs"
              darkColor={colors.textMuted}
              lightColor={colors.textMuted}
            >
              {formatDuration(song.duration ?? 0)}
            </ThemedText>
          </View>
        </View>
      </View>
      <SongMenu
        menuItems={menuItems}
        styles={[{ width: "auto", padding: 8, borderRadius: "100%" }]}
        currentSong={song}
      />
    </TouchableOpacity>
  );
};

export default AlbumItem;
