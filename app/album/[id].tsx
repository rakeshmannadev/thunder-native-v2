import AlbumItem from "@/components/album/AlbumItem";
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
import { ArrowLeft, Heart, Shuffle } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
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

  const albumImage = currentAlbum?.image
    ? resolveImage(currentAlbum.image[currentAlbum.image.length - 1]?.link)
    : null;

  if (!currentAlbum && !isAlbumFetching) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {isAlbumFetching ? (
          <Skeleton className="w-full h-full bg-background-200" />
        ) : albumImage ? (
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
          colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.45)", colors.background]}
          locations={[0, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

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
            {isAlbumFetching ? (
              <View style={{ gap: 12, marginBottom: 28 }}>
                <SkeletonText className="w-64 h-10 rounded-xl bg-background-200" />
                <SkeletonText className="w-48 h-5 rounded-md bg-background-200" />
              </View>
            ) : (
              <>
                <ThemedText style={styles.title}>
                  {currentAlbum?.name ?? "Album"}
                </ThemedText>

                <ThemedText
                  style={[styles.subtitle, { color: colors.textMuted }]}
                >
                  {`${currentAlbum?.songs?.length || 0} Songs • ${currentAlbum?.subtitle || "Album"}`}
                </ThemedText>
              </>
            )}

            {/* Action Bar */}
            <View style={styles.actionRow}>
              {isAlbumFetching ? (
                <>
                  <Skeleton
                    variant="rounded"
                    className="flex-1 h-[56px] rounded-full bg-background-200"
                  />
                  <Skeleton
                    variant="circular"
                    className="w-[56px] h-[56px] rounded-full bg-background-200"
                  />
                  <Skeleton
                    variant="circular"
                    className="w-[56px] h-[56px] rounded-full bg-background-200"
                  />
                </>
              ) : (
                <>
                  <PlayButton
                    handlePlay={handlePlay}
                    title="Play All"
                    color={colors.primary}
                    disabled={isAlbumFetching || !currentAlbum}
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
                </>
              )}
            </View>
          </Animated.View>

          {/* Tracklist */}
          <View style={styles.listContainer}>
            {isAlbumFetching ? (
              Array.from({ length: 8 }).map((_, i) => (
                <AlbumItem key={i} isLoading={true} song={undefined as any} />
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

      <View style={[styles.navBar, { top: top + 8, left: 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navButton}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
      </View>
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
    zIndex: 10,
  },
  content: {
    paddingHorizontal: screenPadding.horizontal,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "white",
    letterSpacing: -1.0,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 14,
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
});

export default AlbumScreen;
