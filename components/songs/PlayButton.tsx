import { Colors } from "@/constants/Colors";
import useSongOperations from "@/hooks/useSongOperations";
import { playSong } from "@/hooks/useTrackPlayerActions";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react-native";
import React, { useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

const PlayButton = ({ song }: { song: Song }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const scale = useSharedValue(1);

  const { isBroadcasting, playSong: broadcastSong } = useSocketStore();
  const { currentUser, saveRecentlyPlayed } = useUserStore();
  const { currentRoom } = useRoomStore();

  const currentActiveTrack = useActiveTrack();
  const { playing: isPlaying } = useIsPlaying();

  const { saveRecentlyPlayedMutation } = useSongOperations();

  const isCurrentTrack = currentActiveTrack?.id === song?.id;

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const handleAction = useCallback(async () => {
    if (!song) return;

    if (isCurrentTrack && isPlaying) {
      await TrackPlayer.pause();
      return;
    }

    if (isBroadcasting && currentUser && currentRoom) {
      broadcastSong(
        currentUser._id,
        currentRoom?.roomId,
        song.id,
        null,
        0,
        currentUser
      );
      return;
    }

    // If it's the current track but not playing (paused/stopped), resume it
    if (isCurrentTrack && !isPlaying) {
      await TrackPlayer.play();
      return;
    }

    // Otherwise, play the new song
    await playSong(song);
    saveRecentlyPlayedMutation.mutate(song);
  }, [
    song,
    isCurrentTrack,
    isPlaying,
    isBroadcasting,
    currentUser,
    currentRoom,
    broadcastSong,
    saveRecentlyPlayedMutation,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Premium Dark Outer Ring */}
      <Animated.View
        style={[
          styles.outerRing,
          { borderColor: colors.accent + "30" },
          animatedStyle,
        ]}
      />

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleAction}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.fab,
            { backgroundColor: "#0A0A0A" }, // Deep premium dark background
            animatedStyle,
          ]}
        >
          {/* Subtle Accent Glow Overlay */}
          <View
            style={[
              styles.accentOverlay,
              { backgroundColor: colors.accent + "15" },
            ]}
          />

          <View style={styles.iconContainer}>
            {isCurrentTrack && isPlaying ? (
              <Pause
                fill={colors.accent}
                size={22}
                color={colors.accent}
                strokeWidth={2.5}
              />
            ) : (
              <Play
                fill={colors.accent}
                size={22}
                color={colors.accent}
                strokeWidth={2.5}
                style={{ marginLeft: 2 }}
              />
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  outerRing: {
    position: "absolute",
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
  },
  fab: {
    width: 56, // Reduced size for better ergonomics
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)", // High-end rim light
    overflow: "hidden",
  },
  accentOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  iconContainer: {
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlayButton;
