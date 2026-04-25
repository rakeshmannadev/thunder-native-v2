import { Song } from "@/types";
import React from "react";
import { Fab, FabIcon } from "../ui/fab";

import { Colors } from "@/constants/Colors";
import usePlayerStore from "@/store/usePlayerStore";
import useRoomStore from "@/store/useRoomStore";
import useSocketStore from "@/store/useSocketStore";
import useUserStore from "@/store/useUserStore";
import { PauseIcon, PlayIcon } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

const PlayButton = ({ song }: { song: Song }) => {
  const colorScheme = useColorScheme();
  const rotation = useSharedValue(0);

  const colors = Colors[colorScheme === "light" ? "light" : "dark"];

  const { isBroadcasting, playSong } = useSocketStore();
  const { currentUser, saveRecentlyPlayed } = useUserStore();
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

    const player = await TrackPlayer.getPlaybackState();
    if (player.state === "paused" && currentActiveTrack?.id === song._id) {
      await TrackPlayer.play();
      return;
    }

    await TrackPlayer.reset();

    await TrackPlayer.load({
      id: song._id,
      url: song.audioUrl,
      title: song.title,
      artist: song.artists.primary.map((artist) => artist.name).join(", "),
      artwork: song.imageUrl,
    });

    await TrackPlayer.play();
    await saveRecentlyPlayed(song._id);
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
          <FabIcon as={PlayIcon} fill={"#fff"} size="sm" color="white" />
        </Fab>
      )}
    </>
  );
};

export default PlayButton;
