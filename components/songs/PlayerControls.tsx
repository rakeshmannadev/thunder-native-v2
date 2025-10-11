import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import {
  ArrowRight,
  LoaderCircleIcon,
  Pause,
  Play,
  Repeat,
  Repeat1,
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
  isShuffle?: boolean;
  isRepeat?: boolean;
};

export const PlayerControls = ({ style }: PlayerControlsProps) => {
  const { playNext, playPrevious, setShuffle, isShuffle } = usePlayerStore();
  const { player, status } = usePlayer();
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton handlePress={handleShuffle} isShuffle={isShuffle} />

        <SkipToPreviousButton iconSize={30} handlePress={playPrevious} />

        <PlayPauseButton iconSize={30} />

        <SkipToNextButton iconSize={30} handlePress={playNext} />

        <RepeatButton
          handlePress={() =>
            status.loop ? (player.loop = false) : (player.loop = true)
          }
          isRepeat={status.loop}
        />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({ style, iconSize }: PlayerButtonProps) => {
  const { player, status } = usePlayer();

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={status.playing ? () => player.pause() : () => player.play()}
      >
        {status.isBuffering ? (
          <LoaderCircleIcon size={iconSize} color={"#fff"} />
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
  isRepeat,
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      {isRepeat ? (
        <Repeat1 size={iconSize} color={"#fff"} />
      ) : (
        <Repeat size={iconSize} color={"#fff"} />
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
        <ArrowRight size={iconSize} color={"#fff"} />
      ) : (
        <Shuffle size={iconSize} color={"#fff"} />
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
