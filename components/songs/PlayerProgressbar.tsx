import { Colors } from "@/constants/Colors";
import { formatSecondsToMinutes } from "@/helpers/miscellaneous";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";

import { defaultStyles, utilsStyles } from "@/styles";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewProps,
} from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import TrackPlayer from "react-native-track-player";

// Stable no-op for renderBubble — avoids creating a new function on each render
const renderNoBubble = () => null;

export const PlayerProgressBar = React.memo(({ style }: ViewProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { isBroadcasting, currentRoom, seekSong } = useSocketStore();
  const { currentUser } = useUserStore();

  const isSliding = useSharedValue(false);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  // ── SharedValue-driven progress (no re-renders for slider) ────────
  const progressShared = useSharedValue(0);
  const [elapsedText, setElapsedText] = useState("0:00");
  const [remainingText, setRemainingText] = useState("0:00");
  const durationRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const { position, duration } = await TrackPlayer.getProgress();
        durationRef.current = duration;

        // Update SharedValue for the slider (UI thread, no re-render)
        if (!isSliding.value && duration > 0) {
          progressShared.value = position / duration;
        }

        // Only trigger React re-render when the displayed text actually changes
        const newElapsed = formatSecondsToMinutes(position);
        const newRemaining = formatSecondsToMinutes(
          Math.max(duration - position, 0)
        );

        setElapsedText((prev) => (prev !== newElapsed ? newElapsed : prev));
        setRemainingText((prev) =>
          prev !== newRemaining ? newRemaining : prev
        );
      } catch {
        // Player may not be ready
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const progress = useDerivedValue(() => progressShared.value);

  // ── Memoized Slider theme — only recreated when colors change ─────
  const sliderTheme = useMemo(
    () => ({
      minimumTrackTintColor: colors.primary,
      maximumTrackTintColor: colors.borderColor,
    }),
    [colors.primary, colors.borderColor]
  );

  const handleSlidingStart = useCallback(() => {
    isSliding.value = true;
  }, []);

  const handleValueChange = useCallback(
    async (value: number) => {
      if (
        isBroadcasting &&
        currentUser &&
        currentRoom &&
        currentRoom.admin === currentUser._id
      ) {
        seekSong(
          currentUser._id,
          currentRoom.roomId,
          value * durationRef.current
        );
      } else {
        await TrackPlayer.seekTo(value * durationRef.current);
      }
    },
    [isBroadcasting, currentRoom, currentUser]
  );

  const handleSlidingComplete = useCallback(() => {
    if (!isSliding.value) return;
    isSliding.value = false;
  }, []);

  return (
    <View style={style}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        containerStyle={utilsStyles.slider}
        thumbWidth={15}
        renderBubble={renderNoBubble}
        theme={sliderTheme}
        onSlidingStart={handleSlidingStart}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
      />

      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {elapsedText}
        </Text>

        <Text style={[styles.timeText, { color: colors.text }]}>
          {"-"} {remainingText}
        </Text>
      </View>
    </View>
  );
});

PlayerProgressBar.displayName = "PlayerProgressBar";

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 20,
  },
  timeText: {
    ...defaultStyles.text,
    opacity: 0.75,
    fontSize: 12,
    letterSpacing: 0.7,
    fontWeight: "500",
  },
});
