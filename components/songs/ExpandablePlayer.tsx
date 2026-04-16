import PlayerScreen from "@/app/player";

import usePlayerStore from "@/store/usePlayerStore";
import React, { useCallback, useEffect, useRef } from "react";
import {
  BackHandler,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FloatingPlayer from "./FloatingPlayer";

// Use "screen" to get full physical screen height (includes status bar on Android)
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

// ── Spring configs ──────────────────────────────────────────────────
// Expand: slightly under-damped for a satisfying snap into place
const EXPAND_SPRING = { damping: 28, stiffness: 260, mass: 0.8 };
// Collapse: critically damped — fast and decisive, no bounce
const COLLAPSE_SPRING = { damping: 36, stiffness: 320, mass: 0.9 };

const ExpandablePlayer = ({ bottomOffset = 0 }: { bottomOffset?: number }) => {
  const { currentSong, stopPlayer } = usePlayerStore();

  const { bottom, top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const MINI_PLAYER_HEIGHT = 70;
  // On Android, "screen" height includes status bar, so we need to offset
  const STATUS_BAR_OFFSET =
    Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 0;
  const COLLAPSED_Y =
    SCREEN_HEIGHT - MINI_PLAYER_HEIGHT - bottomOffset - STATUS_BAR_OFFSET;
  const EXPANDED_Y = 0;

  const translateY = useSharedValue(COLLAPSED_Y);
  const context = useSharedValue(0);

  // Track expanded state for BackHandler
  const isExpandedRef = useRef(false);

  const updateExpandedState = useCallback((expanded: boolean) => {
    isExpandedRef.current = expanded;
  }, []);

  // --- Actions ---
  const handleDismiss = () => {
    // stopPlayer sets isPlaying=false + currentSong=null
    // The sync effect in PlayerProvider will handle pausing the audio
    stopPlayer();
  };

  const expand = () => {
    "worklet";
    translateY.value = withSpring(EXPANDED_Y, EXPAND_SPRING);
    runOnJS(updateExpandedState)(true);
  };

  const collapse = () => {
    "worklet";
    translateY.value = withSpring(COLLAPSED_Y, COLLAPSE_SPRING);
    runOnJS(updateExpandedState)(false);
  };

  // Collapse from JS context (BackHandler, button press)
  const collapseFromJS = useCallback(() => {
    translateY.value = withSpring(COLLAPSED_Y, COLLAPSE_SPRING);
    isExpandedRef.current = false;
  }, [COLLAPSED_Y]);

  // Expand from JS context (FloatingPlayer tap)
  const expandFromJS = useCallback(() => {
    translateY.value = withSpring(EXPANDED_Y, EXPAND_SPRING);
    isExpandedRef.current = true;
  }, [EXPANDED_Y]);

  // Handle Android hardware back button
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isExpandedRef.current) {
          collapseFromJS();
          return true; // Prevent default (closing app)
        }
        return false; // Let default behavior happen
      }
    );
    return () => subscription.remove();
  }, [collapseFromJS]);

  // --- Gesture for the MINI player ---
  // Swipe UP = expand to full screen
  // Swipe DOWN = dismiss (stop & hide)
  const miniPlayerGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value;
      translateY.value = Math.max(translateY.value, EXPANDED_Y);
      // Allow dragging down past collapsed position for dismiss
      translateY.value = Math.min(translateY.value, COLLAPSED_Y + 150);
    })
    .onEnd((event) => {
      // Swipe UP → expand
      if (event.translationY < -50 || event.velocityY < -500) {
        expand();
      }
      // Swipe DOWN → dismiss
      else if (event.translationY > 60 || event.velocityY > 500) {
        runOnJS(handleDismiss)();
      }
      // Snap back
      else {
        if (translateY.value < (COLLAPSED_Y + EXPANDED_Y) / 2) {
          expand();
        } else {
          collapse();
        }
      }
    });

  // --- Gesture for the FULL player ---
  // Swipe DOWN = collapse back to mini player
  const fullPlayerGesture = Gesture.Pan()
    .activeOffsetY(10) // Only activate on downward swipe (positive Y)
    .failOffsetY(-10) // Fail quickly on upward swipe so scrolling works
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      const newY = event.translationY + context.value;
      translateY.value = Math.max(EXPANDED_Y, Math.min(newY, COLLAPSED_Y));
    })
    .onEnd((event) => {
      // Swipe DOWN → collapse
      if (event.translationY > 50 || event.velocityY > 500) {
        collapse();
      }
      // Snap back to expanded
      else {
        expand();
      }
    });

  // ── Animated styles ───────────────────────────────────────────────
  // Normalised progress: 0 = fully expanded, 1 = fully collapsed
  const animatedContainerStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [EXPANDED_Y, COLLAPSED_Y],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: translateY.value }],
      // Margins: edge-to-edge when expanded → card inset when collapsed
      // Only kicks in during the last 30% of collapse for a clean morph
      marginHorizontal: interpolate(
        progress,
        [0.7, 1],
        [0, 8],
        Extrapolation.CLAMP
      ),
      // Border radius: 0 when full screen → rounded card when collapsed
      // Animates in the last 25% of collapse (like Spotify's card morph)
      borderRadius: interpolate(
        progress,
        [0.75, 1],
        [0, 12],
        Extrapolation.CLAMP
      ),
      height: SCREEN_HEIGHT,
      overflow: "hidden" as const,
    };
  });

  // Mini player: visible only when near collapsed position
  // Fades out over first 15% of expansion — quick and decisive
  const miniPlayerAnimatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [EXPANDED_Y, COLLAPSED_Y],
      [0, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      progress,
      [0.85, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      display: opacity === 0 ? ("none" as const) : ("flex" as const),
    };
  });

  // Full player: fades in smoothly over the top 40% of expansion
  // Overlaps with mini player fade-out so there's never a blank gap
  const fullPlayerAnimatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [EXPANDED_Y, COLLAPSED_Y],
      [0, 1],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      progress,
      [0, 0.35],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      display: opacity === 0 ? ("none" as const) : ("flex" as const),
    };
  });

  const fullPlayerAnimatedProps = useAnimatedProps(() => ({
    pointerEvents:
      translateY.value < COLLAPSED_Y * 0.3
        ? ("auto" as const)
        : ("none" as const),
  }));

  if (!currentSong) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.container, animatedContainerStyle, { bottom: 0 }]}
    >
      {/* Mini Player with its own gesture */}
      <GestureDetector gesture={miniPlayerGesture}>
        <Animated.View
          style={[
            miniPlayerAnimatedStyle,
            {
              position: "absolute",
              top: 0,
              left: 8,
              right: 8,
              height: MINI_PLAYER_HEIGHT,
              backgroundColor: colors.component,
              borderRadius: 12,
            },
          ]}
        >
          <FloatingPlayer
            style={{
              backgroundColor: "transparent",
              flex: 1,
            }}
            onExpand={expandFromJS}
          />
        </Animated.View>
      </GestureDetector>

      {/* Full Player — GestureDetector wraps the view itself so the
           pan gesture is attached to an actual touchable surface */}
      <GestureDetector gesture={fullPlayerGesture}>
        <Animated.View
          animatedProps={fullPlayerAnimatedProps}
          style={[
            StyleSheet.absoluteFill,
            fullPlayerAnimatedStyle,
            { backgroundColor: colors.background },
          ]}
        >
          <PlayerScreen
            isExpandableMode={true}
            onCollapse={collapseFromJS}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
});

export default ExpandablePlayer;
