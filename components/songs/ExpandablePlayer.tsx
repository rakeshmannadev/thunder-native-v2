import PlayerScreen from "@/app/player";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

const SPRING_CONFIG = { damping: 30, stiffness: 150 };

const ExpandablePlayer = ({ bottomOffset = 0 }: { bottomOffset?: number }) => {
  const { currentSong, stopPlayer } = usePlayerStore();
  const { player } = usePlayer();
  const { bottom, top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const MINI_PLAYER_HEIGHT = 70;
  const COLLAPSED_Y = SCREEN_HEIGHT - MINI_PLAYER_HEIGHT - bottomOffset;
  const EXPANDED_Y = 0;

  const translateY = useSharedValue(COLLAPSED_Y);
  const context = useSharedValue(0);

  // --- Actions ---
  const handleDismiss = () => {
    player.pause();
    stopPlayer();
  };

  const expand = () => {
    "worklet";
    translateY.value = withSpring(EXPANDED_Y, SPRING_CONFIG);
  };

  const collapse = () => {
    "worklet";
    translateY.value = withSpring(COLLAPSED_Y, SPRING_CONFIG);
  };

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
    .activeOffsetY([-10, 10])
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value;
      translateY.value = Math.max(translateY.value, EXPANDED_Y);
      translateY.value = Math.min(translateY.value, COLLAPSED_Y);
    })
    .onEnd((event) => {
      // Swipe DOWN → collapse
      if (event.translationY > 50 || event.velocityY > 500) {
        collapse();
      }
      // Swipe UP (shouldn't happen much but snap back)
      else {
        if (translateY.value < (COLLAPSED_Y + EXPANDED_Y) / 2) {
          expand();
        } else {
          collapse();
        }
      }
    });

  // --- Animated styles ---
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    marginHorizontal: interpolate(
      translateY.value,
      [EXPANDED_Y, COLLAPSED_Y],
      [0, 8],
      Extrapolation.CLAMP
    ),
    borderRadius: interpolate(
      translateY.value,
      [EXPANDED_Y, COLLAPSED_Y],
      [0, 12],
      Extrapolation.CLAMP
    ),
    height: SCREEN_HEIGHT,
  }));

  const miniPlayerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [COLLAPSED_Y, COLLAPSED_Y - 100],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      display: opacity === 0 ? ("none" as const) : ("flex" as const),
    };
  });

  const fullPlayerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [EXPANDED_Y + 100, EXPANDED_Y],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      display: opacity === 0 ? ("none" as const) : ("flex" as const),
    };
  });

  const fullPlayerAnimatedProps = useAnimatedProps(() => ({
    pointerEvents:
      translateY.value < 100 ? ("auto" as const) : ("none" as const),
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
            onExpand={() => runOnJS(expand)()}
          />
        </Animated.View>
      </GestureDetector>

      {/* Full Player with its own gesture */}
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
          onCollapse={() => runOnJS(collapse)()}
        />

        {/* Gesture zone ABOVE PlayerScreen so it can intercept swipe-down.
            pointerEvents="box-none" lets taps pass through to controls,
            while react-native-gesture-handler still detects pan gestures natively. */}
        <GestureDetector gesture={fullPlayerGesture}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
            pointerEvents="box-none"
          >
            <Animated.View
              style={{ height: "70%", width: "100%" }}
              pointerEvents="box-none"
            />
            <View style={{ flex: 1 }} pointerEvents="none" />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    overflow: "visible",
    zIndex: 1000,
  },
});

export default ExpandablePlayer;
