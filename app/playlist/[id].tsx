import { ThemedText } from "@/components/ThemedText";
import {
  borderRadius,
  colors,
  fontSize,
  screenPadding,
} from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import { useLocalSearchParams } from "expo-router";
import { Shuffle } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import PlaylistCard from "@/components/playlist/PlaylistCard";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import useMusicStore from "@/store/useMusicStore";
import useUserStore from "@/store/useUserStore";
import { PlaylistSongs } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TrackPlayer from "react-native-track-player";

const PlaylistScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();

  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { bottom, top } = useSafeAreaInsets();
  const { addAlbumToPlaylist, playlists } = useUserStore();
  const { playlistLoading, currentPlaylist, getPlaylistSongs } =
    useMusicStore();

  useEffect(() => {
    if (id) {
      getPlaylistSongs(id);
    }
  }, [id, getPlaylistSongs]);

  const playPlaylist = async () => {
    if (!currentPlaylist) return;
    await TrackPlayer.reset();
    await TrackPlayer.setQueue(
      currentPlaylist.songs.map((song: PlaylistSongs) => ({
        id: song.id,
        title: song.name,
        artist: song.artist_map.artists.map((artist) => artist.name).join(", "),
        artwork: song.image[2].link,
        url: song.download_url[3].link,
      }))
    );

    await TrackPlayer.play();
  };
  const handleShufflePlay = async () => {};

  // const handleAddAlbumToPlaylist = () => {
  //   if (currentPlaylist) {
  //     const songs: string[] = [];
  //     currentPlaylist.songs.map((song: { _id: string }) => {
  //       songs.push(song._id);
  //     });
  //     addAlbumToPlaylist(
  //       currentPlaylist.id!,
  //       currentPlaylist.name!,
  //       currentPlaylist.artist!,
  //       currentPlaylist.albumId!,
  //       currentPlaylist.imageUrl!,
  //       songs
  //     );
  //   }
  // };

  // const isAddedToPlaylist = playlists.find(
  //   (playlist) => playlist.playlistId === currentPlaylist?.playlistId
  // );
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + 40 },
        ]}
      >
        {/* --- Playlist Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top }]}>
          <View style={styles.artworkContainer}>
            {playlistLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: currentPlaylist?.image,
                }}
                style={styles.artwork}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            {playlistLoading ? (
              <SkeletonText _lines={1} className="w-20 h-4" />
            ) : (
              <ThemedText
                style={[styles.title, { color: colors.text }]}
                className="text-2xl"
              >
                {currentPlaylist?.name ?? "Unknown Album"}
              </ThemedText>
            )}

            {playlistLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {currentPlaylist?.artists?.map((a) => a.name).join(", ") ?? ""}
              </ThemedText>
            )}

            {playlistLoading ? (
              <SkeletonText className="w-10 h-4" />
            ) : (
              <ThemedText
                darkColor={colors.textMuted}
                lightColor={colors.textMuted}
              >
                {currentPlaylist?.songs.length ?? 0} Songs
              </ThemedText>
            )}

            {playlistLoading ? (
              <SkeletonText className="w-32 h-8" />
            ) : (
              <View style={styles.controls}>
                <Pressable
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  {/* <HeartIcon
                    size={20}
                    fill={isAddedToPlaylist ? "green" : "none"}
                    color={isAddedToPlaylist ? "green" : colors.icon}
                  /> */}
                </Pressable>

                <TouchableOpacity
                  onPress={playPlaylist}
                  style={{
                    paddingHorizontal: 12,
                    borderRadius: borderRadius.lg,
                    backgroundColor: colors.primary,
                    flex: 1,
                    height: 48,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <ThemedText style={{ color: "white" }}>Play</ThemedText>
                  <MaterialCommunityIcons
                    name="play"
                    size={22}
                    color={"white"}
                  />
                </TouchableOpacity>

                <Pressable
                  onPress={handleShufflePlay}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.component },
                  ]}
                >
                  <Shuffle size={22} color={colors.icon} />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Song lists */}
        {
          <FlatList
            data={currentPlaylist?.songs ?? []}
            keyExtractor={(item, index) => index + "-" + item.id}
            scrollEnabled={false}
            renderItem={({ item }: { item: PlaylistSongs }) => (
              <PlaylistCard isLoading={playlistLoading} song={item} />
            )}
          />
        }
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
    paddingHorizontal: screenPadding.horizontal,
  },
  artworkContainer: {
    width: 280,
    height: 280,

    overflow: "hidden",
    elevation: 6,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: borderRadius.lg,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    ...defaultStyles.text,
    fontSize: 14,
    opacity: 0.7,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
export default PlaylistScreen;
