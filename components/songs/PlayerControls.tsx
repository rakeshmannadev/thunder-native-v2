import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { useAudioPlayerStatus } from "expo-audio";
import {
  LoaderCircleIcon,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipForwardIcon,
} from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type PlayerControlsProps = {
  style?: ViewStyle;
};

type PlayerButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
  handlePress?: () => void;
};

export const PlayerControls = ({ style }: PlayerControlsProps) => {
  const { playNext, playPrevious } = usePlayerStore();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton handlePress={() => null} />

        <SkipToPreviousButton iconSize={30} handlePress={playPrevious} />

        <PlayPauseButton iconSize={30} />

        <SkipToNextButton iconSize={30} handlePress={playNext} />

        <RepeatButton handlePress={() => null} />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({ style, iconSize }: PlayerButtonProps) => {
  const { player } = usePlayer();
  const status = useAudioPlayerStatus(player);

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={status.playing ? () => player.pause() : () => player.play()}
      >
        {status.isBuffering ? (
          <LoaderCircleIcon
            size={iconSize}
            color={"#fff"}
            className="animate-spin"
          />
        ) : status.playing ? (
          <Pause size={iconSize} color={"#fff"} />
        ) : (
          <Play size={iconSize} color={"#fff"} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export const SkipToNextButton = ({
  iconSize = 30,
  handlePress,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <SkipForwardIcon size={iconSize} color={"#fff"} />
    </TouchableOpacity>
  );
};
export const SkipToPreviousButton = ({
  iconSize = 30,
  handlePress,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <SkipForwardIcon size={iconSize} color={"#fff"} />
    </TouchableOpacity>
  );
};
export const RepeatButton = ({
  iconSize = 30,
  handlePress,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Repeat size={iconSize} color={"#fff"} />
    </TouchableOpacity>
  );
};
export const ShuffleButton = ({
  iconSize = 30,
  handlePress,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Shuffle size={iconSize} color={"#fff"} />
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
