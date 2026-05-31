import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
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
  songs,
}: {
  color: string;
  handlePlay: () => void | Promise<void>;
  title: string;
  disabled?: boolean;
  songs: Song[];
}) => {
  const [isStarting, setIsStarting] = useState(false);
  const { socket, isJoined, isBroadcasting, playAlbum, roomId } =
    useSocketStore();
  const { currentUser } = useUserStore();

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
      // handle broadcast play
      if (socket && isJoined && isBroadcasting) {
        playAlbum(roomId, songs, currentUser);
        // handle local play
      } else {
        await handlePlay();
      }
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

  const isBroadcastingToRoom = socket && isJoined && isBroadcasting;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isStarting}
      style={[
        styles.playButton,
        { backgroundColor: isBroadcastingToRoom ? "#FF3B30" : color, opacity: disabled || isStarting ? 0.6 : 1 },
        isBroadcastingToRoom && {
          shadowColor: "#FF3B30",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 6,
        }
      ]}
    >
      {isStarting ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <MaterialCommunityIcons
          name={isBroadcastingToRoom ? "broadcast" : "play"}
          size={24}
          color="white"
        />
      )}
      <ThemedText style={styles.playButtonText}>
        {isStarting
          ? isBroadcastingToRoom
            ? "Broadcasting..."
            : "Starting..."
          : isBroadcastingToRoom
            ? "Broadcast Live"
            : title}
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
