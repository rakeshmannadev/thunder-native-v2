import { usePlayer } from "@/providers/PlayerProvider";

const usePlayerControls = () => {
  const { player } = usePlayer();

  const seekTo = (time: number) => {
    if (player) {
      player.seekTo(time);
    }
  };
  return { seekTo };
};

export default usePlayerControls;
