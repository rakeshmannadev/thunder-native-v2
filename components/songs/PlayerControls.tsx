import { Colors } from "@/constants/Colors";
import { useTrackPlayerRepeatMode } from "@/hooks/usePlayerRepeatMode";
import usePlayerStore from "@/store/usePlayerStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
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
  const { audioPreference, setAudioPreference } = usePlayerStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const handleShuffle = useCallback(() => {
    const newShuffle = !audioPreference.shuffle;
    setAudioPreference({ ...audioPreference, shuffle: newShuffle });
  }, [audioPreference, setAudioPreference]);

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
          isShuffle={audioPreference.shuffle}
          color={colors.text}
        />

        <SkipToPreviousButton
          iconSize={45}
          handlePress={handlePlayPrevious}
          color={colors.text}
        />

        <PlayPauseButton iconSize={80} color={colors.text} />

        <SkipToNextButton
          iconSize={45}
          handlePress={handlePlayNext}
          color={colors.text}
        />

        <PlayerRepeatToggle size={30} color={colors.text} />
      </View>
    </View>
  );
});

export const PlayPauseButton = React.memo(
  ({ style, iconSize = 48, color }: PlayerButtonProps) => {
    const { playing } = useIsPlaying();
    const { isBroadcasting, currentJockey, pauseSong, roomId, seekSong } =
      useSocketStore();
    const { currentUser } = useUserStore();

    const handlePress = useCallback(async () => {
      const currentTime = (await TrackPlayer.getProgress()) ?? 0;
      if (
        isBroadcasting &&
        playing &&
        currentJockey?._id === currentUser?._id
      ) {
        return pauseSong(currentUser!._id, roomId, currentTime.position);
      } else if (
        isBroadcasting &&
        currentJockey?._id === currentUser?._id &&
        !playing
      ) {
        seekSong(currentUser!._id, roomId, currentTime.position);
      }
      if (playing) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
    }, [playing, isBroadcasting, roomId, currentJockey, currentUser]);

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
  }
);

export const SkipToNextButton = React.memo(
  ({ iconSize = 30, handlePress, style, color }: PlayerButtonProps) => {
    const { isBroadcasting, currentRoom } = useSocketStore();
    const { currentUser } = useUserStore();
    const isAdmin =
      isBroadcasting && !!currentUser && currentUser._id === currentRoom?.admin;
    return (
      <TouchableOpacity
        disabled={!isAdmin}
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
  }
);
export const SkipToPreviousButton = React.memo(
  ({ iconSize = 30, handlePress, style, color }: PlayerButtonProps) => {
    const { isBroadcasting, currentRoom } = useSocketStore();
    const { currentUser } = useUserStore();
    const isAdmin =
      isBroadcasting && !!currentUser && currentUser._id === currentRoom?.admin;
    return (
      <TouchableOpacity
        disabled={!isAdmin}
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
  }
);

type IconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, "name">;

const repeatOrder = [
  RepeatMode.Off,
  RepeatMode.Track,
  RepeatMode.Queue,
] as const;

export const PlayerRepeatToggle = React.memo(
  ({ color, ...iconProps }: IconProps) => {
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
  }
);

export const ShuffleButton = React.memo(
  ({ iconSize = 48, handlePress, isShuffle, color }: PlayerButtonProps) => {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <MaterialCommunityIcons
          name={isShuffle ? "shuffle-variant" : "shuffle-disabled"}
          size={iconSize}
          color={color}
        />
      </TouchableOpacity>
    );
  }
);

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
