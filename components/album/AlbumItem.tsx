import { Colors } from "@/constants/Colors";
import { borderRadius } from "@/constants/tokens";
import { formatDuration } from "@/helpers";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { playSong } from "@/hooks/useTrackPlayerActions";
import { getPlaylists } from "@/services/userServices";
import useUserStore from "@/store/useUserStore";
import { Playlist, Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVerticalIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useActiveTrack } from "react-native-track-player";
import MenuModal, { MenuItem } from "../MenuModal";
import MusicVisualizer from "../songs/MusicVisualizer";
import { ThemedText } from "../ThemedText";

const AlbumItem = ({ song }: { song: Song }) => {
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const currentSong = useActiveTrack();

  const isActive = currentSong?.id == song?.id;
  const [menuVisible, setMenuVisible] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);

  // query

  const { data: playlists } = useQuery({
    queryKey: ["user-playlist"],
    queryFn: () => getPlaylists(),
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
            imageUrl: resolveImage(artist.image),
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
  ];

  return (
    <TouchableOpacity
      onPress={() => playTrack(song)}
      className="flex flex-row gap-5 justify-between items-center  rounded-xl  mb-4  "
    >
      <View>
        <Image
          source={{
            uri: song.image[song.image.length - 1].link,
          }}
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
      <Pressable
        onPressIn={() => setMenuVisible(true)}
        className="w-fit p-2 rounded-full"
      >
        <EllipsisVerticalIcon size={20} color={colors.icon} />
      </Pressable>

      {song && (
        <MenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          items={menuItems}
          imageUrl={song?.image?.[song.image.length - 1]?.link || ""}
          title={song?.name || ""}
          description={song?.subtitle || ""}
        />
      )}
    </TouchableOpacity>
  );
};

export default AlbumItem;
