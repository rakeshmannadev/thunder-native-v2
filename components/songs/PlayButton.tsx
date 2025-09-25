import React from "react";
import { Fab, FabIcon } from "../ui/fab";
import { Song } from "@/types";

import { PauseIcon, PlayIcon } from "lucide-react-native";
import { usePlayer } from "@/providers/PlayerProvider";
import usePlayerStore from "@/store/usePlayerStore";

const PlayButton = ({ song }: { song: Song }) => {
  const { player } = usePlayer();
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
  return (
    <>
      {currentTrack && player.playing ? (
        <Fab
          onPress={() => handlePauseSong(song)}
          size="md"
          placement="bottom right"
          className="bg-green-500 hover:bg-green-700 active:bg-green-800"
        >
          <FabIcon as={PauseIcon} color="black" />
        </Fab>
      ) : (
        <Fab
          onPress={() => handlePlaySong(song)}
          size="md"
          placement="bottom right"
          className="bg-green-500 hover:bg-green-700 active:bg-green-800"
        >
          <FabIcon as={PlayIcon} color="black" />
        </Fab>
      )}
    </>
  );
};

export default PlayButton;
