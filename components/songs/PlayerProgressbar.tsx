import { Colors } from "@/constants/Colors";
import { formatSecondsToMinutes } from "@/helpers/miscellaneous";

import { defaultStyles, utilsStyles } from "@/styles";
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewProps,
} from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";

export const PlayerProgressBar = ({ style }: ViewProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { duration, position } = useProgress(250);

  const isSliding = useSharedValue(false);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const progress = useDerivedValue(() =>
    !isSliding.value && duration > 0 ? position / duration : 0
  );

  const trackElapsedTime = formatSecondsToMinutes(position);
  const trackRemainingTime = formatSecondsToMinutes(
    Math.max(duration - position, 0)
  );

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
          minimumTrackTintColor: colors.primary,
          maximumTrackTintColor: colors.borderColor,
        }}
        onSlidingStart={() => (isSliding.value = true)}
        onValueChange={async (value) => {
          await TrackPlayer.seekTo(value * duration);
        }}
        onSlidingComplete={async (value) => {
          if (!isSliding.value) return;
          isSliding.value = false;
          await TrackPlayer.seekTo(value * duration);
        }}
      />

      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: colors.text }]}>
          {trackElapsedTime}
        </Text>

        <Text style={[styles.timeText, { color: colors.text }]}>
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
    opacity: 0.75,
    fontSize: 12,
    letterSpacing: 0.7,
    fontWeight: "500",
  },
});
