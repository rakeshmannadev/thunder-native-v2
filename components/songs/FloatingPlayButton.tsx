import { Colors } from "@/constants/Colors";
import useSongOperations from "@/hooks/useSongOperations";
import { playSong } from "@/hooks/useTrackPlayerActions";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Song } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const FloatingPlayButton = ({ song }: { song: Song }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const scale = useSharedValue(1);

  const { isBroadcasting, playAlbum, roomId, currentRoom, pauseSong } =
    useSocketStore();
  const { currentUser } = useUserStore();

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

  const outerRingColor = isBroadcasting ? "#FF3B30" : colors.accent + "30";
  const fabBgColor = isBroadcasting ? "#FF3B30" : "#0A0A0A";
  const fabBorderColor = isBroadcasting
    ? "rgba(255,255,255,0.2)"
    : "rgba(255,255,255,0.08)";
  const iconColor = isBroadcasting ? "#FFFFFF" : colors.accent;

  const handleAction = useCallback(async () => {
    if (!song) return;
    const isAdmin =
      isBroadcasting && !!currentUser && currentUser._id === currentRoom?.admin;
    // 1. Admin broadcast controls take priority
    if (isAdmin) {
      if (isCurrentTrack && isPlaying) {
        const { position } = await TrackPlayer.getProgress();
        pauseSong(currentUser!._id, roomId, position);
      } else {
        playAlbum(roomId, [song], currentUser);
      }
      return;
    }

    // 2. Local play / pause for the currently active track
    if (isCurrentTrack) {
      isPlaying ? await TrackPlayer.pause() : await TrackPlayer.play();
      return;
    }

    // 3. Play a new song locally
    await playSong(song);
    if (currentUser) {
      saveRecentlyPlayedMutation.mutate(song);
    }
  }, [
    song,
    isCurrentTrack,
    isPlaying,
    currentUser,
    roomId,
    pauseSong,
    playAlbum,
    saveRecentlyPlayedMutation,
    isBroadcasting,
    currentRoom,
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
          { borderColor: outerRingColor },
          isBroadcasting && {
            borderColor: "rgba(255, 59, 48, 0.35)",
            borderWidth: 1,
          },
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
            { backgroundColor: fabBgColor, borderColor: fabBorderColor },
            isBroadcasting && {
              shadowColor: "#FF3B30",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 6,
            },
            animatedStyle,
          ]}
        >
          {/* Subtle Accent Glow Overlay */}
          <View
            style={[
              styles.accentOverlay,
              {
                backgroundColor: isBroadcasting
                  ? "rgba(255,255,255,0.1)"
                  : colors.accent + "15",
              },
            ]}
          />

          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={
                isCurrentTrack && isPlaying
                  ? "pause"
                  : isBroadcasting
                    ? "broadcast"
                    : "play"
              }
              fill={iconColor}
              size={24}
              color={iconColor}
              strokeWidth={2.5}
            />
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
    ...StyleSheet.absoluteFill,
    borderRadius: 28,
  },
  iconContainer: {
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingPlayButton;
