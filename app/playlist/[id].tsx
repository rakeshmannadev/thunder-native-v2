import PlayButton from "@/components/PlayButton";
import { ThemedText } from "@/components/ThemedText";
import PlaylistCard from "@/components/playlist/PlaylistCard";
import AddToPlaylistButton from "@/components/songs/AddToPlaylistButton";
import ShuffleButton from "@/components/songs/ShuffleButton";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { resolveImage } from "@/helpers/resolverImageUrl";
import { playAlbum } from "@/hooks/useTrackPlayerActions";
import { getPlaylistById } from "@/services/songService";
import useUserStore from "@/store/useUserStore";
import { Playlist } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
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
const HEADER_HEIGHT = 400;

const PlaylistScreen = () => {
  const { id, link } = useLocalSearchParams();

  const router = useRouter();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const { bottom, top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const { playlists } = useUserStore();

  const { data: playlistRes, isLoading: playlistLoading } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async () =>
      await getPlaylistById({ id: id as string, link: link as string }),
    enabled: !!id,
  });

  const currentPlaylist: Playlist = playlistRes;
  const songs = currentPlaylist?.songs || [];

  const handlePlay = () => {
    if (songs.length === 0) return;
    playAlbum(songs, 0);
  };

  const handleShufflePlay = () => {
    if (songs.length === 0) return;
    playAlbum(songs, Math.floor(Math.random() * songs.length));
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT - 120], [1, 0]),
      transform: [
        {
          scale: interpolate(scrollY.value, [-100, 0], [1.1, 1], "clamp"),
        },
      ],
    };
  });

  const playlistImage = currentPlaylist?.image
    ? resolveImage(currentPlaylist.image)
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Parallax Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        {playlistImage ? (
          <Image source={{ uri: playlistImage }} style={styles.headerImage} />
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
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Header Bar (Back Button) */}
      <View style={[styles.headerBar, { top: top + 8, left: 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: colors.iconBackground },
          ]}
        >
          <ArrowLeft color={colors.icon} size={24} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - 80,
          paddingBottom: bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <ThemedText style={styles.title}>
              {currentPlaylist?.name ??
                (playlistLoading ? "Loading..." : "Playlist")}
            </ThemedText>

            <ThemedText style={[styles.subtitle, { color: colors.textMuted }]}>
              {playlistLoading
                ? "Finding tracks..."
                : `${songs.length} Songs • ${currentPlaylist?.subtitle || "Thunder Playlist"}`}
            </ThemedText>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              {playlistLoading ? (
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
                    title="Play"
                    color={colors.primary}
                  />

                  <ShuffleButton songs={currentPlaylist.songs} />
                  <AddToPlaylistButton currentPlaylist={currentPlaylist} />
                </>
              )}
            </View>
          </Animated.View>

          {/* Song List */}
          <View style={styles.listContainer}>
            {playlistLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
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
                data={songs}
                keyExtractor={(item, index) => `${id}-${item.id}-${index}`}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <Animated.View
                    entering={FadeInDown.delay(300 + index * 50).duration(400)}
                  >
                    <PlaylistCard isLoading={false} song={item} />
                  </Animated.View>
                )}
              />
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
  headerBar: {
    position: "absolute",
    left: screenPadding.horizontal,
    right: screenPadding.horizontal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 45,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  shuffleButton: {
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

export default PlaylistScreen;
