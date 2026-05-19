import { Colors } from "@/constants/Colors";
import { useTrackPlayerRepeatMode } from "@/hooks/usePlayerRepeatMode";
import usePlayerStore from "@/store/usePlayerStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import TrackPlayer, {
  RepeatMode,
  useIsPlaying,
} from "react-native-track-player";

type PlayerControlsProps = {
  style?: ViewStyle;
};

type PlayerButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
  handlePress?: () => void;
  isShuffle?: boolean;
  loopMode?: "off" | "all" | "one";
  color?: string;
};

export const PlayerControls = React.memo(({ style }: PlayerControlsProps) => {
  const { setShuffle, isShuffle } = usePlayerStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const handleShuffle = useCallback(() => {
    setShuffle(!isShuffle);
  }, [isShuffle, setShuffle]);

  const handlePlayNext = useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  const handlePlayPrevious = useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton
          handlePress={handleShuffle}
          iconSize={30}
          isShuffle={isShuffle}
          color={colors.text}
        />

        <SkipToPreviousButton
          iconSize={30}
          handlePress={handlePlayPrevious}
          color={colors.text}
        />

        <PlayPauseButton iconSize={60} color={colors.text} />

        <SkipToNextButton
          iconSize={30}
          handlePress={handlePlayNext}
          color={colors.text}
        />

        <PlayerRepeatToggle size={30} color={colors.text} />
      </View>
    </View>
  );
});


export const PlayPauseButton = React.memo(({
  style,
  iconSize = 48,
  color,
}: PlayerButtonProps) => {
  const { playing } = useIsPlaying();

  const handlePress = useCallback(() => {
    if (playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [playing]);

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
        <Ionicons
          name={playing ? "pause-circle" : "play-circle"}
          size={iconSize}
          color={color}
        />
      </TouchableOpacity>
    </View>
  );
});

export const SkipToNextButton = React.memo((
  { iconSize = 30, handlePress, style, color }: PlayerButtonProps
) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style}
    >
      <MaterialCommunityIcons
        name="skip-next"
        size={iconSize}
        color={color}
      />
    </TouchableOpacity>
  );
});
export const SkipToPreviousButton = React.memo(({
  iconSize = 30,
  handlePress,
  style,
  color,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style}
    >
      <MaterialCommunityIcons
        name="skip-previous"
        size={iconSize}
        color={color}
      />
    </TouchableOpacity>
  );
});

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">;

const repeatOrder = [
  RepeatMode.Off,
  RepeatMode.Track,
  RepeatMode.Queue,
] as const;

export const PlayerRepeatToggle = React.memo(({ color, ...iconProps }: IconProps) => {
  const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode();

  const toggleRepeatMode = useCallback(() => {
    if (repeatMode == null) return;
    const currentIndex = repeatOrder.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatOrder.length;
    changeRepeatMode(repeatOrder[nextIndex]);
  }, [repeatMode, changeRepeatMode]);

  const icon =
    repeatMode === RepeatMode.Off
      ? "repeat-off"
      : repeatMode === RepeatMode.Track
        ? "repeat-once"
        : "repeat";

  return (
    <MaterialCommunityIcons
      name={icon}
      onPress={toggleRepeatMode}
      color={color}
      {...iconProps}
    />
  );
});

export const ShuffleButton = React.memo(({
  iconSize = 48,
  handlePress,
  isShuffle,
  color,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <MaterialCommunityIcons
        name={isShuffle ? "shuffle-variant" : "shuffle-disabled"}
        size={iconSize}
        color={color}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
