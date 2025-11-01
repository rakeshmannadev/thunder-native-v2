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
  isRepeat?: boolean;
};

export const PlayerControls = ({ style }: PlayerControlsProps) => {
  const { playNext, playPrevious, setShuffle, isShuffle } = usePlayerStore();
  const { player, status } = usePlayer();
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  const handlePlayNext = () => {
    player.pause();
    player.seekTo(0);
    playNext();
  };
  const handlePlayPrevious = () => {
    player.pause();
    player.seekTo(0);
    playPrevious();
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <ShuffleButton handlePress={handleShuffle} isShuffle={isShuffle} />

        <SkipToPreviousButton iconSize={30} handlePress={handlePlayPrevious} />

        <PlayPauseButton iconSize={30} />

        <SkipToNextButton iconSize={30} handlePress={handlePlayNext} />

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
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  const { player, status } = usePlayer();

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
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
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
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
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
  isRepeat,
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      {isRepeat ? (
        <Repeat1
          size={iconSize}
          color={location === "/player" ? "#fff" : colors.text}
        />
      ) : (
        <Repeat
          size={iconSize}
          color={location === "/player" ? "#fff" : colors.text}
        />
      )}
    </TouchableOpacity>
  );
};
export const ShuffleButton = ({
  iconSize = 30,
  handlePress,
  isShuffle,
}: PlayerButtonProps) => {
  const location = usePathname();

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];
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
