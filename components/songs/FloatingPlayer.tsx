import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";

import { usePlayerBackground } from "@/hooks/usePlayerBackground";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { useAudioPlayerStatus } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { PlayPauseButton, SkipToNextButton } from "./PlayerControls";
import { MovingText } from "./useMovingText";

const FloatingPlayer = ({ style }: ViewProps) => {
  const { currentSong, playNext, isPlaying } = usePlayerStore();

  const { player } = usePlayer();
  const status = useAudioPlayerStatus(player);

  const unknownTrackImageUri = require("../../assets/images/unknown_track.png");

  const { imageColors } = usePlayerBackground(
    currentSong?.imageUrl ?? unknownTrackImageUri
  );
  const router = useRouter();

  // useEffect(() => {
  //   if (status.isLoaded && !status.playing) {
  //     return player.play();
  //   } else if (status.didJustFinish && !status.playing) {
  //     playNext();
  //   }
  // }, [status.didJustFinish, status.isLoaded]);

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => router.navigate("/player")}
      activeOpacity={0.9}
      style={[{}, style]}
    >
      <LinearGradient
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          borderRadius: 12,
          paddingVertical: 10,
        }}
        colors={["#C1272D", "#1B1B1B", "#000000"]}
      >
        <Image
          source={{ uri: currentSong?.imageUrl ?? unknownTrackImageUri }}
          className="w-10 h-10 rounded-xl"
        />
        <View className="flex-1 overflow-hidden ml-2">
          <MovingText
            text={currentSong.title ?? ""}
            animationThreshold={25}
            style={styles.trackTitle}
          />
          <MovingText
            text={
              currentSong?.artists.primary.map((a) => a.name).join(",") ?? ""
            }
            animationThreshold={25}
            style={styles.trackArtist}
          />
        </View>
        <View className="flex flex-row items-center gap-5 mr-4 pl-4">
          <PlayPauseButton iconSize={24} />

          <SkipToNextButton iconSize={24} handlePress={playNext} />
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
});
