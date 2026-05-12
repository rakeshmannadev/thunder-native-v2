import GradientBackground from "@/components/GradientBackground";
import MenuModal, { MenuItem } from "@/components/MenuModal";
import QueueSheet from "@/components/QueueSheet";
import LikeButton from "@/components/songs/LikeButton";
import { PlayerControls } from "@/components/songs/PlayerControls";
import { PlayerProgressBar } from "@/components/songs/PlayerProgressbar";
import { MovingText } from "@/components/songs/useMovingText";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { showToast } from "@/hooks/useToastMessage";
import { addToFavorites, getFavoriteSongs } from "@/services/userServices";
import { defaultStyles } from "@/styles";
import { Song } from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ChevronDown,
  ListMusic,
  MoreVertical,
  Share2,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.25;
const EXPAND_SPRING = { damping: 26, stiffness: 240, mass: 0.8 };

const PlayerScreen = () => {
  const router = useRouter();
  const queueSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const currentSong = useActiveTrack();
  const { bottom } = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const [queueMounted, setQueueMounted] = useState(false);

  // ── Favorites (reactive subscription instead of inline cache read) ──
  const { data: favorites = [] } = useQuery<Song[]>({
    queryKey: ["favorites"],
    queryFn: getFavoriteSongs,
    staleTime: 1000 * 60 * 5,
  });
  const isFavorite = useMemo(
    () => favorites?.some((fav) => fav.id === currentSong?.id),
    [favorites, currentSong?.id]
  );

  const menuItems: MenuItem[] = useMemo(
    () =>
      currentSong
        ? [
            {
              key: "go_to_album",
              label: "Go to album",
              icon: "album",
              data: currentSong.album_id,
            },
            {
              key: "go_to_artist",
              label: "Go to artist",
              icon: "artist",
              data: currentSong?.artist_map?.primary_artists?.[0]?.id,
            },
            {
              key: "save_to_playlist",
              label: "Save to playlist",
              icon: "playlist",
              data: currentSong.id,
            },
          ]
        : [],
    [currentSong]
  );

  const { mutate: addToFavoriteMutaion } = useMutation({
    mutationFn: (song: Song) =>
      addToFavorites({
        song,
        imageUrl: currentSong?.artwork,
        artists: currentSong?.artist_map.primary_artists,
      }),
    onMutate: async (song: Song) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData<Song[]>(["favorites"]);

      queryClient.setQueryData<Song[]>(["favorites"], (old) => {
        if (!old) return [song];
        const isAlreadyFav = old.some((s) => s.id === song.id);
        if (isAlreadyFav) {
          return old.filter((s) => s.id !== song.id);
        } else {
          return [...old, song];
        }
      });

      return { previousFavorites };
    },
    onSuccess: () => {
      showToast("Favorites updated");
    },
    onError: (error: any, song, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
      showToast(error?.message || "Failed to update favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleAddToFavorite = useCallback(async () => {
    if (!currentSong) return;
    addToFavoriteMutaion({
      id: currentSong.id,
      name: currentSong.title!,
      subtitle: currentSong.artist!,
      image: [{ link: currentSong.artwork!, quality: "960x960" }],
      download_url: [{ link: currentSong.url!, quality: "320kbps" }],
      album: currentSong.album!,
      album_id: currentSong.album_id!,
      duration: currentSong.duration!,
      artist_map: currentSong.artist_map.primary_artists!,
      release_date: currentSong.release_date,
    });
  }, [currentSong, addToFavoriteMutaion]);

  const handleShare = useCallback(async () => {
    if (!currentSong) return;
    try {
      await Share.share({
        title: currentSong.title,
        message: `Check out ${currentSong.title} by ${currentSong.artist} on Thunder!`,
        url: currentSong.artwork ?? "",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [currentSong]);

  // ── Animations ───────────────────────────────────────
  const artworkScale = useSharedValue(0.9);
  const artworkOpacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    artworkScale.value = 0.9;
    artworkOpacity.value = 0;
    artworkScale.value = withDelay(100, withSpring(1, { damping: 15 }));
    artworkOpacity.value = withTiming(1, { duration: 600 });
  }, [currentSong?.id]);

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetY(-5)
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      if (e.velocityY > 1000 || translateY.value > DISMISS_THRESHOLD) {
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 250, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (finished) {
              runOnJS(router.back)();
            }
          }
        );
      } else {
        translateY.value = withSpring(0, EXPAND_SPRING);
      }
    });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderTopLeftRadius: interpolate(
      translateY.value,
      [0, 100],
      [0, 40],
      Extrapolation.CLAMP
    ),
    borderTopRightRadius: interpolate(
      translateY.value,
      [0, 100],
      [0, 40],
      Extrapolation.CLAMP
    ),
  }));

  const animatedArtworkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: artworkScale.value }],
    opacity: artworkOpacity.value,
  }));

  if (!currentSong) {
    return (
      <View
        style={[
          defaultStyles.container,
          { justifyContent: "center", backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedContainerStyle]}>
          <LinearGradient
            colors={
              colorSchema === "dark"
                ? ["#1a1a1a", "#000000"]
                : ["#ffffff", "#f0f0f0"]
            }
            style={StyleSheet.absoluteFill}
          />
          <GradientBackground imageUrl={currentSong?.artwork} />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.overlay}>
              {/* Header */}
              <View style={[styles.header]}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.iconBtn}
                >
                  <ChevronDown color={colors.text} size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={styles.iconBtn}
                >
                  <MoreVertical color={colors.text} size={24} />
                </TouchableOpacity>
              </View>

              {/* Artwork Area */}
              <View style={styles.artworkArea}>
                <Animated.View
                  style={[styles.artworkShadow, animatedArtworkStyle]}
                >
                  <Animated.Image
                    source={{ uri: currentSong.artwork }}
                    style={styles.artworkImage}
                  />
                </Animated.View>
              </View>

              {/* Controls Area */}
              <View
                style={[styles.controlsArea, { paddingBottom: bottom + 20 }]}
              >
                <View style={styles.songInfoContainer}>
                  <View style={styles.titleContainer}>
                    <MovingText
                      text={currentSong.title ?? ""}
                      style={[styles.songTitle, { color: colors.text }]}
                      animationThreshold={24}
                      maskColor={colorSchema === "dark" ? "#000000" : "#f0f0f0"}
                    />
                    <MovingText
                      text={currentSong.artist ?? ""}
                      style={[styles.songArtist, { color: colors.textMuted }]}
                      animationThreshold={30}
                      maskColor={colorSchema === "dark" ? "#000000" : "#f0f0f0"}
                    />
                  </View>

                  <View style={styles.actionRow}>
                    <LikeButton />
                    <TouchableOpacity
                      onPress={handleShare}
                      style={styles.circularActionBtn}
                    >
                      <Share2 size={22} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.playbackControls}>
                  <PlayerProgressBar />
                  <PlayerControls />
                </View>

                {/* Footer Actions */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!queueMounted) setQueueMounted(true);
                      // Small delay to ensure mount completes before present
                      setTimeout(() => queueSheetRef.current?.present(), 50);
                    }}
                    style={[
                      styles.queueBtn,
                      { backgroundColor: colors.secondaryBackground },
                    ]}
                  >
                    <ListMusic color={colors.text} size={24} />
                    <ThemedText
                      style={[styles.queueText, { color: colors.text }]}
                    >
                      Up Next
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>

      {queueMounted && <QueueSheet ref={queueSheetRef} />}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        title="Playback Options"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: screenPadding.horizontal,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  artworkArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  artworkShadow: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  controlsArea: {
    marginTop: "auto",
  },
  songInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  songTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  songArtist: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circularActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  playbackControls: {
    gap: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  queueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 10,
  },
  queueText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default PlayerScreen;
