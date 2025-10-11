import { colors, fontSize } from "@/constants/tokens";
import { formatSecondsToMinutes } from "@/helpers/miscellaneous";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { defaultStyles, utilsStyles } from "@/styles";
import { useAudioPlayerStatus } from "expo-audio";
import { useEffect } from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export const PlayerProgressBar = ({ style }: ViewProps) => {
  const { currentSong } = usePlayerStore();
  const { player } = usePlayer();
  const status = useAudioPlayerStatus(player);

  const isSliding = useSharedValue(false);
  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const trackElapsedTime = formatSecondsToMinutes(status.currentTime);
  const trackRemainingTime = formatSecondsToMinutes(
    Math.max(status.duration - status.currentTime, 0)
  );
  useEffect(() => {
    if (status.didJustFinish) {
      progress.value = 0;
      isSliding.value = false;
    }
  }, [status.didJustFinish]);
  const updateProgress = () => {
    if (!isSliding.value) {
      progress.value =
        status.duration > 0 ? status.currentTime / status.duration : 0;
    }
  };
  scheduleOnRN(updateProgress);

  return (
    <View style={style}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        containerStyle={utilsStyles.slider}
        thumbWidth={15}
        renderBubble={() => null}
        theme={{
          minimumTrackTintColor: colors.minimumTrackTintColor,
          maximumTrackTintColor: colors.maximumTrackTintColor,
        }}
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          // await TrackPlayer.seekTo(value * duration);
          player.seekTo(value * status.duration);
        }}
        onSlidingComplete={async (value) => {
          // if the user is not sliding, we should not update the position
          if (!isSliding.value) return;

          isSliding.value = false;
          player.seekTo(value * status.duration);
          // await TrackPlayer.seekTo(value * duration);
        }}
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{trackElapsedTime}</Text>

        <Text style={styles.timeText}>
          {"-"} {trackRemainingTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 20,
  },
  timeText: {
    ...defaultStyles.text,
    color: colors.text,
    opacity: 0.75,
    fontSize: fontSize.xs,
    letterSpacing: 0.7,
    fontWeight: "500",
  },
});
