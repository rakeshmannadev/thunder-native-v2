import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewProps,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { borderRadius, fontSize } from "@/constants/tokens";

import { formatSecondsToMinutes } from "@/helpers/miscellaneous";
import usePlayerStore from "@/store/usePlayerStore";
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { useProgress } from "react-native-track-player";
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls";

const FloatingPlayer = ({
  style,
  onExpand,
}: ViewProps & { onExpand?: () => void }) => {
  const colorScheme = useColorScheme();

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const router = useRouter();

  const { currentSong, playNext } = usePlayerStore();
  // const { player } = usePlayer();
  // const status = useAudioPlayerStatus(player);
  // const { currentTime, duration } = status;

  const unknownTrackImageUri = require("../../assets/images/unknown_track.png");

  const { duration, position } = useProgress(250);

  // Plain JS ratio — no shared values needed for a simple flex progress bar
  const progressRatio = duration > 0 ? position / duration : 0;

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => onExpand?.()}
      activeOpacity={0.9}
      style={[
        {
          backgroundColor: colors.component,
          borderRadius: borderRadius.md,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {/* <LinearGradient
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          borderRadius: 8,
          paddingVertical: 6,
        }}
        colors={["#2C5364", "#203A43", "#0F2027"]}
      > */}
      <View style={[styles.parentContainer, { width: "100%" }]}>
        <View style={styles.trakDetailsContainer}>
          <Image
            source={{ uri: currentSong?.imageUrl ?? unknownTrackImageUri }}
            style={styles.songImage}
          />

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[styles.trackTitle, { color: colors.text }]}
            >
              {currentSong.title ?? ""}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.trackArtist, { color: colors.textMuted }]}
            >
              {currentSong?.artists.primary.map((a) => a.name).join(",") ?? ""}
            </Text>
          </View>
          <View style={styles.controlsContainer}>
            <PlayPauseButton iconSize={fontSize.base} />
            <SkipToNextButton iconSize={fontSize.base} handlePress={playNext} />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Animated.View
            style={{ backgroundColor: colors.primary, flex: progressRatio }}
          />
          <View style={{ flex: 1 - progressRatio }} />
        </View>
      </View>
      {/* </LinearGradient> */}
    </TouchableOpacity>
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
    height: 67, // MINI_PLAYER_HEIGHT - progress_bar
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
  },
  parentContainer: {
    flexDirection: "column",
  },
});
