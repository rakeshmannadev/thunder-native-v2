import { Colors } from "@/constants/Colors";
import { usePlayer } from "@/providers/PlayerProvider";
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
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

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
  const { player, status } = usePlayer();
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  const handlePlayNext = () => {
    if (player.playing) player.pause();
    // player.seekTo(0); // Optional: reset position? playNext handles new song.
    playNext();
  };
  const handlePlayPrevious = () => {
    if (player.playing) player.pause();
    // player.seekTo(0);
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
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { player, status } = usePlayer();
  // const { togglePlay } = usePlayerStore(); // Use store's togglePlay to keep sync?
  // Actually, UI usually just calls player.play/pause directly since Provider syncs state?
  // Provider syncs status.playing -> store.isPlaying.
  // If we assume Provider sync works, we can stick to player.play()/pause().

  const rotation = useSharedValue(0);

  const rotationAnimationSyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });
  useEffect(() => {
    if (status.isBuffering) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000 }),
        -1,
        false
      );
    }

    return () => {
      rotation.value = 0;
    };
  }, [status.isBuffering]);

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={status.playing ? () => player.pause() : () => player.play()}
      >
        {status.isBuffering ? (
          <Animated.View style={rotationAnimationSyle}>
            <LoaderCircleIcon size={iconSize} color={colors.text} />
          </Animated.View>
        ) : status.playing ? (
          <Pause
            size={iconSize}
            color={location === "/player" ? "#fff" : colors.text}
          />
        ) : (
          <Play
            size={iconSize}
            color={location === "/player" ? "#fff" : colors.text}
          />
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
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style} // Pass style
    >
      <SkipForwardIcon
        size={iconSize}
        color={location === "/player" ? "#fff" : colors.text}
      />
    </TouchableOpacity>
  );
};
export const SkipToPreviousButton = ({
  iconSize = 30,
  handlePress,
  style,
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={style} // Pass style
    >
      <SkipBackIcon
        size={iconSize}
        color={location === "/player" ? "#fff" : colors.text}
      />
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

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const iconColor = location === "/player" ? "#fff" : colors.text;

  // Decide icon and color based on mode
  // loopMode: "off" | "all" | "one"
  // "off": arrow color (dimmed?), but usually just standard color but "inactive" state.
  // Actually usually: off = grey/dim, on = primary/accent.
  // But here we rely on standard text color.

  // Let's use opacity for 'off'? or just same color?
  // Existing code didn't use opacity.

  const isOne = loopMode === "one";
  const isAll = loopMode === "all";
  const isOff = loopMode === "off";

  // activeColor = Colors.light.tint; // Example accent color? Or just keep white/text.
  // Thunder setup seems to use text color.
  // Let's stick to simple first:
  // "one" -> Repeat1
  // "all" -> Repeat (maybe bolder?)
  // "off" -> Repeat (dimmed opacity 0.5?)

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
  style,
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const iconColor = location === "/player" ? "#fff" : colors.text;

  const displayColor = !isShuffle
    ? location === "/player"
      ? "rgba(255,255,255,0.5)"
      : "grey"
    : iconColor;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      {!isShuffle ? (
        <ArrowRight
          size={iconSize}
          color={location === "/player" ? "#fff" : colors.text}
        />
      ) : (
        <Shuffle
          size={iconSize}
          color={location === "/player" ? "#fff" : colors.text}
        />
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
