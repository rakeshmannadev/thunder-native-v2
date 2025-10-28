import { Song } from "@/types";
import React, { useEffect } from "react";
import { Fab, FabIcon } from "../ui/fab";

import { Colors } from "@/constants/Colors";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";
import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react-native";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const PlayButton = ({ song }: { song: Song }) => {
  const colorScheme = useColorScheme();
  const rotation = useSharedValue(0);

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { player, status } = usePlayer();

  const { currentSong, setCurrentSong } = usePlayerStore();

  const currentTrack = currentSong?.title === song.title;

  const handlePlaySong = async (song: Song) => {
    if (!song) return;

    if (currentTrack) {
      return player.play();
    }

    setCurrentSong(song);
  };
  const handlePauseSong = (song: Song) => {
    if (!song || !player.playing) return;

    player.pause();
  };

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
    <>
      {currentTrack && status.playing ? (
        <Fab
          onPress={() => handlePauseSong(song)}
          size="md"
          placement="bottom right"
          style={{
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.6,
            shadowRadius: 10,
          }}
        >
          <FabIcon as={PauseIcon} color="white" />
        </Fab>
      ) : (
        <Fab
          onPress={() => handlePlaySong(song)}
          size="md"
          placement="bottom right"
          style={{
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.6,
            shadowRadius: 10,
          }}
        >
          {status.isBuffering && currentSong?._id === song._id ? (
            <Animated.View style={rotationAnimationSyle}>
              <FabIcon as={Loader2Icon} color="white" />
            </Animated.View>
          ) : (
            <FabIcon as={PlayIcon} color="white" />
          )}
        </Fab>
      )}
    </>
  );
};

export default PlayButton;
