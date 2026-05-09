import AlbumItem from "@/components/album/AlbumItem";
import { ThemedText } from "@/components/ThemedText";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { borderRadius, screenPadding } from "@/constants/tokens";
import { QUALITY_MAP } from "@/helpers/audioQualityMap";
import { fetchSongById } from "@/services/songService";
import usePlayerStore from "@/store/usePlayerStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Heart, Play, Radio } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
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
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 450;

const SongScreen = () => {
  const { bottom, top } = useSafeAreaInsets();
  const { id }: { id: string } = useLocalSearchParams();
  const router = useRouter();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const scrollY = useSharedValue(0);

  const { favoriteSongs, addToFavorite } = useUserStore();
  const { audioPreference } = usePlayerStore();

  const { data: songRes, isLoading } = useQuery({
    queryKey: ["song", id],
    queryFn: () => fetchSongById(id),
  });
  const song: Song = songRes?.song;

  const handleAddToFavorite = () => {
    if (!song) return;
    addToFavorite(
      song,
      "Favorites",
      song.artist_map.primary_artists,
      song.image[song.image.length - 1].link
    );
  };

  const handlePlay = async () => {
    if (!song) return;
    TrackPlayer.reset();
    await TrackPlayer.add({
      id: song.id,
      url:
        song.download_url.find(
          (item) => item.quality === QUALITY_MAP[audioPreference.quality]
        )?.link || song.download_url[0].link,
      title: song.name,
      artist: song.artist_map.primary_artists[0].name,
      artwork: song.image[song.image.length - 1].link,
    });
    TrackPlayer.play();
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT - 120], [1, 0]),
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], "clamp"),
        },
      ],
    };
  });

  const isAlreadyfavorite = favoriteSongs.some((s) => s.id === id);
  const songImage = song?.image ? song.image[song.image.length - 1].link : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Immersive Parallax Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {songImage ? (
          <Image source={{ uri: songImage }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImage, { backgroundColor: colors.secondaryBackground }]} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", colors.background]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Navigation Bar */}
      <View style={[styles.navBar, { top: top + 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.navButton}
        >
          <ArrowLeft color="white" size={24} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 120,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <ThemedText style={styles.title}>
              {song?.name ?? (isLoading ? "Loading Song..." : "Song")}
            </ThemedText>
            
            <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
              {isLoading ? "Finding details..." : `${song?.subtitle || ""} • ${song?.album || ""}`}
            </ThemedText>

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <Button
                size="xl"
                onPress={handlePlay}
                style={[styles.playButton, { backgroundColor: colors.primary }]}
              >
                <ButtonIcon as={Play} color="white" size="lg" fill="white" />
                <ButtonText style={styles.playButtonText}>Play Now</ButtonText>
              </Button>

              <Pressable
                onPress={handleAddToFavorite}
                style={[styles.actionButton, { backgroundColor: colors.secondaryBackground }]}
              >
                <Heart 
                  color={isAlreadyfavorite ? "#10b981" : colors.text} 
                  size={24} 
                  fill={isAlreadyfavorite ? "#10b981" : "none"} 
                />
              </Pressable>

              <Pressable
                onPress={() => null}
                style={[styles.actionButton, { backgroundColor: colors.secondaryBackground }]}
              >
                <Radio color={colors.text} size={24} />
              </Pressable>
            </View>
          </Animated.View>

          {/* Details Section */}
          <View style={styles.listContainer}>
            {isLoading ? (
              <View style={styles.skeletonItem}>
                <Skeleton className="w-14 h-14 rounded-lg" />
                <View style={{ flex: 1, gap: 8 }}>
                  <SkeletonText className="w-48 h-4" />
                  <SkeletonText className="w-32 h-3" />
                </View>
              </View>
            ) : (
              song && (
                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                  <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Single Track</ThemedText>
                  <AlbumItem song={song} isLoading={false} />
                </Animated.View>
              )
            )}
          </View>
        </View>
      </Animated.ScrollView>
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
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  playButton: {
    flex: 1,
    height: 60,
    borderRadius: 30,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
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

export default SongScreen;
