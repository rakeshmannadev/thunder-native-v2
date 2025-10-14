import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
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

import GradientBackground from "@/components/GradientBackground";
import { ThemedText } from "@/components/ThemedText";
import AlbumItem from "@/components/album/AlbumItem";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import useMusicStore from "@/store/useMusicStore";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";

const AlbumScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();

  const { addAlbumToPlaylist, playlists } = useUserStore();
  const { isLoading, fetchAlbumById, currentAlbum } = useMusicStore();
  const { playAlbum, setShuffle } = usePlayerStore();

  useEffect(() => {
    if (id) {
      useMusicStore.setState({ currentAlbum: null });
      fetchAlbumById(id);
    }
  }, [id, fetchAlbumById]);

  const isAddedToPlaylist = playlists.find(
    (p) => p.albumId === currentAlbum?.albumId
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={StyleSheet.absoluteFillObject}
      />
      {!isLoading && <GradientBackground imageUrl={currentAlbum?.imageUrl} />}

      {/* --- Album Header Section --- */}
      <View style={[styles.headerSection, { marginTop: top + 36 }]}>
        <View style={styles.artworkContainer}>
          {isLoading ? (
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
          {isLoading ? (
            <SkeletonText _lines={1} className="w-20 h-4" />
          ) : (
            <ThemedText style={styles.title}>
              {currentAlbum?.title ?? "Unknown Album"}
            </ThemedText>
          )}

          {isLoading ? (
            <SkeletonText className="w-16 h-4" />
          ) : (
            <ThemedText style={styles.artist}>
              {currentAlbum?.artists.primary.map((a) => a.name).join(", ") ??
                ""}
            </ThemedText>
          )}

          {isLoading ? (
            <SkeletonText className="w-10 h-4" />
          ) : (
            <ThemedText style={styles.songCount}>
              {currentAlbum?.songs.length ?? 0} Songs
            </ThemedText>
          )}

          {isLoading ? (
            <SkeletonText className="w-32 h-8" />
          ) : (
            <View style={styles.controls}>
              <Pressable
                onPress={handleAddAlbumToFavorite}
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

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/menu",
                    params: {
                      items: JSON.stringify([
                        {
                          key: "add_to_queue",
                          label: "Add to Queue",
                          icon: "queue",
                          data: currentAlbum?.songs ?? [],
                        },

                        {
                          key: "add_to_playlist",
                          label: "Add to Playlist",
                          icon: "playlist",
                          data: currentAlbum,
                          sub_menu: true,
                        },
                        {
                          key: "share",
                          label: "Share",
                          icon: "share",
                        },
                      ]),
                    },
                  })
                }
                style={styles.iconButton}
              >
                <EllipsisVertical size={22} color={colors.icon} />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottom + 40 },
        ]}
      >
        {/* --- Tracklist Section --- */}
        <FlatList
          data={currentAlbum?.songs ?? []}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          renderItem={({ item: song }) => (
            <AlbumItem isLoading={isLoading} song={song} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlbumScreen;

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
