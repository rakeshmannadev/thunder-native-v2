import GradientBackground from "@/components/GradientBackground";
import MenuModal, { MenuItem } from "@/components/MenuModal";
import QueueSheet from "@/components/QueueSheet";
import LikeButton from "@/components/songs/LikeButton";
import { PlayerControls } from "@/components/songs/PlayerControls";
import { PlayerProgressBar } from "@/components/songs/PlayerProgressbar";
import ShareButton from "@/components/songs/ShareButton";
import { MovingText } from "@/components/songs/useMovingText";
import { Colors } from "@/constants/Colors";
import { screenPadding } from "@/constants/tokens";
import { getUserPlaylists } from "@/services/userServices";
import useUserStore from "@/store/useUserStore";
import { defaultStyles } from "@/styles";
import { Artist, Playlist } from "@/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import { ChevronDown, MoreVertical } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
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
  useAnimatedReaction,
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
import { scheduleOnRN } from "react-native-worklets";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_ANDROID = Platform.OS === "android";
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.25;
const EXPAND_SPRING = { damping: 26, stiffness: 240, mass: 0.8 };

const PlayerScreen = React.memo(() => {
  const router = useRouter();
  const navigation = useNavigation();
  const queueSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const currentSong = useActiveTrack();
  const { bottom } = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const queueSheetIndex = useSharedValue(0);
  const currentUser = useUserStore((state) => state.currentUser);

  const handleBack = useCallback(() => router.back(), [router]);
  const handleCloseMenu = useCallback(() => setMenuVisible(false), []);
  const handleOpenMenu = useCallback(() => setMenuVisible(true), []);

  const gradientColors = useMemo(
    () =>
      colorScheme === "dark"
        ? (["#1a1a1a", "#000000"] as const)
        : (["#ffffff", "#f0f0f0"] as const),
    [colorScheme]
  );

  // query
  const { data: userPlaylists } = useQuery({
    queryKey: ["user-playlists"],
    queryFn: () => getUserPlaylists(),
    enabled: !!currentUser,
  });

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
              key: "artists",
              label: "Go to artist",
              icon: "artist",

              submenu: currentSong.artist_map?.primary_artists?.map(
                (artist: Artist) => {
                  return {
                    key: "go_to_artist",
                    label: artist.name,
                    icon: "artist",
                    data: artist.id,
                    imageUrl: artist.image,
                  };
                }
              ),
            },
            {
              key: "playlists",
              label: "Add to Playlist",
              icon: "playlist",
              data: currentSong,
              submenu:
                userPlaylists &&
                userPlaylists?.map((playlist: Playlist) => ({
                  key: "add_to_playlist",
                  label: playlist.playlistName,
                  imageUrl: playlist.imageUrl,

                  icon: "playlist",
                  data: { song: currentSong, playlist },
                })),
            },
            {
              key: "download",
              label: "Download",
              icon: "download",
              data: currentSong,
            },
          ]
        : [],
    [currentSong, userPlaylists]
  );

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

  // ── Android-only swipe-to-dismiss gesture ────────────
  // On iOS, the native stack handles this via gestureEnabled + gestureDirection:'vertical'.
  // On Android, we use a custom pan gesture and disable the navigation animation before
  // calling router.back() to prevent the double-animation conflict.
  const isPanEnabled = useSharedValue(true);
  useAnimatedReaction(
    () => queueSheetIndex.value <= 0.01,
    (enabled) => {
      isPanEnabled.value = enabled;
    }
  );

  const dismissPlayer = useCallback(() => {
    // Disable the navigation pop animation since our gesture already
    // animated the content off-screen — prevents the "stuck" double animation
    navigation.setOptions({ animation: "none" });
    router.back();
  }, [navigation, router]);

  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetY(-5)
    .enabled(IS_ANDROID)
    .onStart(() => {
      if (!isPanEnabled.value) return;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      if (!isPanEnabled.value) return;
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      if (!isPanEnabled.value) {
        translateY.value = withSpring(0, EXPAND_SPRING);
        return;
      }
      if (e.velocityY > 1000 || translateY.value > DISMISS_THRESHOLD) {
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 220, easing: Easing.out(Easing.quad) },
          (finished) => {
            if (finished) {
              scheduleOnRN(dismissPlayer);
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

  const animatedArtworkStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      queueSheetIndex.value,
      [0, 1],
      [artworkScale.value, 0.6],
      Extrapolation.CLAMP
    );
    const translationY = interpolate(
      queueSheetIndex.value,
      [0, 1],
      [0, -SCREEN_HEIGHT * 0.12],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY: translationY }],
      opacity: artworkOpacity.value,
    };
  });

  const animatedControlsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      queueSheetIndex.value,
      [0, 0.4],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translationY = interpolate(
      queueSheetIndex.value,
      [0, 1],
      [0, 50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY: translationY }],
    };
  });

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
            colors={gradientColors}
            style={StyleSheet.absoluteFill}
          />
          <GradientBackground imageUrl={currentSong?.artwork} />

          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.overlay}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleBack}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: colors.iconBackground },
                  ]}
                >
                  <ChevronDown
                    color={colors.text}
                    size={28}
                    style={{ marginTop: 2 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOpenMenu}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: colors.iconBackground },
                  ]}
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
            </View>

            {/* Controls Area */}
            <Animated.View
              style={[
                styles.controlsArea,
                animatedControlsStyle,
                { paddingBottom: bottom + 80 },
              ]}
            >
              <View style={styles.songInfoContainer}>
                <View style={styles.titleContainer}>
                  <MovingText
                    text={currentSong.title ?? ""}
                    style={[styles.songTitle, { color: colors.text }]}
                    animationThreshold={24}
                    maskColor={colorScheme === "dark" ? "#121212" : "#f0f0f0"}
                  />
                  <MovingText
                    text={currentSong.artist ?? ""}
                    style={[styles.songArtist, { color: colors.textMuted }]}
                    animationThreshold={30}
                    maskColor={colorScheme === "dark" ? "#121212" : "#f0f0f0"}
                  />
                </View>

                <View style={styles.actionRow}>
                  <LikeButton
                    currentSong={{
                      name: currentSong.title!,
                      album: currentSong.album!,
                      album_id: currentSong.album_id!,
                      artist_map: currentSong.artist_map!,
                      download_url: [
                        { link: currentSong.url, quality: "320kbps" },
                      ]!,
                      duration: currentSong.duration!,
                      id: currentSong.id!,
                      image: [
                        { link: currentSong.artwork!, quality: "900x900" },
                      ],
                      release_date: currentSong.release_date!,
                      subtitle: currentSong.artist!,
                    }}
                  />
                  <ShareButton
                    currentSong={{
                      name: currentSong.title!,
                      album: currentSong.album!,
                      album_id: currentSong.album_id!,
                      artist_map: currentSong.artist_map!,
                      download_url: [
                        { link: currentSong.url, quality: "320kbps" },
                      ]!,
                      duration: currentSong.duration!,
                      id: currentSong.id!,
                      image: [
                        { link: currentSong.artwork!, quality: "900x900" },
                      ],
                      release_date: currentSong.release_date!,
                      subtitle: currentSong.artist!,
                    }}
                  />
                </View>
              </View>

              <View style={styles.playbackControls}>
                <PlayerProgressBar />
                <PlayerControls />
              </View>
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>

      <QueueSheet ref={queueSheetRef} animatedIndex={queueSheetIndex} />
      <MenuModal
        visible={menuVisible}
        onClose={handleCloseMenu}
        items={menuItems}
        imageUrl={currentSong?.artwork}
        title={currentSong?.title}
        description={currentSong?.artist}
        artists={currentSong?.artist_map?.primary_artists!}
        songs={[
          {
            id: currentSong?.id,
            name: currentSong?.title!,
            subtitle: currentSong?.artist!,
            image: [
              {
                link: currentSong?.artwork!,
                quality: "900x900",
              },
            ],
            album_id: currentSong?.album_id!,
            album: currentSong?.album!,
            artist_map: currentSong?.artist_map!,
            duration: currentSong?.duration!,
            release_date: currentSong?.release_date!,
            download_url: [{ link: currentSong?.url!, quality: "320kbps" }],
          },
        ]}
      />
    </View>
  );
});

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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  controlsArea: {
    marginTop: "auto",
    paddingHorizontal: screenPadding.horizontal,
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
    gap: 28,
    justifyContent: "space-evenly",
    alignItems: "stretch",
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
