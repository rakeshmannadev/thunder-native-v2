import { Song } from "@/types";
import React from "react";
import { Fab, FabIcon } from "../ui/fab";

import { Colors } from "@/constants/Colors";
import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react-native";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

const PlayButton = ({ song }: { song: Song }) => {
  const colorScheme = useColorScheme();
  const rotation = useSharedValue(0);

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { isBroadcasting, playSong } = useSocketStore();
  const { currentUser } = useUserStore();
  const { currentRoom } = useRoomStore();
  const { queue } = usePlayerStore();

  const currentActiveTrack = useActiveTrack();

  const { playing: isPlaying } = useIsPlaying();

  const currentTrack = currentActiveTrack?.id === song?._id;

  const handlePlaySong = async (song: Song) => {
    if (!song) return;

    if (isBroadcasting && currentUser && currentRoom) {
      playSong(
        currentUser._id,
        currentRoom?.roomId,
        song.songId,
        null,
        0,
        currentUser
      );
      return;
    }

    console.log("enters");
    // await TrackPlayer.reset();

    await TrackPlayer.add(
      {
        id: song._id,
        url: song.audioUrl,
        title: song.title,
        artist: song.artists.primary.map((artist) => artist.name).join(", "),
        artwork: song.imageUrl,
      },
      0
    );

    await TrackPlayer.play();
  };
  const handlePauseSong = () => {
    TrackPlayer.pause();
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

  return (
    <>
      {currentTrack && isPlaying ? (
        <Fab
          onPress={handlePauseSong}
          size="md"
          placement="bottom right"
          style={{
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.6,
            shadowRadius: 10,
          }}
        >
          <FabIcon as={PauseIcon} fill={"#fff"} size="sm" color="white" />
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
          {/* Removed isBuffering condition to avoid heavy frame-rate subscriptions */}
          {isPlaying && currentTrack ? (
            <Animated.View style={rotationAnimationSyle}>
              <FabIcon as={Loader2Icon} color="white" />
            </Animated.View>
          ) : (
            <FabIcon as={PlayIcon} fill={"#fff"} size="sm" color="white" />
          )}
        </Fab>
      )}
    </>
  );
};

export default PlayButton;
