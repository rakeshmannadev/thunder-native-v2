import AlbumItem from "@/components/album/AlbumItem";
import MenuModal from "@/components/MenuModal";
import PlayButton from "@/components/PlayButton";
import { ThemedText } from "@/components/ThemedText";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import { getAlbumById } from "@/services/songService";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Album, Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Heart, MoreVertical, Shuffle } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 420;

const AlbumScreen = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const router = useRouter();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { bottom, top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const { addAlbumToPlaylist, playlists } = useUserStore();
  const { setShuffle } = usePlayerStore();

  const { data: albumRes, isLoading: isAlbumFetching } = useQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbumById(id as string),
    enabled: !!id,
  });

  const currentAlbum: Album = albumRes?.data?.album;
  const isAddedToPlaylist = playlists.find((p) => p.id === currentAlbum?.id);

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
    const songs = currentAlbum.songs.map((s: Song) => s.id);
    addAlbumToPlaylist(
      null,
      currentAlbum.name,
      currentAlbum.artist_map.primary_artists,
      currentAlbum.id,
      currentAlbum.image[currentAlbum.image.length - 1]?.link,
      songs
    );
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT - 120], [1, 0]),
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.15, 1], "clamp"),
        },
      ],
    };
  });

  const [menuVisible, setMenuVisible] = useState(false);
  const albumImage = currentAlbum?.image
    ? resolveImage(currentAlbum.image[currentAlbum.image.length - 1]?.link)
    : null;

  if (!currentAlbum && !isAlbumFetching) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Immersive Parallax Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {albumImage ? (
          <Image source={{ uri: albumImage }} style={styles.headerImage} />
        ) : (
          <View
            style={[
              styles.headerImage,
              { backgroundColor: colors.secondaryBackground },
            ]}
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Navigation Bar */}
      <View style={[styles.navBar, { top: top + 8, left: 8 }]}>
        <View style={styles.navButton}>
          {/* <ArrowLeft color="white" size={24} /> */}
        </View>
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={styles.navButton}
        >
          <MoreVertical color="white" size={24} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 100,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <ThemedText style={styles.title}>
              {currentAlbum?.name ??
                (isAlbumFetching ? "Loading Album..." : "Album")}
            </ThemedText>

            <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
              {isAlbumFetching
                ? "Finding tracks..."
                : `${currentAlbum?.songs.length} Songs • ${currentAlbum?.subtitle || ""}`}
            </ThemedText>

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <PlayButton
                handlePlay={handlePlay}
                title="Play All"
                color={colors.primary}
              />

              <Pressable
                onPress={handleShufflePlay}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondaryBackground },
                ]}
              >
                <Shuffle color={colors.text} size={22} />
              </Pressable>

              <Pressable
                onPress={handleAddAlbumToFavorite}
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondaryBackground },
                ]}
              >
                <Heart
                  color={isAddedToPlaylist ? "#10b981" : colors.text}
                  size={22}
                  fill={isAddedToPlaylist ? "#10b981" : "none"}
                />
              </Pressable>
            </View>
          </Animated.View>

          {/* Tracklist */}
          <View style={styles.listContainer}>
            {isAlbumFetching ? (
              Array.from({ length: 8 }).map((_, i) => (
                <View key={i} style={styles.skeletonItem}>
                  <Skeleton className="w-14 h-14 rounded-lg" />
                  <View style={{ flex: 1, gap: 8 }}>
                    <SkeletonText className="w-48 h-4" />
                    <SkeletonText className="w-32 h-3" />
                  </View>
                </View>
              ))
            ) : (
              <FlatList
                data={currentAlbum?.songs || []}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <Animated.View
                    entering={FadeInDown.delay(300 + index * 50).duration(400)}
                  >
                    <AlbumItem isLoading={false} song={item} />
                  </Animated.View>
                )}
              />
            )}
          </View>
        </View>
      </Animated.ScrollView>

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
                  data: currentAlbum.artist_map?.primary_artists?.[0]?.id,
                },
                {
                  key: "save_to_playlist",
                  label: "Save to playlist",
                  icon: "playlist",
                  data: currentAlbum.id,
                },
              ]
            : []
        }
        title="Album Options"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    width: width,
    height: HEADER_HEIGHT,
    zIndex: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  navBar: {
    position: "absolute",
    left: screenPadding.horizontal,
    right: screenPadding.horizontal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  playButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    marginTop: 8,
  },
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
});

export default AlbumScreen;
