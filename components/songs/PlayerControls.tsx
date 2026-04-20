import { colors } from "@/constants/tokens";
import usePlayerStore from "@/store/usePlayerStore";
import { usePathname } from "expo-router";
import {
  ArrowRight,
  LoaderCircleIcon,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, { useIsPlaying } from "react-native-track-player";

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
  const { playNext, playPrevious, setShuffle, isShuffle, loop, setLoop } =
    usePlayerStore();
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  const handlePlayNext = () => {
    playNext();
  };
  const handlePlayPrevious = () => {
    playPrevious();
  };

  const handleLoop = () => {
    if (loop === "off") setLoop("all");
    else if (loop === "all") setLoop("one");
    else setLoop("off");
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton handlePress={handleShuffle} isShuffle={isShuffle} />

        <SkipToPreviousButton iconSize={30} handlePress={handlePlayPrevious} />

        <PlayPauseButton iconSize={30} />

        <SkipToNextButton iconSize={30} handlePress={handlePlayNext} />

        <RepeatButton handlePress={handleLoop} loopMode={loop} />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({ style, iconSize }: PlayerButtonProps) => {
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
        {playing ? (
          <Pause size={iconSize} color={colors.icon} />
        ) : (
          <Play size={iconSize} color={colors.icon} />
        )}
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
      <SkipForwardIcon size={iconSize} color={colors.icon} />
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
      <SkipBackIcon size={iconSize} color={colors.icon} />
    </TouchableOpacity>
  );
};
export const RepeatButton = ({
  iconSize = 30,
  handlePress,
  loopMode = "off",
  style,
}: PlayerButtonProps) => {
  const location = usePathname();

  const iconColor = colors.icon;

  const isOne = loopMode === "one";
  const isAll = loopMode === "all";
  const isOff = loopMode === "off";

  const displayColor = isOff
    ? location === "/player"
      ? "rgba(255,255,255,0.5)"
      : "grey"
    : iconColor;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={style}>
      {isOne ? (
        <Repeat1 size={iconSize} color={iconColor} />
      ) : (
        <Repeat size={iconSize} color={displayColor} />
      )}
    </TouchableOpacity>
  );
};
export const ShuffleButton = ({
  iconSize = 30,
  handlePress,
  isShuffle,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      {!isShuffle ? (
        <ArrowRight size={iconSize} color={colors.icon} />
      ) : (
        <Shuffle size={iconSize} color={colors.icon} />
      )}
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
