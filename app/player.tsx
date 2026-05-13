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
import { defaultStyles } from "@/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronDown, MoreVertical } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.25;
const EXPAND_SPRING = { damping: 26, stiffness: 240, mass: 0.8 };

const PlayerScreen = React.memo(() => {
  const router = useRouter();
  const queueSheetRef = useRef<BottomSheet>(null);
  const colorSchema = useColorScheme();
  const colors = Colors[colorSchema === "light" ? "light" : "dark"];
  const currentSong = useActiveTrack();
  const { bottom } = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const queueSheetIndex = useSharedValue(0);

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
    .enabled(queueSheetIndex.value <= 0.01) // Only allow dismissal when queue is collapsed
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
              scheduleOnRN(router.back);
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
            colors={
              colorSchema === "dark"
                ? ["#1a1a1a", "#000000"]
                : ["#ffffff", "#f0f0f0"]
            }
            style={StyleSheet.absoluteFill}
          />
          <GradientBackground imageUrl={currentSong?.artwork} />

          <SafeAreaView style={{ flex: 1 }}>
            <GestureDetector gesture={panGesture}>
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
              </View>
            </GestureDetector>

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
                  <ShareButton />
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
        onClose={() => setMenuVisible(false)}
        items={menuItems}
        imageUrl={currentSong?.artwork}
        title={currentSong?.title}
        description={currentSong?.artist}
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
