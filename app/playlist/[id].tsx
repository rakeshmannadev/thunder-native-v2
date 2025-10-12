import { ThemedText } from "@/components/ThemedText";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  EllipsisVertical,
  HeartIcon,
  PlayCircleIcon,
  Shuffle,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AlbumItem from "@/components/album/AlbumItem";
import GradientBackground from "@/components/GradientBackground";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import useUserStore from "@/store/useUserStore";

const PlaylistScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();

  const { bottom, top } = useSafeAreaInsets();
  const {
    playlistLoading: isLoading,
    getPlaylistSongs,
    currentPlaylist,
    addAlbumToPlaylist,
    playlists,
  } = useUserStore();

  useEffect(() => {
    if (id) {
      useUserStore.setState({ currentPlaylist: null });
      getPlaylistSongs(id);
    }
  }, [id, getPlaylistSongs]);

  const handlePlay = async () => {};
  const handleShufflePlay = async () => {};

  const handleAddAlbumToPlaylist = () => {
    if (currentPlaylist) {
      const songs: string[] = [];
      currentPlaylist.songs.map((song: { _id: string }) => {
        songs.push(song._id);
      });
      addAlbumToPlaylist(
        currentPlaylist.playlistId,
        currentPlaylist.playlistName,
        currentPlaylist.artist,
        currentPlaylist.albumId,
        currentPlaylist.imageUrl,
        songs
      );
    }
  };

  const isAddedToPlaylist = playlists.find(
    (playlist) => playlist.playlistId === currentPlaylist?.playlistId
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={["#0F2027", "#203A43", "#2C5364"]}
      >
        {!isLoading && (
          <GradientBackground imageUrl={currentPlaylist?.imageUrl} />
        )}

        {/* --- Playlist Header Section --- */}
        <View style={[styles.headerSection, { marginTop: top + 36 }]}>
          <View style={styles.artworkContainer}>
            {isLoading ? (
              <Skeleton variant="sharp" />
            ) : (
              <Image
                source={{
                  uri: currentPlaylist?.imageUrl,
                }}
                style={styles.artwork}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            {isLoading ? (
              <SkeletonText _lines={1} className="w-20 h-4" />
            ) : (
              <ThemedText style={styles.title}>
                {currentPlaylist?.playlistName ?? "Unknown Album"}
              </ThemedText>
            )}

            {isLoading ? (
              <SkeletonText className="w-16 h-4" />
            ) : (
              <ThemedText style={styles.artist} numberOfLines={2}>
                {currentPlaylist?.artist
                  .map((artist) => artist.name)
                  .join(", ")}
              </ThemedText>
            )}

            <ThemedText style={styles.songCount}>
              {currentPlaylist?.songs.length ?? 0} Songs
            </ThemedText>

            <View style={styles.controls}>
              <Pressable
                onPress={handleAddAlbumToPlaylist}
                style={styles.iconButton}
              >
                <HeartIcon
                  size={20}
                  fill={isAddedToPlaylist ? "green" : "none"}
                  color={isAddedToPlaylist ? "green" : colors.icon}
                />
              </Pressable>

              <Pressable onPress={handlePlay} style={styles.iconButton}>
                <PlayCircleIcon size={22} color={colors.icon} />
              </Pressable>

              <Pressable onPress={handleShufflePlay} style={styles.iconButton}>
                <Shuffle size={22} color={colors.icon} />
              </Pressable>

              <Pressable style={styles.iconButton}>
                <EllipsisVertical size={22} color={colors.icon} />
              </Pressable>
            </View>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: bottom + 40 },
          ]}
        >
          {/* Song lists */}
          {
            <FlatList
              data={currentPlaylist?.songs ?? []}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              renderItem={({ item: song }) => (
                <AlbumItem isLoading={isLoading} song={song} />
              )}
            />
          }
        </ScrollView>
      </LinearGradient>
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
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
    padding: screenPadding.horizontal,
  },
  artworkContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
  },
  artwork: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
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
