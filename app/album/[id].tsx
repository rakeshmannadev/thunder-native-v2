import { useLocalSearchParams } from "expo-router";
import {
  HeartIcon,
  MoreVerticalIcon,
  PlayIcon,
  Shuffle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AlbumItem from "@/components/album/AlbumItem";
import GradientBackground from "@/components/GradientBackground";
import MenuModal from "@/components/MenuModal";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Artist, Song } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";

const AlbumScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const { bottom, top } = useSafeAreaInsets();

  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];

  const { addAlbumToPlaylist, playlists } = useUserStore();
  const { isAlbumFetching, fetchAlbumById, currentAlbum } = useMusicStore();
  const { setShuffle } = usePlayerStore();

  const activeTrack = useActiveTrack();

  useEffect(() => {
    if (id) {
      useMusicStore.setState({ currentAlbum: null });
      fetchAlbumById(id);
    }
  }, [id, fetchAlbumById]);

  const isAddedToPlaylist = playlists.find(
    (p) => p.albumId === currentAlbum?.albumId
  );

  const playAlbum = async (songs: Song[], index: number) => {
    await TrackPlayer.reset();
    await TrackPlayer.setQueue(
      songs.map((song) => ({
        id: song._id,
        title: song.title,
        artist: song.artists.primary
          .map((artist: Artist) => artist.name)
          .join(", "),
        artwork: song.imageUrl,
        url: song.audioUrl,
      }))
    );

    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  };

  const handlePlay = () => {
    if (!currentAlbum) return;
    setShuffle(false);
    playAlbum(currentAlbum.songs, 0);
  };
  const handleShufflePlay = () => {
    if (!currentAlbum) return;
    setShuffle(true);
    playAlbum(
      currentAlbum.songs,
      Math.floor(Math.random() * currentAlbum.songs.length)
    );
  };
  const handleAddAlbumToFavorite = () => {
    if (!currentAlbum) return;
    const songs = currentAlbum.songs.map((s) => s._id);
    addAlbumToPlaylist(
      null,
      currentAlbum.title,
      currentAlbum.artists.primary,
      currentAlbum.albumId,
      currentAlbum.imageUrl,
      songs
    );
  };

  const [menuVisible, setMenuVisible] = useState(false);

  if (!currentAlbum && !isAlbumFetching) return null;
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        style={[StyleSheet.absoluteFill, { flex: 1, overflow: "visible" }]}
        colors={["#0F2027", "#203A43", "#2C5364"]}
      >
        <GradientBackground imageUrl={activeTrack?.artwork} />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.topBarIconContainer}>
            <View
              style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable onPressIn={() => setMenuVisible(true)}>
                <MoreVerticalIcon size={22} color={colors.icon} />
              </Pressable>
            </View>
          </View>

          {/* --- Album Header Section --- */}
          <View style={[styles.headerSection, { marginTop: top }]}>
            <View style={styles.artworkContainer}>
              {isAlbumFetching ? (
                <Skeleton variant="sharp" />
              ) : (
                <Image
                  source={{
                    uri: currentAlbum?.imageUrl,
                  }}
                  style={styles.artwork}
                  resizeMode="cover"
                />
              )}
            </View>

            <View style={styles.infoContainer}>
              {isAlbumFetching ? (
                <SkeletonText _lines={1} className="w-20 h-4" />
              ) : (
                <ThemedText style={[styles.title, { color: colors.text }]}>
                  {currentAlbum?.title ?? "Unknown Album"}
                </ThemedText>
              )}

              {isAlbumFetching ? (
                <SkeletonText className="w-16 h-4" />
              ) : (
                <ThemedText
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  {currentAlbum?.artists.primary
                    .map((a) => a.name)
                    .join(", ") ?? ""}
                </ThemedText>
              )}

              {isAlbumFetching ? (
                <SkeletonText className="w-10 h-4" />
              ) : (
                <ThemedText
                  darkColor={colors.textMuted}
                  lightColor={colors.textMuted}
                >
                  {currentAlbum?.songs.length ?? 0} Songs
                </ThemedText>
              )}

              {isAlbumFetching ? (
                <SkeletonText className="w-32 h-8" />
              ) : (
                <View style={styles.controls}>
                  <Pressable
                    onPress={handleAddAlbumToFavorite}
                    style={[
                      styles.iconButton,
                      { backgroundColor: colors.component },
                    ]}
                  >
                    <HeartIcon
                      size={20}
                      fill={isAddedToPlaylist ? "green" : "none"}
                      color={isAddedToPlaylist ? "green" : colors.icon}
                    />
                  </Pressable>

                  <Button
                    variant="solid"
                    size="xl"
                    onPress={handlePlay}
                    style={{
                      paddingHorizontal: 12,
                      borderRadius: borderRadius.lg,
                      backgroundColor: colors.primary,
                      flex: 1,
                    }}
                  >
                    <ButtonText style={{ color: "white" }}>Play</ButtonText>
                    <ButtonIcon as={PlayIcon} color={"white"} size="lg" />
                  </Button>

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

          <View
            style={{
              paddingHorizontal: screenPadding.horizontal,
              paddingBlock: 20,
              paddingBottom: bottom + 50,
            }}
          >
            {/* --- Tracklist Section --- */}
            <FlatList
              data={
                isAlbumFetching
                  ? Array(5).fill({} as Song)
                  : (currentAlbum?.songs ?? [])
              }
              keyExtractor={(item, index) => item?._id ?? index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: song }) => (
                <AlbumItem isLoading={isAlbumFetching} song={song} />
              )}
            />
          </View>
        </ScrollView>
      </LinearGradient>
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={
          currentAlbum
            ? [
                { key: "share", label: "Share", icon: "share" },
                {
                  key: "go_to_artist",
                  label: "Go to artist",
                  icon: "artist",
                  data: currentAlbum.artists?.primary?.[0]?.id,
                },
                {
                  key: "save_to_playlist",
                  label: "Save to playlist",
                  icon: "playlist",
                  data: currentAlbum.albumId,
                },
              ]
            : []
        }
        title="Album Options"
      />
    </SafeAreaView>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    marginTop: 30,
  },
  topBarIconContainer: {
    flexDirection: "row",
    height: 10,
    width: " 100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingInline: 8,
    marginTop: 18,
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
    gap: 2,
    textAlign: "center",
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  artist: {
    fontSize: fontSize.xs,
    opacity: 0.8,
    marginVertical: 6,
  },
  songCount: {
    fontSize: fontSize.xs,
    opacity: 0.7,
  },
  controls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 25,
  },
  iconButton: {
    padding: 6,
    borderRadius: 50,
  },
});
