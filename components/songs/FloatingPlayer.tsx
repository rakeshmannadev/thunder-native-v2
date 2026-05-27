import React, { useCallback, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { unknownTrackUri } from "@/constants/images";
import { borderRadius } from "@/constants/tokens";

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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls";
import { MovingText } from "./useMovingText";

const DISMISS_THRESHOLD = 60;

// Screens on which the floating mini-player bar should NOT be shown
const HIDE_ON_SCREENS = [
  "profile",
  "player",
  "auth",
  "Signup",
  "Login",
  "menu",
  "settings",
  "create_room",
];

const WITHOUT_TAB_BAR_SCREENS = [
  "library_content",
  "search",
  "notification",
  "[id]",
  "create-room",
];

type FloatingPlayerProps = {
  segments: string[];
};

const FloatingPlayer = React.memo(({ segments }: FloatingPlayerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const router = useRouter();
  const currentSong = useActiveTrack();
  const { bottom } = useSafeAreaInsets();

  // ── Progress via SharedValue (no JS re-renders) ───────────────────
  const progressValue = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!currentSong) {
      progressValue.value = 0;
      return;
    }

    const poll = async () => {
      try {
        const { position, duration } = await TrackPlayer.getProgress();
        if (duration > 0) {
          progressValue.value = position / duration;
        }
      } catch {
        // Player may not be ready yet
      }
    };

    // Initial poll
    poll();
    intervalRef.current = setInterval(poll, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSong?.id]);

  const progressStyle = useAnimatedStyle(() => ({
    flex: progressValue.value,
  }));

  const remainingStyle = useAnimatedStyle(() => ({
    flex: 1 - progressValue.value,
  }));

  // ── Visibility logic (self-contained) ─────────────────────────────
  const currentSegment = segments[segments.length - 1];
  const isHidden =
    currentSong === undefined ||
    HIDE_ON_SCREENS.includes(currentSegment) ||
    segments.includes("room" as never);

  // ── Positioning ───────────────────────────────────────────────────
  const bottomOffset = bottom + 8;
  const isWithoutTabBar = WITHOUT_TAB_BAR_SCREENS.includes(currentSegment);
  const bottomPosition = isWithoutTabBar ? bottomOffset : bottom + 58;

  // ── Swipe-down-to-dismiss ─────────────────────────────────────────
  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    if (currentSong?.id) {
      // Reset translation when a new song starts playing so it reappears
      translateY.value = withSpring(0, { damping: 40, stiffness: 200 });
    }
  }, [currentSong?.id, translateY]);

  const handleStop = useCallback(async () => {
    await TrackPlayer.reset();
  }, []);

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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: translateY.value > 0 ? Math.max(0, 1 - translateY.value / 150) : 1,
  }));

  if (isHidden) return null;

  const handlePlayNext = async () => {
    await TrackPlayer.skipToNext();
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 8,
            right: 8,
            bottom: bottomPosition,
            backgroundColor: colors.component,
            borderRadius: borderRadius.md,
            overflow: "hidden",
          },
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
                source={{ uri: currentSong?.artwork ?? unknownTrackUri }}
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
                  maskColor={colors.component}
                />
              </View>
            </TouchableOpacity>

            {/* Controls — standalone, no navigation */}
            <View style={styles.controlsContainer}>
              <PlayPauseButton iconSize={32} color={colors.text} />
              <SkipToNextButton
                iconSize={32}
                handlePress={handlePlayNext}
                color={colors.text}
              />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Animated.View
              style={[{ backgroundColor: colors.primary }, progressStyle]}
            />
            <Animated.View style={remainingStyle} />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

FloatingPlayer.displayName = "FloatingPlayer";

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
    overflow: "hidden",
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
