import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

import { colors } from "@/constants/tokens";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls";
import { MovingText } from "./useMovingText";

const FloatingPlayer = ({ style }: ViewProps) => {
  const router = useRouter();

  const { currentSong, playNext } = usePlayerStore();
  const { player } = usePlayer();
  const status = useAudioPlayerStatus(player);
  const { currentTime, duration } = status;

  const unknownTrackImageUri = require("../../assets/images/unknown_track.png");

  //? Calculate current progress of the song
  const progress = duration && duration > 0 ? currentTime / duration : 0;

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/player")}
      activeOpacity={0.9}
      style={[style]}
    >
      <LinearGradient
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          borderRadius: 8,
          paddingVertical: 6,
        }}
        colors={["#0F2027", "#203A43", "#2C5364"]}
      >
        <View style={styles.parentContainer}>
          <View style={styles.trakDetailsContainer}>
            <Image
              source={{ uri: currentSong?.imageUrl ?? unknownTrackImageUri }}
              className="w-14 aspect-square rounded-md"
            />
            <View className="flex-1 overflow-hidden ml-2">
              <MovingText
                text={currentSong.title ?? ""}
                animationThreshold={25}
                style={styles.trackTitle}
              />
              <MovingText
                text={
                  currentSong?.artists.primary.map((a) => a.name).join(",") ??
                  ""
                }
                animationThreshold={25}
                style={styles.trackArtist}
              />
            </View>
            <View className="flex flex-row items-center gap-5 mr-4 pl-4">
              <PlayPauseButton iconSize={24} />

              <SkipToNextButton iconSize={24} handlePress={playNext} />
            </View>
          </View>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={{ backgroundColor: colors.primary, flex: progress }}
            />
            <View style={{ flex: 1 - progress }} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default FloatingPlayer;

const styles = StyleSheet.create({
  trackTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    paddingLeft: 10,
  },
  trackArtist: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    paddingLeft: 8,
  },
  progressContainer: {
    height: 3,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#ff4d4d",
  },
  trakDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  parentContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: 4,
  },
});
