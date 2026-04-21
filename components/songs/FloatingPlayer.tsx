import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";

import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, {
  useActiveTrack,
  useProgress,
} from "react-native-track-player";
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls";
import { MovingText } from "./useMovingText";

const DISMISS_THRESHOLD = 60;

const FloatingPlayer = ({ style }: { style?: ViewStyle }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();
  const { stopPlayer } = usePlayerStore();
  const currentSong = useActiveTrack();

  const unknownTrackImageUri = require("../../assets/images/unknown_track.png");

  const { duration, position } = useProgress(250);
  const progressRatio = duration > 0 ? position / duration : 0;

  // ── Swipe-down-to-dismiss ────────────────────────────────────────
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const handleStop = async () => {
    await TrackPlayer.reset();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetY(-5)
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY);
    })
    .onEnd((e) => {
      if (e.velocityY > 800 || translateY.value > DISMISS_THRESHOLD) {
        translateY.value = withTiming(
          200,
          { duration: 180, easing: Easing.in(Easing.ease) },
          () => {
            runOnJS(handleStop)();
          }
        );
      } else {
        translateY.value = withSpring(0, { damping: 26, stiffness: 300 });
      }
    });

  // Only pan on the outer container — controls handle their own taps
  const composedGesture = panGesture;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: translateY.value > 0 ? Math.max(0, 1 - translateY.value / 150) : 1,
  }));

  if (!currentSong) return null;

  const handlePlayNext = async () => {
    await TrackPlayer.skipToNext();
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          {
            backgroundColor: colors.component,
            borderRadius: borderRadius.md,
            overflow: "hidden",
          },
          style,
          animatedStyle,
        ]}
      >
        <View style={[styles.parentContainer, { width: "100%" }]}>
          <View style={styles.trakDetailsContainer}>
            {/* Tapping artwork or title opens the player */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/player")}
              style={styles.trackInfoTouchable}
            >
              <Image
                source={{ uri: currentSong?.artwork ?? unknownTrackImageUri }}
                style={styles.songImage}
              />
              <View style={styles.textContainer}>
                <Text
                  numberOfLines={1}
                  style={[styles.trackTitle, { color: colors.text }]}
                >
                  {currentSong.title ?? ""}
                </Text>
                <MovingText
                  style={[styles.trackArtist, { color: colors.textMuted }]}
                  text={currentSong.artist ?? ""}
                  animationThreshold={25}
                />
              </View>
            </TouchableOpacity>

            {/* Controls — standalone, no navigation */}
            <View style={styles.controlsContainer}>
              <PlayPauseButton iconSize={fontSize.lg} />
              <SkipToNextButton
                iconSize={fontSize.lg}
                handlePress={handlePlayNext}
              />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Animated.View
              style={{ backgroundColor: colors.primary, flex: progressRatio }}
            />
            <View style={{ flex: 1 - progressRatio }} />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default FloatingPlayer;

const styles = StyleSheet.create({
  trackTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  trackArtist: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    height: 3,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  trakDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
    height: 67,
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 4,
  },
  trackInfoTouchable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  parentContainer: {
    flexDirection: "column",
  },
});
