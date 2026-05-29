import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";

const PlayButton = ({
  color,
  handlePlay,
  title,
  disabled,
}: {
  color: string;
  handlePlay: () => void | Promise<void>;
  title: string;
  disabled?: boolean;
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const onPress = async () => {
    if (disabled || isStarting) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignore haptics error if not supported on the device/platform
    }

    setIsStarting(true);
    const startTime = Date.now();
    try {
      await handlePlay();
    } catch (error) {
      console.error("Failed to play song:", error);
    } finally {
      // Ensure the starting indicator displays for at least 800ms so it registers visually
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
      setIsStarting(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isStarting}
      style={[
        styles.playButton,
        { backgroundColor: color, opacity: disabled || isStarting ? 0.6 : 1 },
      ]}
    >
      {isStarting ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <MaterialCommunityIcons name="play" size={24} color="white" />
      )}
      <ThemedText style={styles.playButtonText}>
        {isStarting ? "Starting..." : title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default PlayButton;

const styles = StyleSheet.create({
  playButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
