import { colors } from "@/constants/tokens";
import { useTrackPlayerRepeatMode } from "@/hooks/usePlayerRepeatMode";
import usePlayerStore from "@/store/usePlayerStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
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
};

export const PlayerControls = ({ style }: PlayerControlsProps) => {
  const { setShuffle, isShuffle } = usePlayerStore();

  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  const handlePlayNext = async () => {
    await TrackPlayer.skipToNext();
  };
  const handlePlayPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton
          handlePress={handleShuffle}
          iconSize={30}
          isShuffle={isShuffle}
        />

        <SkipToPreviousButton iconSize={30} handlePress={handlePlayPrevious} />

        <PlayPauseButton iconSize={60} />

        <SkipToNextButton iconSize={30} handlePress={handlePlayNext} />

        <PlayerRepeatToggle size={30} />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({
  style,
  iconSize = 48,
}: PlayerButtonProps) => {
  const { playing } = useIsPlaying();

  const handlePress = () => {
    if (playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
        <Ionicons
          name={playing ? "pause-circle" : "play-circle"}
          size={iconSize}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SkipToNextButton = ({
  iconSize = 30,
  handlePress,
  style,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style} // Pass style
    >
      <MaterialCommunityIcons
        name="skip-next"
        size={iconSize}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};
export const SkipToPreviousButton = ({
  iconSize = 30,
  handlePress,
  style,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style} // Pass style
    >
      <MaterialCommunityIcons
        name="skip-previous"
        size={iconSize}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">;

const repeatOrder = [
  RepeatMode.Off,
  RepeatMode.Track,
  RepeatMode.Queue,
] as const;

export const PlayerRepeatToggle = ({ ...iconProps }: IconProps) => {
  const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode();

  const toggleRepeatMode = () => {
    if (repeatMode == null) return;

    const currentIndex = repeatOrder.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatOrder.length;

    changeRepeatMode(repeatOrder[nextIndex]);
  };

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
      color={colors.icon}
      {...iconProps}
    />
  );
};
export const ShuffleButton = ({
  iconSize = 48,
  handlePress,
  isShuffle,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <MaterialCommunityIcons
        name={isShuffle ? "shuffle-variant" : "shuffle-disabled"}
        size={iconSize}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

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
