import { useCallback, useEffect, useState } from "react";

export const useTrackPlayerVolume = () => {
  const [volume, setVolume] = useState<number | undefined>(undefined);

  const getVolume = useCallback(async () => {
    // const currentVolume = await TrackPlayer.getVolume();
    // setVolume(currentVolume);
  }, []);

  const updateVolume = useCallback(async (newVolume: number) => {
    console.log("new volume", newVolume);
    if (newVolume < 0 || newVolume > 1) return;

    setVolume(newVolume);

    // await TrackPlayer.setVolume(newVolume);
  }, []);

  useEffect(() => {
    getVolume();
  }, [getVolume]);

  return { volume, updateVolume };
};
